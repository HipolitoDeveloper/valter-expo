import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ITEM_STATE} from "../../../../services/enums";
import {findAllRecommendedProducts} from "../../../../services/product";
import {ShoplistItem} from "../../../../services/shoplist/type";
import {Product} from "../../../../services/product/type";
import ProductList from "../../../components/products-list/search-product/add-products-drawer";
import Shoplist from './index';
import * as shoplistService from '../../../../services/shoplist';
import * as productService from '../../../../services/product';
import {useSession} from '../../../../hooks/use-session';

// Mocks
jest.mock('../../../../hooks/use-session');
jest.mock('../../../../services/shoplist');
jest.mock('../../../../services/product');
jest.mock('../../../../services/auth');

const mockSignOut = jest.fn();

const sampleItems: ShoplistItem[] = [
    {
        id: '1', name: 'Arroz', portion: 2, portionType: 'GRAMS',
        productId: 'p1', state: ITEM_STATE.IN_CART, validForDays: 0,
    },
    {
        id: '2', name: 'Feijão', portion: 3.5, portionType: 'GRAMS',
        productId: 'p2', state:ITEM_STATE.IN_CART, validForDays: 0,
    },
];

const sampleProducts: Product[] = [
    { id: 'p1', name: 'Arroz', category: { id: 'categoryId', name: 'Grãos' }, defaultPortion: 1, defaultPortionType: 'GRAMS', validForDays: 0 },
    { id: 'p2', name: 'Feijão', category: { id: 'categoryId2', name: 'Feijões' }, defaultPortion: 2, defaultPortionType: 'GRAMS', validForDays: 0 },
];

const sampleRecommended: Product[] = [
    {
        id: 'r1',
        name: 'Waffle integral',
        defaultPortion: 1,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
    {
        id: 'r2',
        name: 'Espumante brut',
        defaultPortion: 2,
        defaultPortionType: 'GRAMS',
        validForDays: 0,
    },
    {
        id: 'r3',
        name: 'Coquetel piña colada lata',
        defaultPortion: 3,
        defaultPortionType: 'MILLILITERS',
        validForDays: 0,
    },
];


describe('Shoplist', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useSession as jest.Mock).mockReturnValue({
            currentProfile: { shoplist: { id: 'shoplist1' } },
            signOut: mockSignOut,
        });

        (shoplistService.findShoplist as jest.Mock).mockResolvedValue({ items: sampleItems });
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: sampleItems });
    });

    it('should fetch and render shoplist items', async () => {
        const { getByText } = render(<Shoplist />);

        await waitFor(() => {
            expect(getByText('Arroz')).toBeTruthy();
            expect(getByText('Feijão')).toBeTruthy();
        });
    });

    it('should call updateShoplist immediately on select change', async () => {
        const updated = [
            { ...sampleItems[0], portionType: 'UNITS' },
            sampleItems[1]
        ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: updated });

        const { getByTestId } = render(<Shoplist />);
        await waitFor(() => expect(getByTestId('portion-type-selector-1')).toBeTruthy());

        fireEvent(getByTestId('portion-type-selector-1'), 'onValueChange', 'UNITS');

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                items: [
                    {
                        id: '1',
                        name: 'Arroz',
                        portion: 2,
                        portionType: 'UNITS',
                        productId: 'p1',
                        state: ITEM_STATE.UPDATED,
                        validForDays: 0,
                    },

                ],
            });
        });
    });

    it('should debounce updateShoplist on weight changes', async () => {
        const updatedOnce = [
            { ...sampleItems[0], portion: 5 },
            sampleItems[1]
        ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: updatedOnce });
        (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({ data: sampleProducts });

        const { getByTestId } = render(<Shoplist />);
        await waitFor(() => expect(getByTestId('portion-input-1')).toBeTruthy());

        fireEvent.changeText(getByTestId('portion-input-1'), '1');
        fireEvent.changeText(getByTestId('portion-input-1'), '4');
        fireEvent.changeText(getByTestId('portion-input-1'), '5');

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalledTimes(1);
            expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                items: [
                    {
                        id: '1',
                        name: 'Arroz',
                        portion: 5,
                        portionType: 'GRAMS',
                        productId: 'p1',
                        state: ITEM_STATE.UPDATED,
                        validForDays: 0,
                    },

                ],
            });
        });
    });

    it('should remove an item when trash is pressed and call updateShoplist', async () => {
        const remainingItems = [ sampleItems[1] ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: remainingItems });

        const { getByText, getByTestId, queryByText, getAllByText } = render(<Shoplist />);
        await waitFor(() => expect(getAllByText('Arroz')[1]).toBeTruthy());
        await waitFor(() => expect(getAllByText('Feijão')[1]).toBeTruthy());

        fireEvent.press(getByTestId('remove-button-1'));

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                items: [
                    {
                        id: '1',
                        name: 'Arroz',
                        portion: 2,
                        portionType: 'GRAMS',
                        productId: 'p1',
                        state: ITEM_STATE.REMOVED,
                        validForDays: 0,
                    },

                ],
            });
        });

        await waitFor(() => {
            expect(queryByText('Arroz')).toBeNull();
            expect(getByText('Feijão')).toBeTruthy();
        });
    });

    it('should add an item to the pantry when addItemToPantry button is pressed and call updateShoplist', async () => {
        const remainingItems = [ sampleItems[1] ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: remainingItems });

        const { getByText, getByTestId, queryByText, getAllByText } = render(<Shoplist />);
        await waitFor(() => expect(getAllByText('Arroz')[1]).toBeTruthy());
        await waitFor(() => expect(getAllByText('Feijão')[1]).toBeTruthy());

        fireEvent.press(getByTestId('add-to-pantry-button-1'));

        await waitFor(() => {
            expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                items: [
                    {
                        id: '1',
                        name: 'Arroz',
                        portion: 2,
                        portionType: 'GRAMS',
                        productId: 'p1',
                        state: ITEM_STATE.PURCHASED,
                        validForDays: 0,
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
            (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: [] });
        });

        it('should open drawer and list products when typing in search input', async () => {
            const afterInsert = jest.fn();
            const { getByPlaceholderText, getByText } = render(
                <ProductList variant="shoplist" afterInsert={afterInsert} />
            );

            const searchInput = getByPlaceholderText('Buscar produtos...');
            fireEvent.changeText(searchInput, 'arr');

            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
            expect(getByText('Feijões')).toBeTruthy();
        });

        it('should select product and call updateShoplist on FAB press', async () => {
            const afterInsert = jest.fn();
            const { getByPlaceholderText, getByText, getByTestId } = render(
                <ProductList variant="shoplist" afterInsert={afterInsert} />
            );

            const searchInput = getByPlaceholderText('Buscar produtos...');
            fireEvent.changeText(searchInput, 'arr');

            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());

            fireEvent.press(getByText('Arroz'));
            const fab = getByTestId('add-products-button');
            fireEvent.press(fab);

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
                    ],
                });
                expect(afterInsert).toHaveBeenCalled();
            });
        });
    });

    describe('RecommendedProductsSection integration inside Shoplist', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (useSession as jest.Mock).mockReturnValue({
                currentProfile: { shoplist: { id: 'shoplist1' } },
                signOut: mockSignOut,
            });

            (shoplistService.findShoplist as jest.Mock).mockResolvedValue({
                items: sampleItems,
            });
            (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({
                items: sampleItems,
            });
            (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({
                data: sampleRecommended,
            });
        });

        it('renders the recommended-product products section and items', async () => {
            const { getByText } = render(<Shoplist />);

            await waitFor(() => {
                expect(getByText('Produtos recomendados')).toBeTruthy();
                expect(getByText('Waffle integral')).toBeTruthy();
                expect(getByText('Espumante brut')).toBeTruthy();
                expect(getByText('Coquetel piña colada lata')).toBeTruthy();
            });
        });

        it('toggles selection and shows the add button count', async () => {
            const { getByText, getByTestId, queryByText } = render(<Shoplist />);

            await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

            fireEvent.press(getByTestId('recommended-product-r1'));
            fireEvent.press(getByTestId('recommended-product-r2'));

            await waitFor(() => {
                expect(getByText(/Adicionar selecionados: 2/i)).toBeTruthy();
            });

            fireEvent.press(getByTestId('recommended-product-r2'));

            await waitFor(() => {
                expect(getByText(/Adicionar selecionados: 1/i)).toBeTruthy();
            });

            fireEvent.press(getByTestId('recommended-product-r1'));
            await waitFor(() => {
                expect(queryByText(/Adicionar selecionados:/i)).toBeNull();
            });
        });

        it('adds selected recommended-product products, refetches recommendations, and refreshes shoplist', async () => {
            (productService.findAllRecommendedProducts as jest.Mock)
                .mockResolvedValueOnce({ data: [sampleRecommended[2]] });

            (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: sampleItems });

            const { getByText, getByTestId } = render(<Shoplist />);

            await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

            fireEvent.press(getByTestId('recommended-product-r3'));

            const addBtn = await waitFor(() =>
                getByText(/Adicionar selecionados: 1/i)
            );
            fireEvent.press(addBtn);

            await waitFor(() => {
                expect(shoplistService.updateShoplist).toHaveBeenCalledWith({
                    items: [
                        {
                            productId: 'r3',
                            portionType: 'MILLILITERS',
                            portion: 3,
                            state: ITEM_STATE.IN_CART,
                            validForDays: 0,
                        },

                    ],
                });
            });

            expect(productService.findAllRecommendedProducts).toHaveBeenCalledTimes(3);

            await waitFor(() => {
                expect(shoplistService.findShoplist).toHaveBeenCalledTimes(2);
            });
        });

        it('does not render the section when there are no recommended-product products', async () => {
            (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({ data: [] });

            const { queryByText } = render(<Shoplist />);

            await waitFor(() => {
                expect(queryByText('Produtos recomendados')).toBeNull();
            });
        });

        it('handles updateShoplist error from recommended-product section without refreshing shoplist', async () => {
            (shoplistService.updateShoplist as jest.Mock).mockRejectedValue(new Error('boom'));
            (productService.findAllRecommendedProducts as jest.Mock).mockResolvedValue({
                data: sampleRecommended,
            });

            const { getByText, getByTestId } = render(<Shoplist />);

            await waitFor(() => expect(getByText('Produtos recomendados')).toBeTruthy());

            fireEvent.press(getByTestId('recommended-product-r1'));
            const addBtn = await waitFor(() =>
                getByText(/Adicionar selecionados: 1/i)
            );
            fireEvent.press(addBtn);

            // Tentou chamar updateShoplist
            await waitFor(() => {
                expect(shoplistService.updateShoplist).toHaveBeenCalled();
            });

            // Não deve ter refeito o fetch do shoplist (apenas 1 chamada do mount)
            expect(shoplistService.findShoplist).toHaveBeenCalledTimes(1);
        });
    });
});
