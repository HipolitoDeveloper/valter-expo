import reauthentication from "@/common/api/reauthentication";
import {SecureStoreKeys} from "@/common/secure-store/keys";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

import config from './config';
import HttpError from '../errors/http-error';
import isObject from '../utils/is-object';
import formatBlobAsJson from '../utils/format-blob-as-json';

const formatObjectForQueryParams = (paramBaseName, object) => {
    const newParams = {};

    Object.entries(object).forEach((entry) => {
        const [attributeName, newParamValue] = entry;
        const newParamKey = `${paramBaseName}[${attributeName}]`;

        newParams[newParamKey] = newParamValue;
    });

    return newParams;
};

const instance = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 120000,
    withCredentials: true,
});

instance.interceptors.request.use(async (options) => {
    const url = options?.url?.toString() ?? '';

    const isRefreshRequest = url.endsWith('/auth/refresh');
    const token = await SecureStore.getItemAsync(
        isRefreshRequest ? SecureStoreKeys.REFRESH_TOKEN : SecureStoreKeys.ACCESS_TOKEN
    );

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    const {params = {}} = options;

    let newParams = {...params};

    Object.entries(params).forEach((entry) => {
        const [key, value] = entry;

        if (isObject(value)) {
            delete newParams[key];
            newParams = {
                ...newParams,
                ...formatObjectForQueryParams(key, value),
            };
        }
    });

    return {
        ...options,
        params: newParams,
    };
});


instance.interceptors.response.use(
    (response) => Promise.resolve(response),
    async ({response, request, ...rest}) => {
        const handledByRefresh = reauthentication.interceptor(instance)({response, request, ...rest});
        if (handledByRefresh) return handledByRefresh;

        let statusCode = 0;
        let details = [];
        let jsonResponseData = {statusCode};

        if (response) {
            jsonResponseData = response.data
            if (response.data instanceof Blob) {
                jsonResponseData = await formatBlobAsJson(response.data);
            }

            statusCode = jsonResponseData.statusCode;
            details = jsonResponseData.message
        } else if (request) {
            jsonResponseData.statusCode = 503;
            details.push({
                axiosInfo: {
                    name: rest.name,
                    code: rest.code,
                    message: rest.message,
                },
            });
        }

        const err = new HttpError(statusCode, details);
        return Promise.reject(err);
    },
);

export default {
    instance,
    get: (url, options) => instance.get(url, options),
    post: (url, data, options) => instance.post(url, data, options),
    put: (url, data, options) => instance.put(url, data, options),
    patch: (url, data, options) => instance.patch(url, data, options),
    delete: (url, options) => instance.delete(url, options),
    reauthenticate: () => reauthentication.tryReauthentication(instance),
};
