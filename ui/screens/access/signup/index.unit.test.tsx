import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from '.';
import { customRender } from '../../../../common/testing/base-test-setup';
import { register } from '../../../../services/auth';
import { useSession } from '../../../../hooks/use-session';
import HttpError from '../../../../common/errors/http-error';

jest.mock('../../../../services/auth', () => ({
    register: jest.fn(),
}));

jest.mock('../../../../hooks/use-session', () => ({
    useSession: jest.fn(),
}));

describe('SignUp', () => {
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

    it('renders UI components: title, inputs, button', () => {
        const { getByText, getByPlaceholderText } = customRender(<SignUp />);

        expect(getByText('Criar uma nova conta?')).toBeTruthy();
        expect(getByText('Já está cadastrado? Faça login aqui')).toBeTruthy();
        expect(getByText('Cadastrar')).toBeTruthy();

        expect(getByPlaceholderText('Nome')).toBeTruthy();
        expect(getByPlaceholderText('Sobrenome')).toBeTruthy();
        expect(getByPlaceholderText('E-mail')).toBeTruthy();
        expect(getByPlaceholderText('Data de nascimento')).toBeTruthy();
        expect(getByPlaceholderText('Senha')).toBeTruthy();
        expect(getByPlaceholderText('Confirme sua senha')).toBeTruthy();
        expect(getByPlaceholderText('Nome da despensa')).toBeTruthy();
    });

    it('submits form and signs in on success', async () => {
        (register as jest.Mock).mockResolvedValue({
            accessToken: 'token123',
            refreshToken: 'refresh123',
        });

        const { getByPlaceholderText, getByText } = customRender(<SignUp />);

        fireEvent.changeText(getByPlaceholderText('Nome'), 'User manchester');
        fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'manchester apagar');
        fireEvent.changeText(getByPlaceholderText('E-mail'), 'manchester@gmail.com');
        fireEvent.changeText(getByPlaceholderText('Data de nascimento'), '2001-01-21 22:44:29.728 -0300');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Confirme sua senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Nome da despensa'), 'Pantry name');

        fireEvent.press(getByText('Cadastrar'));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                email: 'manchester@gmail.com',
                firstName: 'User manchester',
                surname: 'manchester apagar',
                birthday: '2001-01-21 22:44:29.728 -0300',
                pantryName: 'Pantry name',
                password: 'teste',
            });

            expect(mockSignIn).toHaveBeenCalledWith({
                accessToken: 'token123',
                refreshToken: 'refresh123',
            });
        });
    });

    it('handles HttpError during registration', async () => {
        const error = new HttpError('Erro', 400);
        (register as jest.Mock).mockRejectedValue(error);

        const { getByPlaceholderText, getByText } = customRender(<SignUp />);

        fireEvent.changeText(getByPlaceholderText('Nome'), 'User manchester');
        fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'manchester apagar');
        fireEvent.changeText(getByPlaceholderText('E-mail'), 'manchester@gmail.com');
        fireEvent.changeText(getByPlaceholderText('Data de nascimento'), '2001-01-21 22:44:29.728 -0300');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Confirme sua senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Nome da despensa'), 'Pantry name');
        fireEvent.press(getByText('Cadastrar'));

        await waitFor(() => {
            expect(mockSignIn).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('doSignUp Error', error);
        });
    });

    it('handles unexpected error during registration', async () => {
        const error = new Error('Falha de rede');
        (register as jest.Mock).mockRejectedValue(error);

        const { getByPlaceholderText, getByText } = customRender(<SignUp />);

        fireEvent.changeText(getByPlaceholderText('Nome'), 'User manchester');
        fireEvent.changeText(getByPlaceholderText('Sobrenome'), 'manchester apagar');
        fireEvent.changeText(getByPlaceholderText('E-mail'), 'manchester@gmail.com');
        fireEvent.changeText(getByPlaceholderText('Data de nascimento'), '2001-01-21 22:44:29.728 -0300');
        fireEvent.changeText(getByPlaceholderText('Senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Confirme sua senha'), 'teste');
        fireEvent.changeText(getByPlaceholderText('Nome da despensa'), 'Pantry name');
        fireEvent.press(getByText('Cadastrar'));

        await waitFor(() => {
            expect(mockSignIn).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('doSignUp Error', error);
        });
    });
});
