import {SESSION_STATE} from "./enum";

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type SessionState = (typeof SESSION_STATE)[keyof typeof SESSION_STATE]