import {Schema , model} from "mongoose"
export interface Board{
    boardName:string,
    workspace:Schema.Types.ObjectId,
    visibility:string,
    background:string
    members?:Schema.Types.ObjectId[],
    stared?:boolean
}

const boardCreation = new Schema <Board>({
    boardName:{type:String,required:true},
    workspace:{type:Schema.Types.ObjectId,ref:'workspaces'},
    visibility:{type:String},
    background:{type:String},
    stared:{type:Boolean,default:false},
    members:{type:[Schema.Types.ObjectId],ref:'signups'}
},{timestamps:true})

export const boardModel = model <Board>('boards',boardCreation) 