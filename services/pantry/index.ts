import request from "../../common/api/request";
import {
    FindPantryParams, FindPantryResponse,
    UpdatePantryBody,
    UpdatePantryResponse
} from "./type";

const rootPath = '/pantry';

const pathBuilder = (path: string) => `${rootPath}${path}`;

export const updatePantry = async ({items}: UpdatePantryBody): Promise<UpdatePantryResponse> => {
    try {
        const response = await request.put(pathBuilder(''), {
            items
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const findPantry = async ({id}: FindPantryParams): Promise<FindPantryResponse> => {
    try {
        const response = await request.get(pathBuilder(`/${id}`));
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};