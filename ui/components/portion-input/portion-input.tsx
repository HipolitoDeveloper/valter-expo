import React from "react";
import {Control} from "react-hook-form";
import {FormKeys} from "../../screens/inside/shoplist/enum";
import {Input, InputField} from "../form/input";

type PortionInputProps = {
    name: string;
    testId: string;
    onPortionChange: () => void;
    control: Control<any>
}

const PortionInput: React.FC<PortionInputProps> = ({
    name, onPortionChange, testId, control
                                                   }) => {
    return (
        <Input variant={'underlined'}
               className={'w-10'}>
            <InputField name={name}
                        testID={testId}
                        control={control}
                        keyboardType="numeric"
                        onValueChange={onPortionChange}

            />
        </Input>
    );
}

export default PortionInput