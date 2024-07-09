import { Request,Response } from "express";
import validation from "../utilities/validation";
import { workspaceModel } from "../models/workspace";
import { CustomReaquest } from "../types/customRequest";
import { userModel } from "../models/user";
import { boardModel } from "../models/boards";
import { io, userSocketMap } from "../utilities/socket";
import { invitationModel } from "../models/invitation";

export default {
    //Getting all the workspace details
    gettingWorkspace:async(req:CustomReaquest,res:Response)=>{
      try {
          const {userId} =  req.user
          // getting all the workspaces 
          const workspaces  = await workspaceModel.find({createdBy:userId}).select('createdBy description members name workspaceType _id') 
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
            name,
            workspaceType:type,
            description,
            members:[userId],
            createdBy:userId
          })
         const newWorkspace =  await workspace.save()
        //  const workspaceId = newWorkspace._id.toString()         
        const allWorkspaces = await workspaceModel.find({createdBy:userId})
          return res.status(200).json({message:'Workspace created successfully',newWorkspace,allWorkspaces})
        }
       } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
       }
        
    },
    // searching members
    searchingMembers:async (req:CustomReaquest,res:Response)=>{
      const {query}  = req.body
      const {email} = req.user
      
      //checking the searchquuery is less than 3 or not 
      if(!query || query.length <3){
        return res.status(400).json({err:'The query must be 3 character long'})
      }
      try {
        // searching the user 
        const searchList = await userModel.find({
          $and: [
            {
              $or: [
                { userName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
              ]
            },
            { email: { $ne: email } } // Exclude the current user
          ]
        }).select('userName email');
          
        res.status(200).json(searchList)
      } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error")
      }
    },
    //inviting members to the workspace
    invitingMembers:async(req:CustomReaquest,res:Response)=>{
      try {
        const { membersList, workspaceId,boardId } = req.body;
        const userId = req.user.userId
        if (!workspaceId && !boardId) {
          return res.status(404).json('workspace does not exist or boardId not exist');
        }
        const workspace = await workspaceModel.findById(workspaceId);
        const boards  =  await boardModel.findById(boardId)
        const invitations = [];
        // Emit Socket.IO events to notify the invited members
        for (const member of membersList) {
          const invitation = new invitationModel({
            userId: member._id,
            invitee:userId,
            workspaceId: workspaceId||null,
            boardId:boardId||null,
            message: `You have been invited to join the ${workspaceId ? workspace?.name : boards?.name}`
          });
          await invitation.save()
          invitations.push(invitation);
        };
        // inviting each members in the member list
        invitations.forEach((invitation) => {
          const socketId = userSocketMap[invitation.userId.toString()];
          if (socketId) {
            io.to(socketId).emit('receiveInvitation', invitation);
          } else {
            console.log(`User with ID ${invitation.userId} is not connected`);
          }
        });
    
        res.status(200).json('Workspace members added');
      } catch (error) {
        console.log(error);
        res.status(500).json('An error occurred');
      }
    },
    // getting single workspace detils
    workspaceDetails:async(req:Request,res:Response)=>{
      try {
        const workspaceId = req.params.workspaceId
        const workspaceDetails =await workspaceModel.findById(workspaceId).select('createdBy description members name workspaceType _id').populate('members')
        if(!workspaceDetails){
         return res.sendStatus(404)
        }
        else{
          const boards = await boardModel.find({workspace:workspaceId})
          if(boards?.length >0){
            return res.status(200).json({workspaceDetails,boards})
            
          }

          return res.status(200).json({workspaceDetails})
        }
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
      }
      
    },
    // deleting workspace
    deleteWorkspace:async (req:Request,res:Response)=>{
      try {
        const workspaceId = req.params.workspaceId
        if(!workspaceId){
         return res.sendStatus(404)
        } 
        const boards = await boardModel.find({workspace:workspaceId})
        // deleting the boards under the workspaces
        if(boards.length>0){
          await boardModel.deleteMany({workspace:workspaceId})
        }
        // deleting the workspace 
       await workspaceModel.findByIdAndDelete({_id:workspaceId})
       const newWorkspaces =  await workspaceModel.find()
        return res.status(200).json({msg:"workspace deleted successfully",newWorkspaces})

      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
        
      }
    },
    // get the pending invitations 
    getPendingInvitations:async(req:CustomReaquest,res:Response)=>{
      try {
        const userId = req.user.userId
        // getting the invitations with board / workspace name
        const invitations = await invitationModel.find({userId:userId,status:'pending'}).populate('workspaceId', 'name').populate('boardId','name').populate('invitee','name').select('_id workspaceId invitee boardId status message')        
        if(!invitations){
          return res.sendStatus(404)
        }    
        return res.status(200).send(invitations)   
      } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error')
      }
    }

}