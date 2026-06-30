import React from "react";
import {Control} from "react-hook-form";
import {FlatList} from "react-native";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {AddIcon, CheckCircleIcon, TrashIcon} from "../../../../components/icon";
import PortionInput from "../../../../components/products-list/portion-input/portion-input";
import PortionTypeSelector from "../../../../components/products-list/portion-type-selector/portion-type-selector";
import RecommendedProductsSection
    from "../../../../components/products-list/recommended-products-section/recommended-products-section";
import Screen from "../../../../components/Screen";
import AddProductsDrawer from "../../../../components/products-list/search-product/add-products-drawer";
import {Text} from "../../../../components/text";
import {Toast, ToastDescription, ToastTitle, useToast} from "../../../../components/toast";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../enum";
import {ShoplistItemsSchemaType} from "../schema";

type ShoplistPresentationalProps = {
    doSomething?: () => void;
    control: Control<ShoplistItemsSchemaType>
    shoplistItems: ShoplistItemsSchemaType['shoplistItems']
    onPortionChange: (shoplistItemId: ShoplistItemsSchemaType['shoplistItems'][number]['id']) => void;
    onPortionTypeChange: (shoplistItemId: ShoplistItemsSchemaType['shoplistItems'][number]['id']) => void;
    refreshShoplist: () => void;
    updateShoplistItemState: (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => Promise<void>;

}

type ShoplistItemBoxProps = {
    control: Control<ShoplistItemsSchemaType>;
    index: number;
    shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number];
    updateShoplistItemState: (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => Promise<void>;
    onPortionChange: () => void;
    onPortionTypeChange: () => void;

}

const ShoplistItemBox = ({
                             control,
                             index,
                             shoplistItem,
                             updateShoplistItemState,
                             onPortionChange,
                             onPortionTypeChange,
                         }: ShoplistItemBoxProps) => {

    const removeShoplistItem = (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number]) => {
        updateShoplistItemState(shoplistItem, ITEM_STATE.REMOVED);
    }

    const addShoplistItemToCart = (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number]) => {
        updateShoplistItemState(shoplistItem, ITEM_STATE.PURCHASED);
    }


    return (
        <HStack className={'h-16 justify-between items-center'}>
            <HStack className={'w-2/6 h-full justify-start items-center'}>
                <Button variant={'invisible'}
                        action={'negative'}
                        size={'sm'}
                        testID={`remove-button-${shoplistItem.id}`}
                        onPress={() => removeShoplistItem(shoplistItem)}>
                    <ButtonIcon as={TrashIcon}/>
                </Button>
                <PortionInput
                    name={FormKeys.shoplistItemsPortion(index)}
                    testId={`portion-input-${shoplistItem.id}`}
                    onPortionChange={onPortionChange}
                    control={control}
                />
                <PortionTypeSelector
                    testID={`portion-type-selector-${shoplistItem.id}`}
                    control={control}
                    name={FormKeys.shoplistItemsPortionType(index)}
                    onValueChange={onPortionTypeChange}

                />
            </HStack>
            <VStack className={'w-3/6 h-full justify-center items-start'}>
                <Text size={'xl'}>
                    {shoplistItem.name}
                </Text>
            </VStack>
            <HStack className={'w-1/6 h-full justify-end items-center'}>
                <Button variant={'invisible'}
                        action={'primary'}
                        size={'xl'}
                        testID={`add-to-pantry-button-${shoplistItem.id}`}
                        onPress={() => addShoplistItemToCart(shoplistItem)}>
                    <ButtonIcon as={CheckCircleIcon}/>
                </Button>
            </HStack>
        </HStack>
    )

}

const ShoplistPresentational: React.FC<ShoplistPresentationalProps> = ({
                                                                           doSomething,
                                                                           control,
                                                                           shoplistItems,
                                                                           refreshShoplist,
                                                                           updateShoplistItemState,
                                                                           onPortionChange,
                                                                           onPortionTypeChange,
                                                                       }) => {

    const updateItemState = async (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => {
        await updateShoplistItemState(shoplistItem, state);
    }

    return (
        <>

            <VStack className={'w-full h-full '}>
                <Box className={'flex-[1]'}>
                    <AddProductsDrawer variant={'shoplist'} afterInsert={refreshShoplist}/>
                </Box>
                <VStack className={'w-full flex-[10] bg-white p-2 rounded-tl-3xl rounded-tr-3xl'}>
                    <RecommendedProductsSection className={'flex-[0.5]'} afterInsert={refreshShoplist}/>

                    <VStack space={'md'} className={'flex-[9.5]'}>
                        <FlatList
                            data={shoplistItems}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item, index}) => (
                                <ShoplistItemBox key={item.id}
                                                 shoplistItem={item}
                                                 index={index}
                                                 control={control}
                                                 updateShoplistItemState={updateItemState}
                                                 onPortionTypeChange={() => onPortionTypeChange(item.id)}
                                                 onPortionChange={() => onPortionChange(item.id)}
                                />
                            )}
                            ListEmptyComponent={() => (<VStack className={'flex-1 justify-center '}>
                                <Text size={'lg'} className={'font-black text-center'}>
                                    Sua despensa está vazia!
                                </Text>
                            </VStack>)
                            }/>

                    </VStack>
                </VStack>

            </VStack>

        </>
    );
}

export default ShoplistPresentational