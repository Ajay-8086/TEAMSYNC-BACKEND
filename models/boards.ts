import {Schema , model} from "mongoose"
export interface Board{
    boardName:string,
    workspace:Schema.Types.ObjectId,
    visibility:string,
    background:string
    members?:Schema.Types.ObjectId[]
}

const boardCreation = new Schema <Board>({
    boardName:{type:String,required:true},
    workspace:{type:[Schema.Types.ObjectId],ref:'workspaces'},
    visibility:{type:String},
    background:{type:String},
    members:{type:[Schema.Types.ObjectId],ref:'signups'}
},{timestamps:true})

export const boardModel = model <Board>('boards',boardCreation)