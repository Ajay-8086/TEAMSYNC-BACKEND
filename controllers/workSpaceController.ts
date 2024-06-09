import { Request,Response } from "express";
import validation from "../utilities/validation";
import { workspaceModel } from "../models/workspace";
export default {
    // creating workspace function
    createWorkSpace:async(req:Request,res:Response)=>{
       try {
        const {name,type,description} = req.body
        if(!validation.validatioField([name,type])){
            return res.status(400).json('All field are required')
        }else{
          const workspace =   new workspaceModel({
            workspaceName:name,
            workspaceType:type,
            description
          })
          await workspace.save()
          return res.status(200).json({message:'Workspace created successfully',workspace})
        }
       } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
       }
        
    }
}