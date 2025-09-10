import React from "react";
import {FormKeys} from "../../../screens/access/signin/enum";
import {Button} from "../../button";
import {Input, InputField} from "../../form/input";
import {Text} from "../../text";

export type OpenButtonProps = {
    onSearch?: (value: string) => void;
}

const OpenTrigger: React.FC<OpenButtonProps> = ({
                                                   onSearch
                                               }) => {

    return (
        <Input testID={'open-drawer-input'} variant={'rounded'} className={'bg-white ms-safe-or-5  me-safe-or-5 mt-5'}>
            <InputField
                placeholder={'Buscar produtos...'}
                onChangeText={onSearch}
            />
        </Input>
    )
}

export default OpenTrigger;