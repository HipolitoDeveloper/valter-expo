import {Profiler} from 'inspector';
import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {Action, Resource} from "../../../common/permission/type";
import {useSession} from "../../../hooks/use-session";
import {me} from "../../../services/auth";
import {AuthMeResponse} from "../../../services/auth/type";
import {ProfileContext} from "./context";

const ProfileProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [currentProfile, setCurrentProfile] = useState<AuthMeResponse>();

    const {isAuthenticated} = useSession()

    useEffect(() => {

        if(isAuthenticated) {
            (async () => getMe())();
        }
    }, [isAuthenticated]);

    const getMe = async () => {
        try {
            const userProfile = await me();

            setCurrentProfile(userProfile);
        } catch (error) {
            console.log("Me Error: ", error);
        }

    }

    const allowResource = (resource: Resource, action: Action | Action[]) => {
        const hasResource = currentProfile?.resources[resource];
        if (hasResource) {
            const actionsToCheck = Array.isArray(action) ? action : [action];

            const hasAction = actionsToCheck.every((act) => hasResource[act]);

            return hasAction;
        } else {
            return false;
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profile: currentProfile,
                allowResource,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export {ProfileProvider};
