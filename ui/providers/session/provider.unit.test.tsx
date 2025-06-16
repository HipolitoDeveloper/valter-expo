import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import * as SecureStore from 'expo-secure-store';
import {SessionContext} from "./context";
import {SESSION_STATE} from "./enum";
import {SessionProvider} from "./provider";

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

const mockTokens = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
};

const renderWithProvider = () => {
    let contextValue: any;
    const TestComponent = () => {
        const ctx = React.useContext(SessionContext);
        contextValue = ctx;
        return null;
    };

    render(
        <SessionProvider>
            <TestComponent />
        </SessionProvider>
    );

    return () => contextValue;
};

describe('SessionProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start with LOADING state and set AUTHENTICATED if tokens exist', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) =>
            key.includes('access') ? mockTokens.accessToken : mockTokens.refreshToken
        );

        const getContext = renderWithProvider();

        await waitFor(() => {
            expect(getContext().sessionState).toBe(SESSION_STATE.AUTHENTICATED);
        });
    });

    it('should stay LOADING if no tokens exist', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

        const getContext = renderWithProvider();

        await waitFor(() => {
            expect(getContext().sessionState).toBe(SESSION_STATE.LOADING);
        });
    });

    it('should set tokens and state on signIn', async () => {
        const getContext = renderWithProvider();

        await waitFor(() => {
            expect(getContext().signIn).toBeDefined();
        });

        await getContext().signIn(mockTokens);

        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(expect.any(String), mockTokens.accessToken);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(expect.any(String), mockTokens.refreshToken);
        await waitFor(() => {
            expect(getContext().sessionState).toBe(SESSION_STATE.AUTHENTICATED);
        });
    });

    it('should delete tokens and set UNAUTHENTICATED on signOut', async () => {
        const getContext = renderWithProvider();

        await waitFor(() => {
            expect(getContext().signOut).toBeDefined();
        });

        await getContext().signOut();

        expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
        await waitFor(() => {
            expect(getContext().sessionState).toBe(SESSION_STATE.UNAUTHENTICATED);
        });
    });
});
