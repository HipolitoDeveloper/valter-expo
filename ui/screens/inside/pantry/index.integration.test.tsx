import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ITEM_STATE, PantryItem} from "../../../../services/pantry/type";
import {Product} from "../../../../services/product/type";
import ProductList from "../../../components/search-product/add-products-drawer";
import Pantry from './index';
import * as pantryService from '../../../../services/pantry';
import * as productService from '../../../../services/product';
import {useSession} from '../../../../hooks/use-session';

// Mocks
jest.mock('../../../../hooks/use-session');
jest.mock('../../../../services/pantry');
jest.mock('../../../../services/product');
jest.mock('../../../../services/auth');



const mockSignOut = jest.fn();

const sampleItems: PantryItem[] = [
    {
        id: '1', name: 'Arroz', portion: 2, portionType: 'GRAMS',
        productId: 'p1', state: 'fresh', validUntil: '2025-08-01',
    },
    {
        id: '2', name: 'Feijão', portion: 3.5, portionType: 'GRAMS',
        productId: 'p2', state: 'fresh', validUntil: '2025-07-20',
    },
];

const sampleProducts: Product[] = [
    { id: 'p1', name: 'Arroz', category: { id: 'categoryId', name: 'Grãos' }, defaultPortion: 1, defaultPortionType: 'GRAMS', validUntil: '2025-08-01' },
    { id: 'p2', name: 'Feijão', category: { id: 'categoryId2', name: 'Feijões' }, defaultPortion: 2, defaultPortionType: 'GRAMS', validUntil: '2025-07-20' },
];


describe('Pantry', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useSession as jest.Mock).mockReturnValue({
            currentProfile: { pantry: { id: 'pantry1' } },
            signOut: mockSignOut,
        });

        (pantryService.findPantry as jest.Mock).mockResolvedValue({ items: sampleItems });
        (pantryService.updatePantry as jest.Mock).mockResolvedValue({ items: sampleItems });
    });

    it('should fetch and render pantry items', async () => {
        const { getByText } = render(<Pantry />);

        await waitFor(() => {
            expect(getByText('Arroz')).toBeTruthy();
            expect(getByText('Feijão')).toBeTruthy();
        });
    });

    it('should enable Save button when item portion is modified and call updatePantry on save', async () => {
        const { getByText, getAllByDisplayValue, queryByText } = render(<Pantry />);

        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());

        expect(queryByText('Salvar Despensa')).toBeNull();

        const inputs = getAllByDisplayValue('2');
        expect(inputs.length).toBeGreaterThan(0);
        fireEvent.changeText(inputs[0], '5');

        await waitFor(() => expect(getByText('Salvar Despensa')).toBeTruthy());

        fireEvent.press(getByText('Salvar Despensa'));

        await waitFor(() => {
            expect(pantryService.updatePantry).toHaveBeenCalledWith({
                items: [
                    { id: '1', name: 'Arroz', portion: 5, portionType: 'GRAMS', productId: 'p1', state: 'fresh', validUntil: '2025-08-01' },
                    { id: '2', name: 'Feijão', portion: 3.5, portionType: 'GRAMS', productId: 'p2', state: 'fresh', validUntil: '2025-07-20' },
                ],
            });
        });

        await waitFor(() => expect(queryByText('Salvar Despensa')).toBeNull());
    });
    //
    // it('should refresh pantry when Refresh button is pressed', async () => {
    //     const { getByText } = render(<Pantry />);
    //
    //     await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
    //
    //     const newItems: PantryItem[] = [
    //         ...sampleItems,
    //         { id: '3', name: 'Macarrão', portion: 1, portionType: 'UNITS', productId: 'p3', state: 'fresh', validUntil: '2025-09-10' },
    //     ];
    //     (pantryService.findPantry as jest.Mock).mockResolvedValue({ items: newItems });
    //
    //
    //     fireEvent.press(getByText('Valter'));
    //
    //     // Wait for the new item
    //     await waitFor(() => expect(getByText('Macarrão')).toBeTruthy());
    // });

    it('should remove an item when trash is pressed and call updatePantry', async () => {
        const remainingItems = [ sampleItems[1] ];
        (pantryService.updatePantry as jest.Mock).mockResolvedValue({ items: remainingItems });

        const { getByText, getByTestId, queryByText } = render(<Pantry />);
        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
        await waitFor(() => expect(getByText('Feijão')).toBeTruthy());

        fireEvent.press(getByTestId('remove-button-1'));

        await waitFor(() => {
            expect(pantryService.updatePantry).toHaveBeenCalledWith({
                items: [
                    {
                        id: '1',
                        name: 'Arroz',
                        portion: 2,
                        portionType: 'GRAMS',
                        productId: 'p1',
                        state: ITEM_STATE.REMOVED,
                        validUntil: '2025-08-01',
                    },
                    {
                        id: '2',
                        name: 'Feijão',
                        portion: 3.5,
                        portionType: 'GRAMS',
                        productId: 'p2',
                        state: 'fresh',
                        validUntil: '2025-07-20',
                    },
                ],
            });
        });

        await waitFor(() => {
            expect(queryByText('Arroz')).toBeNull();
            expect(getByText('Feijão')).toBeTruthy();
        });
    });

    describe('ProductList integration', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (productService.findAllProducts as jest.Mock).mockResolvedValue({ data: sampleProducts });
            (pantryService.updatePantry as jest.Mock).mockResolvedValue({ items: [] });
        });

        it('should open drawer and list products', async () => {
            const afterInsert = jest.fn();
            const { getByTestId, getByText } = render(<ProductList variant="pantry" afterInsert={afterInsert} />);
            fireEvent.press(getByTestId('open-drawer-button'));

            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
            expect(getByText('Feijões')).toBeTruthy();
        });

        it('should select product and call updatePantry on FAB press', async () => {
            const afterInsert = jest.fn();
            const { getByTestId, getByText } = render(<ProductList variant="pantry" afterInsert={afterInsert} />);
            fireEvent.press(getByTestId('open-drawer-button'));
            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());

            fireEvent.press(getByText('Arroz'));
            const fab = getByTestId('add-products-button');
            fireEvent.press(fab);

            await waitFor(() => {
                expect(pantryService.updatePantry).toHaveBeenCalledWith({ items: [
                        { productId: 'p1', portionType: 'GRAMS', portion: 1, state: ITEM_STATE.IN_PANTRY, validUntil: '2025-08-01' }
                    ]});
                expect(afterInsert).toHaveBeenCalled();
            });

        });


    });
});
