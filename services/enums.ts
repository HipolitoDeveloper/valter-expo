export const ITEM_STATE = {
    IN_CART: 'IN_CART',
    REMOVED: 'REMOVED',
    IN_PANTRY: 'IN_PANTRY',
    PURCHASED: 'PURCHASED'
};
export type ItemState = (typeof ITEM_STATE)[keyof typeof ITEM_STATE]