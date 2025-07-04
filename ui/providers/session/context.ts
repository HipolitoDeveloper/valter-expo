import {createContext} from "react";
import {AuthMeResponse} from "../../../services/auth/type";
import {SessionState, Tokens} from "./type";
type SessionContextProps = {
    sessionState: SessionState;
    isSessionLoading: boolean;
    isAuthenticated: boolean;
    signIn: (tokens: Tokens) => Promise<void>;
    signOut: () => Promise<void>;
    currentProfile?: AuthMeResponse
};

export const SessionContext = createContext({} as SessionContextProps);
