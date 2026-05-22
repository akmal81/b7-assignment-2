import { NextFunction, Request, Response } from "express"
import { UserRoles } from "../types/roles.type"
import sendRes from "../utils/sendRes";
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config/env";
import { pool } from "../db/schema";
import { StatusCodes } from "http-status-codes";


const auth = (...roles: UserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.headers.authorization;

            if (!token) {
                return sendRes(res, {
                    statusCode: StatusCodes.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized access. Token missing!",
                })
            }


            const decoded = jwt.verify(
                token as string,
                config.secret as string,
            ) as JwtPayload

            const userInfo = await pool.query(`
                SELECT * FROM users WHERE email = $1
                `, [decoded.email]);


            if (userInfo.rows.length === 0) {
                return sendRes(res, {
                    statusCode: StatusCodes.FORBIDDEN,
                    success: false,
                    message: "Unauthorized: Invalid user account",
                })
            }

            const user = userInfo.rows[0];

            req.user = decoded;

            if (roles.length && !roles.includes(user.role)) {
                return sendRes(res, {
                    statusCode:StatusCodes.FORBIDDEN,
                    success: false,
                    message: "Forbidden: Invalid user account",
                })

            }
            next()
        } catch (error) {
            next(error)
        }

    }
};


export default auth;