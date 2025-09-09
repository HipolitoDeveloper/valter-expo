// recommended-products-section.test.tsx
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import RecommendedProductsSection from './recommended-products-section';
import * as productService from '../../../../services/product';
import * as shoplistService from '../../../../services/shoplist';
import {ITEM_STATE} from '../../../../services/enums';

jest.mock('../../../../services/product');
jest.mock('../../../../services/shoplist');

jest.mock('../product-box', () => {
    const React = require('react');
    const { Text, TouchableOpacity } = require('react-native');
    return ({ product, onPress }: any) => (
        <TouchableOpacity
            testID={`product-${product.id}`}
            onPress={() => onPress(product)}
            accessibilityRole="button"
        >
            <Text>{product.name}</Text>
        </TouchableOpacity>
    );
});

const sampleProducts = [
    {
        id: 'p1',
        name: 'Waffle integral',
        defaultPortion: 1,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
    {
        id: 'p2',
        name: 'Espumante brut',
        defaultPortion: 2,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
    {
        id: 'p3',
        name: 'Coquetel piña colada lata',
        defaultPortion: 3,
        defaultPortionType: 'MILLILITERS',
        validForDays: 0,
    },
];

describe('RecommendedProductsSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('does not render when no recommended products are returned', async () => {
        (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({data: []});

        const {queryByText} = render(<RecommendedProductsSection className="" afterInsert={() => {
        }}/>);

        await waitFor(() => {
            expect(queryByText('Produtos recomendados')).toBeNull();
        });
    });

    it('fetches and displays recommended products on mount', async () => {
        (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({
            data: sampleProducts,
        });

        const {getByText} = render(<RecommendedProductsSection className="" afterInsert={() => {
        }}/>);

        await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

        await waitFor(() => {
            expect(getByText('Waffle integral')).toBeTruthy();
            expect(getByText('Espumante brut')).toBeTruthy();
            expect(getByText('Coquetel piña colada lata')).toBeTruthy();
        });
    });

    it('selects and deselects products, showing and hiding the Add button with count', async () => {
        (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({
            data: sampleProducts,
        });

        const {getByText, getByTestId, queryByText} = render(
            <RecommendedProductsSection className="" afterInsert={() => {
            }}/>
        );

        await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

        fireEvent.press(getByTestId('product-p1'));
        fireEvent.press(getByTestId('product-p2'));

        await waitFor(() =>
            expect(getByText(/Adicionar selecionados: 2/i)).toBeTruthy()
        );

        fireEvent.press(getByTestId('product-p2'));
        await waitFor(() =>
            expect(getByText(/Adicionar selecionados: 1/i)).toBeTruthy()
        );

        fireEvent.press(getByTestId('product-p1'));
        await waitFor(() => {
            expect(queryByText(/Adicionar selecionados:/i)).toBeNull();
        });
    });

    it('adds selected products, calls updateShoplist, afterInsert, and refetches products', async () => {
        const afterInsert = jest.fn();

        (productService.findAllRecommendedProducts as jest.Mock)
            .mockResolvedValueOnce({data: sampleProducts})
            .mockResolvedValueOnce({data: [sampleProducts[2]]});

        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ok: true});

        const {getByText, getByTestId} = render(
            <RecommendedProductsSection className="" afterInsert={afterInsert}/>
        );

        await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

        fireEvent.press(getByTestId('product-p1'));
        fireEvent.press(getByTestId('product-p2'));

        const addBtn = await waitFor(() =>
            getByText(/Adicionar selecionados: 2/i)
        );

        fireEvent.press?.(addBtn) ?? fireEvent.press(addBtn);

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                items: [
                    {
                        productId: 'p1',
                        portionType: 'GRAMS',
                        portion: 1,
                        state: ITEM_STATE.IN_CART,
                        validForDays: 0,
                    },
                    {
                        productId: 'p2',
                        portionType: 'GRAMS',
                        portion: 2,
                        state: ITEM_STATE.IN_CART,
                        validForDays: 0,
                    },
                ],
            });
        });

        expect(afterInsert).toHaveBeenCalled();
        expect(productService.findAllRecommendedProducts).toHaveBeenCalledTimes(2);
    });

    it('handles error when updateShoplist fails and does not call afterInsert', async () => {
        (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({
            data: sampleProducts,
        });
        (shoplistService.updateShoplist as jest.Mock).mockRejectedValue(
            new Error('boom')
        );

        const afterInsert = jest.fn();

        const {getByText, getByTestId} = render(
            <RecommendedProductsSection className="" afterInsert={afterInsert}/>
        );

        await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

        fireEvent.press(getByTestId('product-p1'));
        const addBtn = await waitFor(() => getByText(/Adicionar selecionados: 1/i));

        fireEvent.press?.(addBtn) ?? fireEvent.press(addBtn);

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalled();
        });

        expect(afterInsert).not.toHaveBeenCalled();
    });
});
