import { Schema, model,Types } from "mongoose"

export interface Column{
    columnName:string,
    boardId:string
    cards?:Types.ObjectId[]
}
const columnCreation = new Schema<Column>({
    columnName:{type:String,required:true},
    boardId:{type:String,required:true},
    cards:{type:[Schema.Types.ObjectId],ref:'tasks'}
},{timestamps:true})

export const columnModel = model<Column>('columns',columnCreation)
