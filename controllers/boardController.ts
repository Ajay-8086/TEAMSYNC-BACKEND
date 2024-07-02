import { Request,Response } from "express";
import { boardModel } from "../models/boards";
import { workspaceModel } from "../models/workspace";
export default{
    // creating the boards
    creatingBoard:async(req:Request,res:Response)=>{
        try {
            const {boardName ,workspace,visibility,background} = req.body
            if(!boardName){
               return res.status(400).send('Board name is required')
            }
            const boards  = new boardModel({
                name:boardName,
                workspace,
                visibility,
                background
            })
          const newBoard =   await boards.save()
           return res.status(201).send(newBoard)
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
    },
    getBoardDetails: async (req:Request, res:Response) => {
        try {
            const { boardId } = req.params;
            // checking board id exist
            if (!boardId) {
                return res.sendStatus(404);
            }
            // getting board details 
            const boardDetails = await boardModel.findById(boardId);
            if (!boardDetails) {
                return res.sendStatus(404);
            }
            // getting wokspace under a board 
            const boardsInWorkspace = await boardModel.find({ workspace: boardDetails.workspace });
            // getting workspace details 
            const workspace = await workspaceModel.findById(boardDetails.workspace);  
            return res.status(200).json({ boardsInWorkspace, workspace ,boardDetails});
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal server error');
        }
    }
}
    