export interface IUser {
    displayName: string;
    username: string;
    token: string;
    image?: string
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName: string;
    username: string;
}

