import React, {createContext, ReactNode, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {setOnUnauthorized} from "../../../common/api/auth-event";
import {Action, Resource} from "../../../common/permission/type";

import {SecureStoreKeys} from '../../../common/secure-store/keys';
import {me} from "../../../services/auth";
import {AuthMeResponse} from "../../../services/auth/type";
import {SessionContext} from "./context";
import {SESSION_STATE} from "./enum";
import {SessionState, Tokens} from "./type";

const ACCESS_KEY = SecureStoreKeys.ACCESS_TOKEN
const REFRESH_KEY = SecureStoreKeys.REFRESH_TOKEN

const SessionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [sessionState, setSessionState] = useState<SessionState>(SESSION_STATE.LOADING);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    const [currentProfile, setCurrentProfile] = useState<AuthMeResponse>();

    useEffect(() => {
        setOnUnauthorized(() => {
            signOut()
        });
    }, []);

    useEffect(() => {
        (async () => loadTokens())();
    }, []);

    useEffect(() => {
        switch (sessionState) {
            case SESSION_STATE.AUTHENTICATED:
                setIsAuthenticated(true);
                setIsSessionLoading(false)

                break;
            case SESSION_STATE.UNAUTHENTICATED:
                setIsAuthenticated(false);
                setIsSessionLoading(false)

                break;
            case SESSION_STATE.LOADING:
                setIsAuthenticated(false);
                setIsSessionLoading(true)
                break;
            default:
                setIsAuthenticated(false);
                setIsSessionLoading(true)

        }
    }, [sessionState]);

    const loadTokens = async () => {
        const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);

        if (accessToken && refreshToken) {
            await getMe();
        } else {
            setSessionState(SESSION_STATE.UNAUTHENTICATED);
        }
    };

    const signIn = async ({accessToken, refreshToken}: Tokens) => {
        await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);

        await getMe();
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        setSessionState(SESSION_STATE.UNAUTHENTICATED);

    };

    const getMe = async () => {
        try {
            const userProfile = await me();

            setCurrentProfile(userProfile);
            setSessionState(SESSION_STATE.AUTHENTICATED);

        } catch (error) {
            setSessionState(SESSION_STATE.UNAUTHENTICATED);
            console.log("Me Error: ", error);
        }

    }

    const allowResource = (resource: Resource, action: Action | Action[]) => {
        const hasResource = currentProfile?.resources[resource];
        if (hasResource) {
            const actionsToCheck = Array.isArray(action) ? action : [action];

            const hasAction = actionsToCheck.every((act) => hasResource[act]);

            return hasAction;
        } else {
            return false;
        }
    };


    return (
        <SessionContext.Provider
            value={{
                sessionState,
                isAuthenticated,
                isSessionLoading,
                signIn,
                signOut,
                currentProfile,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export {SessionProvider};
