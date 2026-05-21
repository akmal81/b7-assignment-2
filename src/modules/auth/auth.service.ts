import bcrypt from "bcryptjs";
import { pool } from "../../db/schema"

const signupUser = async (payload: any) => {
    const { name, email, password, role } = payload;

    const hasPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(`
    INSERT INTO users(name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hasPassword, role]);

    return result;
}

export const authService = {
    signupUser,
}


