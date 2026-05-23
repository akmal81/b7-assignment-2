import { StatusCodes } from "http-status-codes";
import { pool } from "../../db/schema";
import { AppError } from "../../errorHandler/appErrorHandler";
import { IIssue, IIssueQuery, IIssueRes, IReporter, IUpdateIssue, Status, Type } from "./issues.interface"
import { UserRoles } from "../../types";

const createIssue = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;


    const result = await pool.query(`
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1, $2, $3, $4) RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
        `, [title, description, type, reporter_id]);

    return result;
}


const getAllIssue = async (queryParams: IIssueQuery) => {

    const { sort = 'newest', type, status } = queryParams;



    let selectStatement = 'SELECT * FROM issues';
    const typeStatus = [];
    const whereCondition = [];

    // if filter by type 
    if (type) {

        typeStatus.push(type);
        whereCondition.push(`type = $${typeStatus.length}`)   // $${typeStatus.length} = $1

    }


    // if filter by status

    if (status) {

        typeStatus.push(status);
        whereCondition.push(`status = $${typeStatus.length}`)
    }


    // where clasue 

    if (whereCondition.length > 0) {
        selectStatement += ' WHERE ' + whereCondition.join(' AND ')
    }


    // sorting 


    if (sort === 'oldest') {
        selectStatement += ' ORDER BY created_at ASC ';

    } else {
        selectStatement += ' ORDER BY created_at DESC '
    }


    const issuesResult = await pool.query(selectStatement, typeStatus)
    const issues = issuesResult.rows;

    if (issues.length === 0) {
        throw new AppError(StatusCodes.NOT_FOUND, "No Issues Found!!")
    }

    const reporterId = Array.from(new Set(issues.map(i => i.reporter_id)));

    const reporterIdForIN = reporterId.map((_, idx) => `$${idx + 1}`).join(', ')

    const userQuery = `SELECT id, name, role FROM users WHERE id IN (${reporterIdForIN})`

    const usersResult = await pool.query(userQuery, reporterId)

    const users: IReporter[] = usersResult.rows;

    const userMap: Record<number, IReporter> = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<number, IReporter>);



    const formattedIssues: IIssueRes[] = issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userMap[issue.reporter_id] || null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));

    return formattedIssues

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

    const newTitle = title || issue.title;
    const newDescription = description || issue.description;
    const newType = type || issue.type



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


const deleteIssue = async (issueId: string, role: UserRoles) => {

    const isIssueExists = await pool.query(`SELECT * FROM issues WHERE id = $1`, [issueId]);

    if (!isIssueExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Issue not found")
    }

    if (role !== 'maintainer') {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Only maintainer can delete Issue!!!")
    }

    return await pool.query(`DELETE FROM issues WHERE id = $1`, [issueId]);


}

export const issueService = {
    createIssue,
    getAllIssue,
    getSingleIssue,
    updateIssue,
    deleteIssue
}