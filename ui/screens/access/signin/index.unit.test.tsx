import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '.';
import { customRender } from '../../../../common/testing/base-test-setup';
import { login } from '../../../../services/auth';
import { useSession } from '../../../../hooks/use-session';
import HttpError from '../../../../common/errors/http-error';

jest.mock('../../../../services/auth', () => ({
    login: jest.fn(),
}));

jest.mock('../../../../hooks/use-session', () => ({
    useSession: jest.fn(),
}));

describe('SignIn', () => {
    const mockSignIn = jest.fn();
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({
            signIn: mockSignIn,
        });
        jest.clearAllMocks();
    });

    afterAll(() => {
        mockConsoleLog.mockRestore();
    });

    it('renders UI components: logo, email/password inputs, button', () => {
        const { getByText, getByPlaceholderText, getByTestId } = customRender(<SignIn />);

        expect(getByText('Valter')).toBeTruthy();

        expect(getByPlaceholderText('E-mail')).toBeTruthy();
        expect(getByPlaceholderText('Senha')).toBeTruthy();

        expect(getByText('Entrar')).toBeTruthy();
    });

    it('should call login and signIn on form submit', async () => {
        (login as jest.Mock).mockResolvedValue({
            accessToken: 'fake-access-token',
            refreshToken: 'fake-refresh-token',
        });

        const { getByPlaceholderText, getByText } = customRender(<SignIn />);

        fireEvent.changeText(getByPlaceholderText('E-mail'), 'admin@valter.com');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'teste');
        fireEvent.press(getByText('Entrar'));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'admin@valter.com',
                password: 'teste',
            });
            expect(mockSignIn).toHaveBeenCalledWith({
                accessToken: 'fake-access-token',
                refreshToken: 'fake-refresh-token',
            });
        });
    });

    it('should handle HttpError on login failure', async () => {
        const error = new HttpError('Unauthorized', 401);
        (login as jest.Mock).mockRejectedValue(error);

        const { getByText } = customRender(<SignIn />);
        fireEvent.press(getByText('Entrar'));

        await waitFor(() => {
            expect(mockSignIn).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('doSignIn Error', error);
        });
    });

    it('should handle unexpected error on login failure', async () => {
        const error = new Error('Network error');
        (login as jest.Mock).mockRejectedValue(error);

        const { getByText } = customRender(<SignIn />);
        fireEvent.press(getByText('Entrar'));

        await waitFor(() => {
            expect(mockSignIn).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('doSignIn Error', error);
        });
    });
});
