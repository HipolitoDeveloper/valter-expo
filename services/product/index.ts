import request from "../../common/api/request";
import {LoginParams, LoginResponse} from "../auth/type";
import {FindAllProductParams, FindAllProductResponse} from "./type";

const rootPath = '/product';

const pathBuilder = (path: string) => `${rootPath}${path}`;

export const findAllProducts = async ({limit, page}: FindAllProductParams): Promise<FindAllProductResponse> => {
    try {
        const response = await request.get(pathBuilder(''), {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};