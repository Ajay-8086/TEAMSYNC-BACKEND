
import jwt from "jsonwebtoken";
import {  type NextFunction, type Response } from 'express';
import { CustomReaquest } from "../types/customRequest";
export const veryifyToken = async (req:CustomReaquest,res:Response,next:NextFunction)=>{
    try {
        // getting token from the header
        const authHeader = String(req.headers['authorization'])
        
        if(!authHeader){
            res.sendStatus(401)
        }
        const token = authHeader.split(' ')[1];
        
        const data = jwt.verify(token,process.env.JWT_SECRET as string,(err,decoded)=>{
            if(err){
                return res.sendStatus(403)
            }
             req.user = decoded
            next()

        })
    } catch (error) {
        return res.status(500).json('Internal server error')
    }
}


