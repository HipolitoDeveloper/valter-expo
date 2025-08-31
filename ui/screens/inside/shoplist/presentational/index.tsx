import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {AddIcon, CheckCircleIcon, TrashIcon} from "../../../../components/icon";
import PortionInput from "../../../../components/portion-input/portion-input";
import PortionTypeSelector from "../../../../components/portion-type-selector/portion-type-selector";
import Screen from "../../../../components/Screen";
import AddProductsDrawer from "../../../../components/search-product/add-products-drawer";
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
        <HStack className={'h-24 justify-between items-center'}>
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
                <Text size={'2xl'}>
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
            <Text onPress={doSomething}>Valter</Text>

            <VStack className={'w-full flex-1'}>
                <Text size={'xl'} bold>Lista de Compras</Text>
                <AddProductsDrawer variant={'shoplist'} afterInsert={refreshShoplist}/>

                <VStack space={'xl'}>
                    {shoplistItems.map((shoplistItem, index) => (
                        <ShoplistItemBox key={shoplistItem.id}
                                         shoplistItem={shoplistItem}
                                         index={index}
                                         control={control}
                                         updateShoplistItemState={updateItemState}
                                         onPortionTypeChange={() => onPortionTypeChange(shoplistItem.id)}
                                         onPortionChange={() => onPortionChange(shoplistItem.id)}
                        />
                    ))}
                </VStack>


            </VStack>
            {/*{hasModification && (*/}
            {/*    <Box className={'w-full'}>*/}
            {/*        <Button onPress={updateShoplist}>*/}
            {/*            <Text>Salvar Despensa</Text>*/}
            {/*        </Button>*/}
            {/*    </Box>*/}
            {/*)}*/}
        </>
    );
}

export default ShoplistPresentational