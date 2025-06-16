import { ACTIONS, RESOURCES } from './enum';

export type Resources = {
    [K in (typeof RESOURCES)[keyof typeof RESOURCES]]?: {
        [A in (typeof ACTIONS)[keyof typeof ACTIONS]]?: boolean;
    };
};

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
