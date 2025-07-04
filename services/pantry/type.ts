import {PORTION_TYPE} from "../product/type";

export const ITEM_STATE = {
    IN_CART: 'IN_CART',
    REMOVED: 'REMOVED',
    IN_PANTRY: 'IN_PANTRY',
    PURCHASED: 'PURCHASED'
};


export type UpdatePantryBody = {
    items: Omit<PantryItem, 'name'>[]
}

export type UpdatePantryResponse = {
    id: string;
    name: string;
    items: PantryItem[]
}

export type FindPantryParams = {
   id: string;
}

export type FindPantryResponse = {
    id: string;
    name: string;
    items: {
        id?: string;
        productId: string;
        portion: number;
        portionType: (typeof PORTION_TYPE)[keyof typeof PORTION_TYPE]
        state: (typeof ITEM_STATE)[keyof typeof ITEM_STATE]
        validUntil: string,
        name: string
    }[]
}

export type PantryItem = FindPantryResponse['items'][number];
