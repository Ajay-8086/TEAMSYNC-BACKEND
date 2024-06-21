import { Request,Response } from "express";
import { boardModel } from "../models/boards";
export default{
    // creating the boards
    creatingBoard:async(req:Request,res:Response)=>{
        try {
            const {boardName ,workSpace,visibility,background} = req.body
            if(!boardName){
               return res.status(400).send('Board name is required')
            }
            const boards  = new boardModel({
                boardName,
                workspace:workSpace,
                visibility,
                background
            })
            await boards.save()
           return res.status(201).send('Board created successfully')
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
            
        }   
    }
}