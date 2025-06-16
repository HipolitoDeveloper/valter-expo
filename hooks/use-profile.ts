import {useContext} from "react";
import {ProfileContext} from "../ui/providers/profile/context";
import {SessionContext} from "../ui/providers/session/context";

export const useProfile = () => {
    const context = useContext(ProfileContext);

    return context;
};