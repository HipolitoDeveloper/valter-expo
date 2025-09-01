import {ItemState} from "../enum";
import {PORTION_TYPE} from "../product/type";

export type UpdateShoplistBody = {
    items: Omit<ShoplistItem, 'name'>[]
}

export type UpdateShoplistResponse = {
    id: string;
    name: string;
    items: ShoplistItem[]
}

export type FindShoplistParams = {
   id: string;
}

export type FindShoplistResponse = {
    id: string;
    name: string;
    items: {
        id?: string;
        productId: string;
        portion: number;
        portionType: (typeof PORTION_TYPE)[keyof typeof PORTION_TYPE]
        state: ItemState
        name: string
        validForDays?: number
    }[]
}

export type ShoplistItem = FindShoplistResponse['items'][number];
