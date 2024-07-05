import { Request,Response } from "express";
import { taskModel } from "../models/tasks";
import { columnModel } from "../models/columns";
export default{
    // creating task function 
    creatingTask:async(req:Request,res:Response)=>{
        try {
            const {columnId,taskName} = req.body
            
            const column = await columnModel.findById(columnId)
            if(!column){
                return res.status(404).send('No column found')
            }
            // getting the position from the card 
            const position = (column.cards?.length)            
            const tasks = new taskModel({
                columnId,
                taskName,
                position
            })
            const newTask =  await tasks.save()
            column.cards?.push(newTask._id)
            await column.save()
            return res.status(200).send(newTask)
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }
    }
}