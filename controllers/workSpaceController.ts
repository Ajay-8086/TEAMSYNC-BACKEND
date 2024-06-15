import { Request,Response } from "express";
import validation from "../utilities/validation";
import { workspaceModel } from "../models/workspace";
import { CustomReaquest } from "../types/customRequest";
import { userModel } from "../models/user";
export default {
    // creating workspace function
    createWorkSpace:async(req:CustomReaquest,res:Response)=>{
       try {
        const {name,type,description} = req.body        
        const userId = req.user.userId
        if(!validation.validatioField([name,type])){
            return res.status(400).json('All field are required')
        }else{
          const workspace =   new workspaceModel({
            workspaceName:name,
            workspaceType:type,
            description,
            members:[userId],
            createdBy:userId
          })
         const newWorkspace =  await workspace.save()
         const workspaceId = newWorkspace._id.toString()         
          return res.status(200).json({message:'Workspace created successfully',workspaceId})
        }
       } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
       }
        
    },
    // searching members
    searchingMembers:async (req:Request,res:Response)=>{
      const {query}  = req.body
      //checking the searchquuery is less than 3 or not 
      if(!query || query.length <3){
        return res.status(400).json({err:'The query must be 3 character long'})
      }
      try {
        // searching the user 
        const searchList = await userModel.find({
          $or:[{
            userName:{$regex:query,$options:'i'},
            email:{$regex:query,$options:'i'}
          }]
          }).select('userName email')
        res.status(200).json(searchList)
      } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error")
      }
    },
   
}