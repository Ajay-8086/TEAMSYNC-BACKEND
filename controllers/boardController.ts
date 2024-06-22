import { Request,Response } from "express";
import { boardModel } from "../models/boards";
export default{
    // creating the boards
    creatingBoard:async(req:Request,res:Response)=>{
        try {
            const {boardName ,workspace,visibility,background} = req.body
            if(!boardName){
               return res.status(400).send('Board name is required')
            }
            const boards  = new boardModel({
                boardName,
                workspace,
                visibility,
                background
            })
            await boards.save()
           return res.status(201).send('Board created successfully')
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }   
    },
    // adding the star not star
    toggleStar:async(req:Request, res:Response)=>{
        try {
            const {boardId, isStared} = req.body
            // getting board details
            const board = await boardModel.findById(boardId)
            if(!board){
               return res.sendStatus(404)
            }
            await boardModel.findOneAndUpdate({_id:boardId},{$set:{stared:isStared}})
            res.status(200).send('board stared')
            
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
            
        }
    }
}