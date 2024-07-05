import { Schema, model } from "mongoose";

export interface Tasks {
    taskName: string;
    position:number
    columnId:Schema.Types.ObjectId
    description?: string;
    dueDate?: Date;
    assignedTo?: Schema.Types.ObjectId[];
    status?: string;
    comments?: Schema.Types.ObjectId[];
    attachments?: string;
}

const taskCreation = new Schema<Tasks>({
    taskName: { type: String, required: true },
    description: { type: String, default: '' },
    columnId: { type: String, required: true },
    position: { type: Number, required: true },
    dueDate: { type: Date },
    assignedTo: { type: [Schema.Types.ObjectId], default: [] },
    status: { type: String, default: '' },
    comments: { type: [Schema.Types.ObjectId], default: [] },
    attachments: { type: String, default: '' }
}, { timestamps: true });

export const taskModel = model<Tasks>('tasks', taskCreation);
