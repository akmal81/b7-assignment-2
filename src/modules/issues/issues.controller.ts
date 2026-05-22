import { StatusCodes } from "http-status-codes";
import { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { issueService } from "./issues.service";
import sendRes from "../../utils/sendRes";
import { IUpdateIssue } from "./issues.interface";

const createIssue = catchAsync(
    async (req: Req, res: Res) => {
        const reporter_id = req.user.id
        const issueData = req.body;
        const payload = {
            ...issueData, reporter_id
        }

        console.log("issue controller", req.body);
        const result = await issueService.createIssue(payload);
        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        })
    }
);




const getAllIssue = catchAsync(
    async (req: Req, res: Res) => {
        const result = await issueService.getAllIssue();
        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
            // data: result.rows[0]
        })

    }
);


const getSingleIssue = catchAsync(
    async (req: Req, res: Res) => {
        const { id } = req.params;
        const result = await issueService.getSingleIssue(id as string);

        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: result
        })
    }
);



const updateIssue = catchAsync(
    async (req: Req, res: Res) => {
        
        const role = req.user.role;
        const userId = req.user.id;

        const payload:IUpdateIssue = {
            issueId:req.params.id as string,
            title: req.body.title,
            description: req.body.description,
            type:req.body.type,
            status:req.body.status,
            userRole: req.user.role,
            userId:req.user.id
        }


        const result = await issueService.updateIssue(payload);
        return sendRes(res, {
            statusCode: StatusCodes.OK,
            success: true,
             message: "Issue updated successfully",
            data: result
        })

    }
);
const deleteIssue = {};
export const issueController = {
    createIssue,
    getAllIssue,
    getSingleIssue,
    updateIssue,
    deleteIssue
}