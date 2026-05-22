import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Req, Res } from "../../types";
import { authService } from "./auth.service";
import sendRes from "../../utils/sendRes";
import { StatusCodes } from "http-status-codes";

const signupUser = catchAsync(
    async (req: Req, res: Res) => {
        const result = await authService.signupUser(req.body);
        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })
    }
)


const loginUser = catchAsync(
    async (req: Req, res: Res) => {
        const result = await authService.loginUser(req.body);
        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Login Successfull",
            data: result
        })
    }
)


export const authController = {
    signupUser,
    loginUser
}