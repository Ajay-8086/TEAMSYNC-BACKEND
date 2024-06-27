import { Schema, model } from "mongoose";

export interface Profile{
    jobtitle:string,
    department:string,
    organization:string,
    location:string,
    userId:string
}

const userProfile = new Schema<Profile>({
    jobtitle:{type:String},
    department:{type:String},
    organization:{type:String},
    location:{type:String},  
    userId:{type:String,required:true}
},{timestamps:true})

export const profileModel = model<Profile>('profile',userProfile)