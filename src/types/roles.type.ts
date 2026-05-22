import { UserRoles } from "../constant/userRole";


export type UserRoles =typeof UserRoles[keyof typeof UserRoles];