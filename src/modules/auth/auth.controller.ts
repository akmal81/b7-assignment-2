import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Req, Res } from "../../types";
import { authService } from "./auth.service";
import sendRes from "../../utils/sendRes";

const signupUser =catchAsync(
    async (req:Req, res:Res) => {
        const result = await authService.signupUser(req.body);
        sendRes(res, {
            statusCode: 201,
            success:true,
            message:"User Created Successfully!",
            data:result.rows[0]
        })
    }
)


export const authController ={
    signupUser
}