import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {logout} from "../../../../services/auth";
import {ITEM_STATE, ItemState} from "../../../../services/enums";
import {findPantry, updatePantry} from "../../../../services/pantry";
import {PantryItem} from "../../../../services/pantry/type";
import PantryPresentational from "./presentational";
import {PantryItemsSchema, PantryItemsSchemaType} from "./schema";
import throttle from "lodash/throttle";

const Pantry = () => {
    const {signOut, currentProfile} = useSession();

    const [loading, setLoading] = useState(false)
    const {control, handleSubmit, formState: {isDirty, errors}, reset, getValues} = useForm({
        resolver: zodResolver(PantryItemsSchema),
    })

    const {fields: pantryItems} = useFieldArray({
        control,
        name: "pantryItems",
        keyName: "key",
    });


    const buildPantryItems = (pantryItems: PantryItem[]) => {
        return pantryItems.map((item: PantryItem) => ({
            id: item.id,
            name: item.name,
            portion: item.portion.toString(),
            portionType: item.portionType,
            productId: item.productId,
            state: item.state,
            validUntil: item.validUntil
        }))
    }

    const fetchPantryItems = useCallback(async () => {
        setLoading(true)
        try {
            const pantry = await findPantry({
                id: currentProfile?.pantry.id!
            });

            reset({
                pantryItems: buildPantryItems(pantry.items)
            })

            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("findAllProducts Error", error)
            } else {
                console.log("findAllProducts Error", error)
            }
            setLoading(false)
        }
    }, [reset, currentProfile]);

    const savePantry = async (updatedPantry: PantryItemsSchemaType) => {
        setLoading(true)
        try {

            const itemsToUpdate = updatedPantry.pantryItems.map(item => ({
                id: item.id,
                name: item.name,
                portion: Number(item.portion),
                portionType: item.portionType,
                productId: item.productId,
                state: item.state,
                validUntil: item.validUntil
            }))
            const pantry = await updatePantry({items: itemsToUpdate});
            reset({
                pantryItems: buildPantryItems(pantry.items)
            })

            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("updatePantryItems Error", error)
            } else {
                console.log("updatePantryItems Error", error)
            }
            setLoading(false)
        }
    }

    const updatePantryItemState = async (pantryItem: PantryItemsSchemaType['pantryItems'][number], state: ItemState) => {
        const updatedPantry = {
            pantryItems: [{
                ...pantryItem,
                state: state
            }]
        }
        await savePantry(updatedPantry)
    }

    const updatePantryItemPortion = useMemo(
        () =>
            throttle((pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id']) => {
                const pantryItem = getValues().pantryItems.find(item => item.id === pantryItemId) as PantryItemsSchemaType['pantryItems'][number];
                const updatedPantry = {
                    pantryItems: [{...pantryItem, state: ITEM_STATE.UPDATED}],

                }
                savePantry(updatedPantry);
            }, 2000, {leading: true, trailing: true}),
        []
    );

    const updatePantryItemPortionType = (pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id']) => {
        const pantryItem = getValues().pantryItems.find(item => item.id === pantryItemId) as PantryItemsSchemaType['pantryItems'][number];
        const updatedPantry = {
            pantryItems: [{...pantryItem, state: ITEM_STATE.UPDATED}],
        }
        savePantry(updatedPantry);
    };


    const doSomething = async () => {
        try {
            await logout()
            await signOut()


        } catch (error) {
            if (error instanceof HttpError) {
                console.log("doLogout Error", error)
            } else {
                console.log("doLogout Error", error)
            }
        }
    }

    useEffect(() => {
        fetchPantryItems()
    }, [fetchPantryItems, reset]);

    return (
        <PantryPresentational doSomething={doSomething}
                              control={control}
                              pantryItems={pantryItems}
                              onPortionChange={updatePantryItemPortion}
                              onPortionTypeChange={updatePantryItemPortionType}
                              hasModification={isDirty}
                              refreshPantry={fetchPantryItems}
                              updatePantryItemState={updatePantryItemState}
        />
    )
}

export default Pantry;