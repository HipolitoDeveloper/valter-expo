import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import HttpError from "../../../../common/errors/http-error";
import {useSession} from "../../../../hooks/use-session";
import {logout} from "../../../../services/auth";
import {ItemState} from "../../../../services/enums";
import {findShoplist, updateShoplist} from "../../../../services/shoplist";
import {ShoplistItem} from "../../../../services/shoplist/type";
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

    const saveShoplist = async (updatedShoplist: ShoplistItemsSchemaType) => {
        setLoading(true)
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
            setLoading(false)
        }
    }

    const updateShoplistItemState = async (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => {
        const updatedShoplistItem = {
            ...shoplistItem,
            state: state
        }

        const updatedShoplist = {
            shoplistItems: shoplistItems.map(item => item.id === shoplistItem.id ? updatedShoplistItem : item)
        }
        await saveShoplist(updatedShoplist)
    }

    const onSubmit = handleSubmit(saveShoplist);

    const throttledSubmit = useMemo(
        () =>
            throttle(() => {
                const current = getValues();
                saveShoplist(current);
            }, 2000, { leading: true, trailing: true }),
        []
    );

    const immediateSubmit = useCallback(() => {
        onSubmit();
    }, [onSubmit]);


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
        <ShoplistPresentational doSomething={doSomething}
                              control={control}
                              shoplistItems={shoplistItems}
                              onPortionChange={throttledSubmit}
                              onPortionTypeChange={immediateSubmit}
                              refreshShoplist={fetchShoplistItems}
                              updateShoplistItemState={updateShoplistItemState}
        />
    )
}

export default Shoplist;