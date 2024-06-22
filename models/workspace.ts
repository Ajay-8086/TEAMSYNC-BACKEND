import {Schema,model} from "mongoose"

export interface Workspace{
    workspaceName:string,
    workspaceType:string,
    description?:string,
    members?:Schema.Types.ObjectId[]
    createdBy:Schema.Types.ObjectId
}
const workspaceCreation = new Schema<Workspace>({
    workspaceName:{type:String,required:true},
    workspaceType:{type:String,required:true},
    description:{type:String},
    members:{type:[Schema.Types.ObjectId],ref:'signups'},
    createdBy:{type:Schema.Types.ObjectId,ref:'signups'}
},{timestamps:true})

export const workspaceModel = model<Workspace>('workspaces',workspaceCreation)