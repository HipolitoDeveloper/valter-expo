import request from "../../common/api/request";
import {AuthMeResponse, LoginParams, LoginResponse, RegisterParams, RegisterResponse} from "./type";

const rootPath = '/auth/';

const pathBuilder = (path: string) => `${rootPath}${path}`;

export const login = async ({email, password}: LoginParams): Promise<LoginResponse> => {
    try {
        const response = await request.post(pathBuilder('login'), {
            email,
            password
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const logout = async () => {
    try {
        const response = await request.post(pathBuilder('logout'));
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const me = async (): Promise<AuthMeResponse> => {
    try {
        const response = await request.get(pathBuilder('me'));
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const register = async ({email, password, firstName, surname, pantryName, birthday}: RegisterParams): Promise<RegisterResponse> => {
    try {
        const response = await request.post(pathBuilder('register'), {
            email,
            password,
            firstName,
            surname,
            pantryName,
            birthday
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};