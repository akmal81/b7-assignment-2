import bcrypt from "bcryptjs";
import { pool } from "../../db/schema"
import { ILoginUser, ISignupUser } from "./auth.interface";
import { AppError } from "../../errorHandller/appErrorHandller";
import jwt from "jsonwebtoken";
import config from "../../config/env";
import { StatusCodes } from "http-status-codes";

const signupUser = async (payload: ISignupUser) => {
    const { name, email, password, role } = payload;

    const hasPassword = await bcrypt.hash(password, 10)

    const isUserExists = await pool.query(`
            SELECT * FROM users WHERE email =  $1
        `, [email])

    if (!isUserExists) {
        throw new Error("User already exists");

    }

    const result = await pool.query(`
    INSERT INTO users(name, email, password, role)
    VALUES ($1, $2, $3, COALESCE($4,'contributor'))
    RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hasPassword, role]);

    return result;
}

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;
    const isUserExists = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [email])

    if (isUserExists.rows.length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Credentials!!");
    }

    const user = isUserExists.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Credentials!!");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }

    const accessToken = jwt.sign(jwtPayload, config.secret as string, { expiresIn: "10d" })
    delete user.password;
    return {
        token: accessToken,
        user: user

    };

}



export const authService = {
    signupUser,
    loginUser,
}


