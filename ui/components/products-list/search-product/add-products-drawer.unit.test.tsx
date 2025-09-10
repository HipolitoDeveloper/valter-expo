import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ITEM_STATE } from '../../../../services/enums';
import * as productService from '../../../../services/product';
import * as pantryService from '../../../../services/pantry';
import type { Product } from '../../../../services/product/type';
import ProductList from './add-products-drawer';

jest.mock('../../../../services/product');
jest.mock('../../../../services/pantry');

const sampleProducts: Product[] = [
    {
        id: 'p1',
        name: 'Arroz',
        category: { id: 'categoryId', name: 'Grãos' },
        defaultPortion: 1,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
    {
        id: 'p2',
        name: 'Feijão',
        category: { id: 'categoryId2', name: 'Feijões' },
        defaultPortion: 2,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
];

describe('ProductList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (productService.findAllProducts as jest.Mock).mockResolvedValue({ data: sampleProducts });
        (pantryService.updatePantry as jest.Mock).mockResolvedValue({ items: [] });
    });

    it('renders no products before opening drawer', () => {
        const { queryByText } = render(<ProductList variant="pantry" afterInsert={() => {}} />);
        // Drawer não aberto ainda → não deve listar produtos
        expect(queryByText('Arroz')).toBeNull();
        expect(queryByText('Feijão')).toBeNull();
    });

    it('opens drawer and loads products when typing 3+ chars in the search input', async () => {
        const { getByPlaceholderText, getByText } = render(
            <ProductList variant="pantry" afterInsert={() => {}} />
        );

        const triggerInput = getByPlaceholderText('Buscar produtos...');
        fireEvent.changeText(triggerInput, 'arr');

        await waitFor(() => {
            expect(getByText('Arroz')).toBeTruthy();
            expect(getByText('Grãos')).toBeTruthy();
            expect(getByText('Feijão')).toBeTruthy();
            expect(getByText('Feijões')).toBeTruthy();
        });
    });

    it('selects a product and shows Add button', async () => {
        const { getByPlaceholderText, getByText, queryByTestId, getByTestId } = render(
            <ProductList variant="pantry" afterInsert={() => {}} />
        );

        const triggerInput = getByPlaceholderText('Buscar produtos...');
        fireEvent.changeText(triggerInput, 'arr');

        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());

        expect(queryByTestId('add-products-button')).toBeNull();

        fireEvent.press(getByText('Arroz'));
        const addButton = await waitFor(() => getByTestId('add-products-button'));
        expect(addButton).toBeTruthy();
    });

    it('adds selected products and calls updatePantry and afterInsert', async () => {
        const afterInsert = jest.fn();
        const { getByPlaceholderText, getByText, getByTestId, queryByTestId } = render(
            <ProductList variant="pantry" afterInsert={afterInsert} />
        );

        const triggerInput = getByPlaceholderText('Buscar produtos...');
        fireEvent.changeText(triggerInput, 'fei'); // também abre o drawer

        await waitFor(() => expect(getByText('Feijão')).toBeTruthy());

        fireEvent.press(getByText('Arroz'));
        fireEvent.press(getByText('Feijão'));

        const addButton = await waitFor(() => getByTestId('add-products-button'));
        fireEvent.press(addButton);

        await waitFor(() => {
            expect(pantryService.updatePantry).toHaveBeenCalledWith({
                items: [
                    {
                        productId: 'p1',
                        portionType: 'GRAMS',
                        portion: 1,
                        state: ITEM_STATE.IN_PANTRY,
                        validForDays: 0,
                    },
                    {
                        productId: 'p2',
                        portionType: 'GRAMS',
                        portion: 2,
                        state: ITEM_STATE.IN_PANTRY,
                        validForDays: 0,
                    },
                ],
            });
            expect(afterInsert).toHaveBeenCalled();
        });

        // Após fechar o drawer, o botão some e o trigger permanece
        expect(queryByTestId('add-products-button')).toBeNull();
        // Se quiser garantir que o trigger (input externo) está lá:
        expect(getByPlaceholderText('Buscar produtos...')).toBeTruthy();
    });
});
