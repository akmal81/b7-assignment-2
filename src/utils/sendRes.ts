
import { Res } from "../types";
import { IResponse } from "../types/response.type";

const sendRes =<T> (res:Res, data:IResponse<T>) =>{

res.status(data.statusCode).json(
    {
        success:data.success,
        message:data.message,
        data:data.data,
        error:data.error
    }
)}
export default sendRes;