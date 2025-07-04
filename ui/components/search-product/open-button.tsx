import React from "react";
import {Button} from "../button";
import {Text} from "../text";

export type OpenButtonProps = {
    onPress?: () => void;
}

const OpenButton: React.FC<OpenButtonProps> = ({
    onPress
                                               }) => {

    return (
        <Button testID={'open-drawer-button'} onPress={onPress}>
            <Text>Abrir</Text>
        </Button>
    )
}

export default OpenButton;