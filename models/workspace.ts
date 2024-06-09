import {Schema,model} from "mongoose"

export interface Workspace{
    workspaceName:string,
    workspaceType:string,
    description?:string
}
const workspaceCreation = new Schema<Workspace>({
    workspaceName:{type:String,required:true},
    workspaceType:{type:String,required:true},
    description:{type:String}
},{timestamps:true})

export const workspaceModel = model<Workspace>('workspace',workspaceCreation)