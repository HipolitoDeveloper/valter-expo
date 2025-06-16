// utils/test-utils.tsx
import {render, RenderOptions} from '@testing-library/react-native';
import React from 'react';

// Suponha que esses sejam seus providers
import {NavigationContainer} from '@react-navigation/native';
import {ProfileProvider} from "../../ui/providers/profile/provider";
import {SessionProvider} from "../../ui/providers/session/provider";
import {withProviders} from '../utils/with-providers';


const providers = [
    (props: any) => <SessionProvider>{props.children}</SessionProvider>,
    (props: any) => <ProfileProvider>{props.children}</ProfileProvider>,
];

const AllProviders = withProviders(providers);

export function customRender(
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    return render(ui, {wrapper: AllProviders, ...options});
}

export * from '@testing-library/react-native';
