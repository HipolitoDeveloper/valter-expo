import {useContext} from "react";
import {SessionContext} from "../ui/providers/session/context";

export const useSession = () => {
    const context = useContext(SessionContext);

    return context;
};