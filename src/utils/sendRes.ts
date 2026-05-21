import { Response } from "express";
import { IResponse } from "../types/response.type";

const sendRes =<T> (res:Response, data:IResponse<T>) =>{

res.status(data.statusCode).json(
    {
        success:data.success,
        message:data.message,
        data:data.data,
        error:data.error
    }
)}
export default sendRes;