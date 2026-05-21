import { NextFunction, Request, Response } from "express"
import { UserRoles } from "../types/roles.type"
import sendRes from "../utils/sendRes";
import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config/env";
import { pool } from "../db/schema";


const auth = (...roles: UserRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.headers.authorization;
            if (!token) {
                sendRes(res, {
                    statusCode: 500,
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

            const user = userInfo.rows[0];


            if (userInfo.rows.length === 0) {
                sendRes(res, {
                    statusCode: 404,
                    success: false,
                    message: "Unauthorized: Invalid user account",
                })
            }

            req.user = decoded;

            if (roles.length && !roles.includes(user.role)) {
                sendRes(res, {
                    statusCode: 404,
                    success: false,
                    message: "Forbidden: Invalid user account",
                })

            }


            next()
        } catch (error) {
            next(error)
        }

    }
}