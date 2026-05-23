import { StatusCodes } from "http-status-codes";
import { Next, Req, Res } from "../types";

export const globalErrorHandler = (
    error: any,
    req: Req,
    res: Res,
    next: Next,
) => {

    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";

    return res.status(statusCode).json(
        {
            success: false,
            message: message,
            errors: error
        }
    )
}