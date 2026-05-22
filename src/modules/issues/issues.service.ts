import { StatusCodes } from "http-status-codes";
import { pool } from "../../db/schema";
import { AppError } from "../../errorHandler/appErrorHandler";
import { IIssue, IUpdateIssue } from "./issues.interface"

const createIssue = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;


    const result = await pool.query(`
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1, $2, $3, $4) RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
        `, [title, description, type, reporter_id]);

    return result;
}


const getAllIssue = async () => {

    const issueData = await pool.query(`
            SELECT * FROM issues 
        `);

    const users = await pool.query(`SELECT * FROM users`)

    console.log(issueData.rows);


}


const getSingleIssue = async (issueId: string) => {

    const singleIssueData = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        `, [issueId]);

    if (singleIssueData.rows.length === 0) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Issue Not Found!!")
    }

    const { id, title, description, type, status, reporter_id, created_at, updated_at } = singleIssueData.rows[0];

    const issueReporter = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`, [reporter_id]
    )

    const result = {
        id: id,
        title: title,
        description: description,
        type: type,
        status: status,
        reporter: issueReporter.rows[0],
        created_at: created_at,
        updated_at: updated_at
    }
    return result;
}


const updateIssue = async (payload: IUpdateIssue) => {

    const { issueId, title, description, type, status, userRole, userId } = payload

    const isIssueExists = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        `, [issueId])

    if (!isIssueExists) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Issue Not Found!!")
    }

    const issue = isIssueExists.rows[0]

    if (userRole === 'contributor') {
        if (issue.reporter_id !== userId) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorize to update the issue!!")
        }

        if (issue.status !== 'open') {
            throw new AppError(StatusCodes.CONFLICT, "You are not authorize to update the issue!!")
        }
    }

    const newTitle = payload.title || issue.title;
    const newDescription = payload.description || issue.description;
    const newType = payload.type || issue.type



    if (newDescription.trim().length < 20) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Description must be at least 20 characters long")
    }


    const result = await pool.query(`
            UPDATE issues 
        SET title = $1, description = $2, type = $3, status = COALESCE(status, $4), updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
            `, [newTitle, newDescription, newType, status, issueId])


    return result.rows[0]

}


const deleteIssue = async () => { }

export const issueService = {
    createIssue,
    getAllIssue,
    getSingleIssue,
    updateIssue,
    deleteIssue
}