import {Schema ,model}  from "mongoose";

export interface User{
    userName:string,
    email:string,
    password:string,
    verified:boolean
    
}

const userSignup = new Schema<User>({
    userName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verified:{type:Boolean,default:false}
},{timestamps:true})

export const userModel = model<User>('signups',userSignup)