import {RequestHandler} from "express";
import { Next, Req, Res } from "../types";

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Req, res: Res, next: Next) => {

        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}