export const UserRoles = {
    contributor : 'contributor',
    maintainer: 'maintainer'
}

export type UserRoles =typeof UserRoles[keyof typeof UserRoles];