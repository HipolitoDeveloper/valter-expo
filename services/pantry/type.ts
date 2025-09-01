import {ITEM_STATE} from "../enum";
import {PORTION_TYPE} from "../product/type";


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
        validForDays: number,
        name: string
    }[]
}

export type PantryItem = FindPantryResponse['items'][number];
