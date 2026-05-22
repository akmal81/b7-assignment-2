import { UserRoles } from "../../types";

const type = {
    bug: 'bug',
    feature_request: 'feature_request'
} as const

type Type = typeof type[keyof typeof type];


const status = {
    open: 'open',
    in_progress: 'in_progress',
    resolved: 'resolved'
}

type Status = typeof status[keyof typeof status]

export interface IIssue {
    title: string;
    description: string;
    type?: Type;
    status?: Status;
    reporter_id: number;
}


export interface IUpdateIssue {
    issueId: string;
    title: string;
    description: string;
    type?: Type;
    status?: Status;
    userRole: UserRoles;
    userId: number

}