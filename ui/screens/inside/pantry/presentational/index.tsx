import React from "react";
import Screen from "../../../../components/Screen";
import {Text} from "../../../../components/text";

type PantryPresentationalProps = {
    doSomething?: () => void;

}

const PantryPresentational: React.FC<PantryPresentationalProps> = ({
                                                                           doSomething
                                                                       }) => {
    return (
        <Screen>
            <Text onPress={doSomething}>Pantry</Text>
        </Screen>
    );
}

export default PantryPresentational