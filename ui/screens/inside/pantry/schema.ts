import {z} from "zod";

export const PantryItemsSchema = z.object({
    pantryItems: z.array(z.object({
        id: z.string(),
        productId: z.string(),
        portion: z.string(),
        portionType: z.string(),
        validUntil: z.string(),
        state: z.string(),
        name: z.string()
    })),

})

export type PantryItemsSchemaType = z.infer<typeof PantryItemsSchema>;