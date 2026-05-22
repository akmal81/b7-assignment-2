import { UserRoles } from "../../types";

const type = {
    bug: 'bug',
    feature_request: 'feature_request'
} as const

export type Type = typeof type[keyof typeof type];


const status = {
    open: 'open',
    in_progress: 'in_progress',
    resolved: 'resolved'
}

export type Status = typeof status[keyof typeof status]

export interface IIssue {
    title: string;
    description: string;
    type?: Type;
    status?: Status;
    reporter_id: number;
}

// get All issue 







// update issue
export interface IUpdateIssue {
    issueId: string;
    title: string;
    description: string;
    type?: Type;
    status?: Status;
    userRole: UserRoles;
    userId: number

}




export type IIssueQuery = {
    sort?: 'newest' | 'oldest';
    type?: Type;
    status?: Status;
}

export interface IReporter {
    id: number;
    name: string;
    role: 'contributor' | 'maintainer';
}

export interface IIssueRes {
    id: number;
    title: string;
    description: string;
    type: Type;
    status: Status;
    reporter: IReporter | null;
    created_at: Date;
    updated_at: Date
}