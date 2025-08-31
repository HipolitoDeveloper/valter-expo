import {zodResolver} from "@hookform/resolvers/zod";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {logout} from "../../../../services/auth";
import {ITEM_STATE, ItemState} from "../../../../services/enums";
import {findShoplist, updateShoplist} from "../../../../services/shoplist";
import {ShoplistItem} from "../../../../services/shoplist/type";
import Screen from "../../../components/Screen";
import {Toast, ToastDescription, ToastTitle, useToast} from "../../../components/toast";
import ShoplistPresentational from "./presentational";
import {ShoplistItemsSchema, ShoplistItemsSchemaType} from "./schema";
import throttle from "lodash/throttle";

const Shoplist = () => {
    const {signOut, currentProfile} = useSession();

    const [loading, setLoading] = useState(false)
    const {control, handleSubmit, formState: {isDirty, errors}, reset, getValues} = useForm({
        resolver: zodResolver(ShoplistItemsSchema),
    })

    const {fields: shoplistItems} = useFieldArray({
        control,
        name: "shoplistItems",
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
                case ITEM_STATE.PURCHASED:
                    showNewToast('Aí sim!', 'Item comprado com sucesso', 'success');
                    break
            }

        }
    };


    const buildShoplistItems = (shoplistItems: ShoplistItem[]) => {
        return shoplistItems.map((item: ShoplistItem) => ({
            id: item.id,
            name: item.name,
            portion: item.portion.toString(),
            portionType: item.portionType,
            productId: item.productId,
            state: item.state,
            validUntil: item.validUntil
        }))
    }

    const fetchShoplistItems = useCallback(async () => {
        setLoading(true)
        try {
            const shoplist = await findShoplist({
                id: currentProfile?.shoplist.id!
            });

            reset({
                shoplistItems: buildShoplistItems(shoplist.items)
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

    const saveShoplist = async (updatedShoplist: ShoplistItemsSchemaType, handleLoading: boolean = true) => {
        if (handleLoading) {
            setLoading(true)
        }
        try {

            const itemsToUpdate = updatedShoplist.shoplistItems.map(item => ({
                id: item.id,
                name: item.name,
                portion: Number(item.portion),
                portionType: item.portionType,
                productId: item.productId,
                state: item.state,
                validUntil: item.validUntil
            }))
            const shoplist = await updateShoplist({items: itemsToUpdate});
            reset({
                shoplistItems: buildShoplistItems(shoplist.items)
            })

            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("updateShoplistItems Error", error)
            } else {
                console.log("updateShoplistItems Error", error)
            }

            showNewToast('Erro', 'Não foi possível salvar a lista de compras', 'error');
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const updateShoplistItemState = async (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => {
        const updatedShoplistItem = {
            ...shoplistItem,
            state: state
        }

        const updatedShoplist = {
            shoplistItems: [updatedShoplistItem]
        }
        await saveShoplist(updatedShoplist)
        handleToast(state);
    }

    const updateShoplistItemPortion = useMemo(
        () =>
            throttle((pantryItemId: ShoplistItemsSchemaType['shoplistItems'][number]['id']) => {
                const shoplistItem = getValues().shoplistItems.find(item => item.id === pantryItemId) as ShoplistItemsSchemaType['shoplistItems'][number];
                const updatedShoplistItem = {
                    shoplistItems: [{...shoplistItem, state: ITEM_STATE.UPDATED}],

                }
                saveShoplist(updatedShoplistItem, false);
            }, 2000, {leading: true, trailing: true}),
        []
    );

    const updateShoplisttemPortionType = (pantryItemId: ShoplistItemsSchemaType['shoplistItems'][number]['id']) => {
        const shoplistItem = getValues().shoplistItems.find(item => item.id === pantryItemId) as ShoplistItemsSchemaType['shoplistItems'][number];
        const updatedShoplistItem = {
            shoplistItems: [{...shoplistItem, state: ITEM_STATE.UPDATED}],
        }
        saveShoplist(updatedShoplistItem);
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
        fetchShoplistItems()
    }, [fetchShoplistItems, reset]);

    return (
        <Screen className={'justify-between'} loading={loading}>
            <ShoplistPresentational doSomething={doSomething}
                                    control={control}
                                    shoplistItems={shoplistItems}
                                    onPortionChange={updateShoplistItemPortion}
                                    onPortionTypeChange={updateShoplisttemPortionType}
                                    refreshShoplist={fetchShoplistItems}
                                    updateShoplistItemState={updateShoplistItemState}
            />
        </Screen>
    )
}

export default Shoplist;