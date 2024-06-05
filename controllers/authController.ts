import { userModel } from "../models/user";
import { Request , Response } from "express";
import validation from "../utilities/validation";
import bcrypt from "bcrypt"
import sendMail from "../utilities/sendOtpMail";
import jwt from 'jsonwebtoken';
//otp storing space
const otpStore = new Map()
export default{
   //user signup 
 createUser: async(req:Request,res:Response)=>{
    try {   
        const {userName,email,password,confirmPassword} = req.body
        const userExist = await userModel.findOne({email})
        // checking user exist or not
        if(userExist){
         if(!userExist.verified){
            // generating random otp
            const gernerateOtp =  Math.floor(1000 + Math.random() * 9000)
            // sending the otp to the email
            await sendMail(email, gernerateOtp);
            const otpExpire = 10 * 60 * 1000
            // storin the otp in the otpStore variable 
            otpStore.set(email,{gernerateOtp,expire:Date.now() + otpExpire})
           return res.status(200).json({message:'user registered successfully',email})
         }
         return res.status(400).json('User already exist')
        }else if(!validation.validatioField([userName,email,password,confirmPassword])){
         return res.status(400).json('All fields are required')
        }else if(userName.trim() < 4){
         return res.status(400).json('User name should have atleast 4 character')
        }else if(!validation.emailValidation(email)){
         return res.status(400).json('Invalid email format')
        }else if(!validation.passwordValidation(password)){
         return res.status(400).json('Invalid password format')
        }else if(!validation.passwordMatch(password,confirmPassword)){
         return res.status(400).json('Password and confirm password should match')
        }else{
         // password hashing 
         const hashedPassword = await bcrypt.hash(password,10)
         const newUser=new userModel({
            userName,
            email,
            password:hashedPassword,
         })
         await newUser.save()
         // generating random otp
         const gernerateOtp =  Math.floor(1000 + Math.random() * 9000)
         // sending the otp to the email
         await sendMail(email, gernerateOtp);
         const otpExpire = 10 * 60 * 1000
         // storin the otp in the otpStore variable 
         otpStore.set(email,{gernerateOtp,expire:Date.now() + otpExpire})
         
         res.status(200).json({message:'user registered successfully',email})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
    }
 } ,
 // otp verification 
 verifyOtp:async(req:Request,res:Response)=>{
      try {
         const {otp,email} = req.body
         // getting the stored otp 
         const {gernerateOtp,expire} = otpStore.get(email)
         // checking the otp expiration
         if(expire < Date.now()){
            otpStore.delete(email); // deleting the stored otp
            return res.status(400).json('otp expired')
         } 
         // checking the otp valid or not
         if(gernerateOtp !== otp){ 
             return res.status(400).json('Invalid otp')
         }
         const existingUser = await userModel.findOne({email})
         if(existingUser){
             await userModel.updateOne({email:email},{$set:{verified:true}})
            otpStore.delete(email)
            return res.status(200).json('otp verification is success full')
         }else{
            return res.status(400).json('Invalid email')
         }
         // removing otp 
      } catch (error) {
         console.log('Internal server error');
         
      }
 },
   // user login 
      login:async(req:Request,res:Response)=>{
         try {
            const {email,password} = req.body
            if(!validation.validatioField([email,password])){
               return res.status(400).json({message:'Please fill all the fields'})
            }else if(!validation.emailValidation(email)){
               return res.status(422).json({message:'Invalid email format'})
            }else if(!validation.passwordValidation(password)){
               return res.status(422).json({message:'Invalid password format'})
            }
            // checkin the user exist or not
            const userExist = await userModel.findOne({email})
            if(userExist){
               if(userExist.verified){
                  // checking the password
                  const passwordMatch = await bcrypt.compare(password,userExist.password)
                  if(passwordMatch){
                     const payload = {
                        userId:userExist._id,
                        email:userExist.email,
                        userName:userExist.userName
                     }
                     const token = jwt.sign(payload,process.env.JWT_SECRET as string)
                     return res.status(200).json({message:'user login is success full',token})
                  }else{
                     return res.status(400).json({message:'Invalid password'})
                  }
               }else{
                  // generating random otp
                  const gernerateOtp =  Math.floor(1000 + Math.random() * 9000)
                  // sending the otp to the email
                  await sendMail(email, gernerateOtp);
                  const otpExpire = 10 * 60 * 1000
                  // storin the otp in the otpStore variable 
                  otpStore.set(email,{gernerateOtp,expire:Date.now() + otpExpire})
                  return res.status(403).json({message:'verification is required',email})
               }
            }else{
               return res.status(404).json('User doesnot exist')
            }
         } catch (error) {
            console.log('error',error);
            res.status(500).json({mesage:"Internal server error"})
         }
      }
}