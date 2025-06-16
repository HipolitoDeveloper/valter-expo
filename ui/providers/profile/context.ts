import {createContext} from "react";
import {Action, Resource} from "../../../common/permission/type";
import {AuthMeResponse} from "../../../services/auth/type";

type ProfileContextValue = {
    profile: AuthMeResponse | undefined;
    allowResource: (resource: Resource, action: Action | Action[]) => boolean;
};



export const ProfileContext = createContext({} as ProfileContextValue);
