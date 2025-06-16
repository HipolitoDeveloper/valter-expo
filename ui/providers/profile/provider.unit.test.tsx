import React from 'react';
import { waitFor } from '@testing-library/react-native';
import {Text} from "../../components/text";
import { ProfileProvider } from './provider';
import { ProfileContext } from './context';
import { me } from '../../../services/auth';
import { useSession } from '../../../hooks/use-session';
import { render } from '../../../common/testing/base-test-setup'; // seu customRender

jest.mock('../../../services/auth', () => ({
    me: jest.fn(),
}));

jest.mock('../../../hooks/use-session', () => ({
    useSession: jest.fn(),
}));

describe('ProfileProvider', () => {
    const mockProfile = {
        firstName: 'Test User',
        resources: {
            user: {
                findAll: true,
            },
        },
    };

    const TestComponent = () => {
        const { profile, allowResource } = React.useContext(ProfileContext);

        return (
            <>
                <Text>{profile?.firstName}</Text>
                <Text>{allowResource('user', 'findAll') ? 'Allowed' : 'Denied'}</Text>
                <Text>{allowResource('user', 'findOne') ? 'Allowed' : 'Denied'}</Text>
            </>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useSession as jest.Mock).mockReturnValue({ isAuthenticated: true });
        (me as jest.Mock).mockResolvedValue(mockProfile);
    });

    it('should fetch profile when authenticated and expose context values', async () => {
        const { getByText } = render(
            <ProfileProvider>
                <TestComponent />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(me).toHaveBeenCalled();
            expect(getByText('Test User')).toBeTruthy();
            expect(getByText('Allowed')).toBeTruthy();
            expect(getByText('Denied')).toBeTruthy();
        });
    });

    it('should not fetch profile if not authenticated', async () => {
        (useSession as jest.Mock).mockReturnValue({ isAuthenticated: false });

        render(
            <ProfileProvider>
                <TestComponent />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(me).not.toHaveBeenCalled();
        });
    });


    it('should log error on profile fetch failure', async () => {
        const error = new Error('Fetch failed');
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        (me as jest.Mock).mockRejectedValue(error);

        render(
            <ProfileProvider>
                <TestComponent />
            </ProfileProvider>
        );

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('UserProfile Error: ', error);
        });

        consoleSpy.mockRestore();
    });
});