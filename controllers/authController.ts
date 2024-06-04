import { userModel } from "../models/user";
import { Request , Response } from "express";
import validation from "../utilities/validation";
import bcrypt from "bcrypt"
import sendMail from "../utilities/sendOtpMail";
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
         return res.status(400).json('User already exist')
        }else if(!validation.validatioField([userName,email,password,confirmPassword])){
         return res.status(400).json('All fields are required')
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
         const userId = newUser._id
         // storin the otp in the otpStore variable 
         otpStore.set(userId,{gernerateOtp})
         // sending the otp to the email
         console.log(otpStore);
         await sendMail(email, gernerateOtp);
         res.status(200).json('User registered successfully')
        }
    } catch (error) {
        console.log(error);
    }
 } ,
}