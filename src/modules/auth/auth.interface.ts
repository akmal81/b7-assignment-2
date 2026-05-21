import { UserRoles } from "../../types";

export interface ISignupUser {
    name:string;
    email:string;
    password:string;
    role?: UserRoles; 
}


export interface ILoginUser{
    email:string;
    password:string;
}