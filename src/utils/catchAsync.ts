import { NextFunction, Request, RequestHandler, Response } from "express";
import sendRes from "./sendRes";

export const catchAsync = (fn:RequestHandler)=>{
    return async (req:Request, res:Response, next:NextFunction) => {

        try {
            await fn(req, res, next)
        } catch (error:any) {
            sendRes(res,{
                statusCode:   error.statusCode || 500,
                success:false,
                message:error.message || "Internal Server Error",
                data:null,
                error:error
            }) 
            next(error)
        } 
    }
}