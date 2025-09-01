import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {logout} from "../../../../services/auth";
import {ITEM_STATE, ItemState} from "../../../../services/enums";
import {findPantry, updatePantry} from "../../../../services/pantry";
import {PantryItem} from "../../../../services/pantry/type";
import Screen from "../../../components/Screen";
import {Toast, ToastDescription, ToastTitle, useToast} from "../../../components/toast";
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

    const toast = useToast();
    const [toastId, setToastId] = React.useState(0);

    const showNewToast = (title: string, description: string, action: 'success' | 'warning' | 'error') => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
            id: `${newId}`,
            placement: 'top',
            duration: 1000,
            render: ({id}) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast nativeID={uniqueToastId} action={action} variant="solid">
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription>
                            {description}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    };

    const handleToast = (state: ItemState) => {
        if (!toast.isActive(`${toastId}`)) {
            switch (state) {
                case ITEM_STATE.REMOVED:
                    showNewToast('Poxa!', 'Item removido com sucesso', 'warning');

                    break
                case ITEM_STATE.IN_CART:
                    showNewToast('Aí sim!', 'O item foi adcionado na sua lista de compras', 'success');
                    break
            }

        }
    };


    const buildPantryItems = (pantryItems: PantryItem[]) => {
        return pantryItems.map((item: PantryItem) => ({
            id: item.id,
            name: item.name,
            portion: item.portion.toString(),
            portionType: item.portionType,
            productId: item.productId,
            state: item.state,
            validForDays: item.validForDays
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

    const savePantry = async (updatedPantry: PantryItemsSchemaType, handleLoading: boolean = true) => {
        if (handleLoading) {
            setLoading(true)
        }
        try {

            const itemsToUpdate = updatedPantry.pantryItems.map(item => ({
                id: item.id,
                name: item.name,
                portion: Number(item.portion),
                portionType: item.portionType,
                productId: item.productId,
                state: item.state,
                validForDays: item.validForDays
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
            showNewToast('Erro', 'Não foi possível salvar a despensa', 'error');

            throw error
        } finally {
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
        handleToast(state);
    }

    const updatePantryItemPortion = useMemo(
        () =>
            throttle((pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id']) => {
                const pantryItem = getValues().pantryItems.find(item => item.id === pantryItemId) as PantryItemsSchemaType['pantryItems'][number];
                const updatedPantry = {
                    pantryItems: [{...pantryItem, state: ITEM_STATE.UPDATED}],

                }
                savePantry(updatedPantry, false);
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
        <Screen className={'justify-between'} loading={loading}>
            <PantryPresentational doSomething={doSomething}
                                  control={control}
                                  pantryItems={pantryItems}
                                  onPortionChange={updatePantryItemPortion}
                                  onPortionTypeChange={updatePantryItemPortionType}
                                  hasModification={isDirty}
                                  refreshPantry={fetchPantryItems}
                                  updatePantryItemState={updatePantryItemState}
            />
        </Screen>
    )
}

export default Pantry;