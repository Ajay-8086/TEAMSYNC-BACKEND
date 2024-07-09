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
            const tasks = new taskModel({
                columnId,
                taskName
            })
            const newTask =  await tasks.save()
            column.cards?.push(newTask._id)
            await column.save()
            return res.status(200).send(newTask)
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }
    },
    //updating the position of the tasks
    updatingTaskAndColumn:async(req:Request,res:Response)=>{
        try {
            const {columnId, position,taskId ,newPos,moving,container} = req.body
            // checking the container if the data is moving in same container
            if(moving == 'same' && container == 'current'){
                const column = await columnModel.findById(columnId)
                if (column?.cards) {
                    // Remove taskId from the current position
                    column.cards.splice(position, 1);
    
                    // Add taskId to the new position
                    column.cards.splice(newPos, 0, taskId);
    
                    // Save the updated column
                    await column.save();
            }
            

        }else{
            const column = await columnModel.findById(columnId);
            if (column?.cards) {
                // checking the data is moving to the new container 
                if (container === 'new') {
                    // adding the task to the new position in the new container
                    column.cards.splice(newPos, 0, taskId);
                } else if (container === 'previous') {
                    // removing the task from the previous position 
                    column.cards.splice(position, 1);
                }
                await column.save();
            }
        }
        return res.status(200).send('Task and columns updated successfully');
    }catch (error) {
            console.log(error);
            return res.status(500).send('Internal server error')  
        }
    }
    }

