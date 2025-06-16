import {createContext} from "react";
import {SessionState, Tokens} from "./type";
type SessionContextProps = {
    sessionState: SessionState;
    isAuthenticated: boolean;
    signIn: (tokens: Tokens) => Promise<void>;
    signOut: () => Promise<void>;
};

export const SessionContext = createContext({} as SessionContextProps);
