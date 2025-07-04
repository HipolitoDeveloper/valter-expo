import {Resources} from "../../common/permission/type";

export type LoginParams = {
    email: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: {
        accessToken: number;
        refreshToken: number;
    },
    expiresAt: {
        accessToken: number;
        refreshToken: number;
    },
    firstName: string;
}

export type AuthMeResponse = {
    "surname": string,
    "id": string,
    "firstName": string,
    "email": string,
    "pantry": {
        id: string;
        "name": string
    }
    resources: Resources
}

export type RegisterParams = {
    email: string;
    password: string;
    "surname": string,
    "firstName": string,
    birthday: string,
    pantryName: string
}

export type RegisterResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: {
        accessToken: number;
        refreshToken: number;
    },
    expiresAt: {
        accessToken: number;
        refreshToken: number;
    },
    firstName: string;
}