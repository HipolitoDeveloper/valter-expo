import request from "../../common/api/request";
import {FindPantryParams, FindPantryResponse} from "../pantry/type";
import {
    GetNotificationsResponse,
    HandleNotificationExpiresDetailsBody,
    HandleReadNotificationBody,
    UpdateResponse
} from "./type";

const rootPath = '/notification';

const pathBuilder = (path: string) => `${rootPath}${path}`;

export const getNotifications = async (): Promise<GetNotificationsResponse> => {
    try {
        const response = await request.get(pathBuilder(''), {
            params: {
                page: 1,
                limit: 10,
            }
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const handleReadNotification = async ({ids, isRead}: HandleReadNotificationBody): Promise<UpdateResponse> => {
    try {
        const response = await request.post(pathBuilder(`/read`), {
            ids,
            isRead
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const handleNotificationExpiresDetails = async ({
                                                           id,
                                                           isOut,
                                                           isExpired
                                                       }: HandleNotificationExpiresDetailsBody): Promise<UpdateResponse> => {
    try {
        const response = await request.put(pathBuilder(`/details`), {
            id,
            isOut,
            isExpired
        });
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};