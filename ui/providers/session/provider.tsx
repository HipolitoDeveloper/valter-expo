import React, {createContext, ReactNode, useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';

import {SecureStoreKeys} from '../../../common/secure-store/keys';
import {SessionContext} from "./context";
import {SESSION_STATE} from "./enum";
import {SessionState, Tokens} from "./type";

const ACCESS_KEY = SecureStoreKeys.ACCESS_TOKEN
const REFRESH_KEY = SecureStoreKeys.REFRESH_TOKEN

const SessionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [sessionState, setSessionState] = useState<SessionState>(SESSION_STATE.LOADING);

    const loadTokens = async () => {
        const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);

        if (accessToken && refreshToken) {
            setSessionState(SESSION_STATE.AUTHENTICATED);
        }
    };

    const signIn = async ({accessToken, refreshToken}: Tokens) => {
        await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
        setSessionState(SESSION_STATE.AUTHENTICATED);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
        setSessionState(SESSION_STATE.UNAUTHENTICATED);
    };

    useEffect(() => {
        loadTokens();
    }, []);

    return (
        <SessionContext.Provider
            value={{
                sessionState,
                isAuthenticated: sessionState === SESSION_STATE.AUTHENTICATED,
                signIn,
                signOut,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export {SessionProvider};
