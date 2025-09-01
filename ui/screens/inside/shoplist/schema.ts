import {z} from "zod";

export const ShoplistItemsSchema = z.object({
    shoplistItems: z.array(z.object({
        id: z.string(),
        productId: z.string(),
        portion: z.string(),
        portionType: z.string(),
        state: z.string(),
        name: z.string(),
        validForDays: z.number().optional(),
    })),

})

export type ShoplistItemsSchemaType = z.infer<typeof ShoplistItemsSchema>;