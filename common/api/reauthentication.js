import {SecureStoreKeys} from "@/common/secure-store/keys";
import * as SecureStore from "expo-secure-store";

let isRefreshing = false;
const requestsToRetry = [];

const refreshAuthenticationRoute = '/auth/refresh';
const loginRoute = '/auth/login';

async function tryReauthentication(instance) {

    await instance.get(refreshAuthenticationRoute);

}

function subscribeFunctionToTokenRefresh(functionToRetry) {
    requestsToRetry.push(functionToRetry);
}

function retryRequests(refreshHasFailed) {
    const requestsToRetryLength = requestsToRetry.length;
    for (let index = 0; index < requestsToRetryLength; index += 1) {
        requestsToRetry.shift()(refreshHasFailed);
    }
}

const interceptor = (instance) => (error) => {
    const {response, config: requestConfig} = error;
    const originalRequest = requestConfig;

    if (originalRequest.url === refreshAuthenticationRoute || originalRequest.url === loginRoute) {
        return Promise.reject(error);
    }

    let status = null;
    if (response) {
        status = response.status;
    }

    /**
     * this url verification is used to know if the requisition
     * is to an endpoint to get user information
     *
     * due to an error on the OPTION endpoint of this route the requisition does not return
     * a HTTP status if the token is invalid, it simply blocks the request with CORS error,
     * as isn't possible to know if the error is caused by an invalid token, the requisition
     * will be re tried with a new token no matter the error.
     *
     */
    if (status === 401) {
        const retryOrigReq = new Promise((resolve, reject) => {
            subscribeFunctionToTokenRefresh((refreshHasFailed) => {
                if (refreshHasFailed) {
                    reject(error);
                    return;
                }
                resolve(instance(originalRequest));
            });
        });

        if (!isRefreshing) {
            isRefreshing = true;
            tryReauthentication(instance)
                .then(() => {
                    isRefreshing = false;
                    retryRequests();
                })
                .catch(() => {
                    isRefreshing = false;
                    retryRequests(true);
                });
        }

        return retryOrigReq;
    }
    // return Promise.reject(error);
};

export default {
    interceptor,
    tryReauthentication,
};
