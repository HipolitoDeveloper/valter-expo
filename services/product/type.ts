export const PORTION_TYPE = {
    GRAMS: 'GRAMS',
    UNITS: 'UNITS',
    LITERS: 'LITERS',
    MILLILITERS: 'MILLILITERS'
};;


export type FindAllProductParams = {
    limit: number;
    page: number;
}

export type FindAllProductResponse = {
    data: {
        "id": string,
        "name": string,
        "category": {
            "id": string,
            "name": string
        },
        validUntil: string,
        defaultPortion: number,
        defaultPortionType: (typeof PORTION_TYPE)[keyof typeof PORTION_TYPE]
    }[],
    totalCount: number
}

export type Product = FindAllProductResponse['data'][number];