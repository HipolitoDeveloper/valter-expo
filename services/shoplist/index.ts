import request from "../../common/api/request";
import {
    FindShoplistParams, FindShoplistResponse,
    UpdateShoplistBody,
    UpdateShoplistResponse
} from "./type";

const rootPath = '/shoplist';

const pathBuilder = (path: string) => `${rootPath}${path}`;

export const updateShoplist = async ({items}: UpdateShoplistBody): Promise<UpdateShoplistResponse> => {
    try {
        const response = await request.put(pathBuilder(''), {
            items
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const findShoplist = async ({id}: FindShoplistParams): Promise<FindShoplistResponse> => {
    try {
        const response = await request.get(pathBuilder(`/${id}`));
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};