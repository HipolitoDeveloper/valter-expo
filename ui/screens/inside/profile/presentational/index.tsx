import React from "react";
import Screen from "../../../../components/Screen";
import {Text} from "../../../../components/text";

type ProfilePresentationalProps = {
    doSomething?: () => void;

}

const ProfilePresentational: React.FC<ProfilePresentationalProps> = ({
                                                                           doSomething
                                                                       }) => {
    return (
        <Screen>
            <Text onPress={doSomething}>Profile</Text>
        </Screen>
    );
}

export default ProfilePresentational