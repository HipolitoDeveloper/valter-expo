import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ITEM_STATE} from "../../../../services/enums";
import {ShoplistItem} from "../../../../services/shoplist/type";
import {Product} from "../../../../services/product/type";
import ProductList from "../../../components/search-product/add-products-drawer";
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
        productId: 'p1', state: ITEM_STATE.IN_CART, validUntil: '2025-08-01',
    },
    {
        id: '2', name: 'Feijão', portion: 3.5, portionType: 'GRAMS',
        productId: 'p2', state:ITEM_STATE.IN_CART, validUntil: '2025-07-20',
    },
];

const sampleProducts: Product[] = [
    { id: 'p1', name: 'Arroz', category: { id: 'categoryId', name: 'Grãos' }, defaultPortion: 1, defaultPortionType: 'GRAMS', validUntil: '2025-08-01' },
    { id: 'p2', name: 'Feijão', category: { id: 'categoryId2', name: 'Feijões' }, defaultPortion: 2, defaultPortionType: 'GRAMS', validUntil: '2025-07-20' },
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
                        validUntil: '2025-08-01',
                    },

                ],
            });
        });
    });

    it('should throttle updateShoplist on weight changes', async () => {
        const updatedOnce = [
            { ...sampleItems[0], portion: 5 },
            sampleItems[1]
        ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: updatedOnce });

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
                        portion: 1,
                        portionType: 'GRAMS',
                        productId: 'p1',
                        state: ITEM_STATE.UPDATED,
                        validUntil: '2025-08-01',
                    },

                ],
            });
        });
    });

    it('should remove an item when trash is pressed and call updateShoplist', async () => {
        const remainingItems = [ sampleItems[1] ];
        (shoplistService.updateShoplist as jest.Mock).mockResolvedValue({ items: remainingItems });

        const { getByText, getByTestId, queryByText } = render(<Shoplist />);
        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
        await waitFor(() => expect(getByText('Feijão')).toBeTruthy());

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
                        validUntil: '2025-08-01',
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

        const { getByText, getByTestId, queryByText } = render(<Shoplist />);
        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
        await waitFor(() => expect(getByText('Feijão')).toBeTruthy());

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
                        validUntil: '2025-08-01',
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

        it('should open drawer and list products', async () => {
            const afterInsert = jest.fn();
            const { getByTestId, getByText } = render(<ProductList variant="shoplist" afterInsert={afterInsert} />);
            fireEvent.press(getByTestId('open-drawer-button'));

            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
            expect(getByText('Feijões')).toBeTruthy();
        });

        it('should select product and call updateShoplist on FAB press', async () => {
            const afterInsert = jest.fn();
            const { getByTestId, getByText } = render(<ProductList variant="shoplist" afterInsert={afterInsert} />);
            fireEvent.press(getByTestId('open-drawer-button'));
            await waitFor(() => expect(getByText('Arroz')).toBeTruthy());

            fireEvent.press(getByText('Arroz'));
            const fab = getByTestId('add-products-button');
            fireEvent.press(fab);

            await waitFor(() => {
                expect(shoplistService.updateShoplist).toHaveBeenCalledWith({ items: [
                        { productId: 'p1', portionType: 'GRAMS', portion: 1, state: ITEM_STATE.IN_CART, validUntil: '2025-08-01' }
                    ]});
                expect(afterInsert).toHaveBeenCalled();
            });

        });


    });
});
