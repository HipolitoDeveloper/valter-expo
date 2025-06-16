import React from 'react';

type ProviderProps = {
    children: React.ReactNode;
};

type ProviderComponent = React.ComponentType<ProviderProps>;

export function withProviders(
    providers: ProviderComponent[]
): React.FC<{ children: React.ReactNode }> {
    return function CombinedProviders({ children }) {
        return providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
    };
}
