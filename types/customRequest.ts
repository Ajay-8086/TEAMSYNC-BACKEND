import { Request } from "express";
export interface CustomReaquest extends Request{
    user?:any
}