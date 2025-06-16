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
        "name": string
    }
    resources: Resources
}