import React from 'react';
import {render, fireEvent, waitFor, renderHook} from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import PortionTypeSelector, {transformValueIntoLabel} from "./portion-type-selector";

describe('transformValueIntoLabel()', () => {
    it('returns correct label for each supported value', () => {
        expect(transformValueIntoLabel('GRAMS')).toBe('gramas');
        expect(transformValueIntoLabel('LITERS')).toBe('litros');
        expect(transformValueIntoLabel('UNITS')).toBe('unidades');
        expect(transformValueIntoLabel('UNKNOWN')).toBe('');
    });
});

describe('PortionTypeSelector', () => {
    it('renders initial label from defaultValues', () => {
        const { result } = renderHook(() => useForm({ defaultValues: { portionType: 'LITERS' } }));
        const { control } = result.current;

        const { getByTestId } = render(
            <PortionTypeSelector control={control} name="portionType" />
        );

        expect(getByTestId('selected-value').children.join('')).toBe('litros');
    });

    // it.only('updates form value when option pressed', async () => {
    //     const onSubmit = jest.fn();
    //     const Wrapper: React.FC = () => {
    //         const { control, handleSubmit } = useForm({ defaultValues: { portionType: 'GRAMS' } });
    //         return (
    //             <>
    //                 <PortionTypeSelector control={control} name="portionType" />
    //                 <Pressable testID="submit-button" onPress={handleSubmit(onSubmit)}>
    //                     <Text>Submit</Text>
    //                 </Pressable>
    //             </>
    //         );
    //     };
    //
    //     const { getByTestId } = render(<Wrapper />);
    //
    //     fireEvent.press(getByTestId('option-LITERS'));
    //     fireEvent.press(getByTestId('submit-button'));
    //
    //     await waitFor(() => {
    //         expect(onSubmit).toHaveBeenCalledWith({ portionType: 'LITERS' });
    //     });
    // });
});