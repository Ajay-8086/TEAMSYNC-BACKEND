import { model, Schema } from "mongoose";

export interface Invitation{
    userId:Schema.Types.ObjectId,
    workspaceId?:Schema.Types.ObjectId,
    boardId?:Schema.Types.ObjectId,
    invitee:Schema.Types.ObjectId,
    status:string,
    message:string,
    viewed:boolean
}

const invitation = new Schema<Invitation>({
    userId:{type:Schema.Types.ObjectId,required:true},
    workspaceId:{type:Schema.Types.ObjectId,ref:'workspaces'},
    boardId:{type:Schema.Types.ObjectId,ref:'boards'},
    invitee:{type:Schema.Types.ObjectId,ref:'signups'},
    status:{type:String,enum:['pending','accepted','rejected'],default:'pending'},
    message:{type:String},
    viewed:{type:Boolean,default:false}
},{timestamps:true})
export const invitationModel = model<Invitation>('invitations',invitation)
