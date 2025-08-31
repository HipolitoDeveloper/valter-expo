import React from "react";
import {Control, Controller} from "react-hook-form";
import {PORTION_TYPE} from "../../../services/product/type";
import {
    Select,
    SelectBackdrop,
    SelectContent, SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectInput, SelectItem,
    SelectPortal,
    SelectTrigger
} from "../select";

type PortionTypeSelectorProps = {
    control: Control<any>;
    name: string;
    onValueChange?: () => void;
    testID?: string
}

const portionTypes = [
    {value: PORTION_TYPE.GRAMS, label: 'gramas'},
    {value: PORTION_TYPE.LITERS, label: 'litros'},
    {value: PORTION_TYPE.UNITS, label: 'unidades'},
    {value: PORTION_TYPE.MILLILITERS, label: 'mililitros'},

]

export const transformValueIntoLabel = (value: string) => {
    return portionTypes.find(type => type.value === value)?.label || '';
}

const PortionTypeSelector: React.FC<PortionTypeSelectorProps> = ({control, name, onValueChange, testID}) => {

    return (
        <Controller
            name={name}
            control={control}
            render={({field: {onChange, value}}) => (
                <Select
                    testID={testID}
                    onValueChange={(value) => {
                        onChange(value);
                        onValueChange && onValueChange();
                    }}
                    selectedValue={transformValueIntoLabel(value)}
                >
                    <SelectTrigger variant="underlined" size="md">
                        <SelectInput/>
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop/>
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator/>
                            </SelectDragIndicatorWrapper>
                            {portionTypes.map(({label, value}) => (
                                <SelectItem
                                    key={value}
                                    label={`${label}`}
                                    value={value}/>
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            )}
        />
    )
}

export default PortionTypeSelector;