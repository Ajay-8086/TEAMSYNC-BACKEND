import { Request,Response } from "express";
import validation from "../utilities/validation";
import { workspaceModel } from "../models/workspace";
import { CustomReaquest } from "../types/customRequest";
import { userModel } from "../models/user";
export default {
    //Getting all the workspace details
    gettingWorkspace:async(req:CustomReaquest,res:Response)=>{
      try {
          const {userId} =  req.user
          // getting all the workspaces 
          const workspaces  = await workspaceModel.find({createdBy:userId}).select('createdBy description members workspaceName workspaceType _id')  
          if(!workspaces){
           return res.status(404).json('Workspace is not available')
          }
          res.status(200).send(workspaces)
      } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
      }
    },
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

      // getting single workspace detils
    workspaceDetails:async(req:Request,res:Response)=>{
      try {
        const workspaceId = req.params.workspaceId
        const workspaceDetails =await workspaceModel.findById(workspaceId).select('createdBy description members workspaceName workspaceType _id')
        if(!workspaceDetails){
         return res.sendStatus(404)
        }
        res.status(200).send(workspaceDetails)
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
      }
      
    }

}