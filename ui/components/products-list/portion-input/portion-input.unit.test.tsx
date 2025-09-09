import React from 'react';
import { render, fireEvent, waitFor, renderHook } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import PortionInput from './portion-input';

describe('PortionInput', () => {
    it('renders initial value from defaultValues and keeps numeric keyboard', () => {
        const { result } = renderHook(() =>
            useForm({ defaultValues: { portion: '10' } })
        );
        const { control } = result.current;

        const { getByTestId } = render(
            <PortionInput
                name="portion"
                testId="portion-input"
                control={control}
                onPortionChange={jest.fn()}
            />
        );

        const input = getByTestId('portion-input');
        expect(input.props.value).toBe('10');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('calls onPortionChange when user types', () => {
        const onPortionChange = jest.fn();

        const { result } = renderHook(() =>
            useForm({ defaultValues: { portion: '1' } })
        );
        const { control } = result.current;

        const { getByTestId } = render(
            <PortionInput
                name="portion"
                testId="portion-input"
                control={control}
                onPortionChange={onPortionChange}
            />
        );

        const input = getByTestId('portion-input');
        fireEvent.changeText(input, '25');

        expect(onPortionChange).toHaveBeenCalled();
    });

    // it('updates form value and submits with the typed value', async () => {
    //     const onSubmit = jest.fn();
    //
    //     const Wrapper: React.FC = () => {
    //         const { control, handleSubmit } = useForm({
    //             defaultValues: { portion: '2' },
    //         });
    //
    //         return (
    //             <>
    //                 <PortionInput
    //                     name="portion"
    //                     testId="portion-input"
    //                     control={control}
    //                     onPortionChange={jest.fn()}
    //                 />
    //                 <Pressable testID="submit-button" onPress={handleSubmit(onSubmit)}>
    //                     <Text>Submit</Text>
    //                 </Pressable>
    //             </>
    //         );
    //     };
    //
    //     const { getByTestId } = render(<Wrapper />);
    //     const input = getByTestId('portion-input');
    //
    //     fireEvent.changeText(input, '7');
    //     fireEvent.press(getByTestId('submit-button'));
    //
    //     await waitFor(() => {
    //         expect(onSubmit).toHaveBeenCalledWith({ portion: '7' }, expect.anything());
    //     });
    // });
});
