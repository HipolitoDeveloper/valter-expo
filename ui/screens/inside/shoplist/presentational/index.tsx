import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {AddIcon, TrashIcon} from "../../../../components/icon";
import PortionTypeSelector from "../../../../components/portion-type-selector/portion-type-selector";
import Screen from "../../../../components/Screen";
import AddProductsDrawer from "../../../../components/search-product/add-products-drawer";
import {Text} from "../../../../components/text";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../enum";
import {ShoplistItemsSchemaType} from "../schema";

type ShoplistPresentationalProps = {
    doSomething?: () => void;
    control: Control<ShoplistItemsSchemaType>
    shoplistItems: ShoplistItemsSchemaType['shoplistItems']
    onPortionChange: () => void;
    onPortionTypeChange: () => void;
    refreshShoplist: () => void;
    updateShoplistItemState: (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => void;

}

type ShoplistItemBoxProps = {
    control: Control<ShoplistItemsSchemaType>;
    index: number;
    shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number];
    updateShoplistItemState: (shoplistItem: ShoplistItemsSchemaType['shoplistItems'][number], state: ItemState) => void;
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
        <HStack className={'h-24 justify-between items-center '}>

            <HStack className={'w-1/3 h-full justify-center items-center'}>
                <Input variant={'underlined'}
                       className={'w-10'}>
                    <InputField name={FormKeys.shoplistItemsPortion(index)}
                                testID={`portion-input-${shoplistItem.id}`}
                                control={control}
                                keyboardType="numeric"
                                onValueChange={onPortionChange}

                    />
                </Input>
                <PortionTypeSelector
                    testID={`portion-type-selector-${shoplistItem.id}`}
                    control={control}
                                     name={FormKeys.shoplistItemsPortionType(index)}
                                     onValueChange={onPortionTypeChange}

                />
            </HStack>
            <VStack className={'w-1/3 h-full justify-center items-center'}>
                <Text size={'2xl'}>
                    {shoplistItem.name}
                </Text>
            </VStack>
            <HStack className={'w-1/3 h-full justify-center items-center'} space={'md'}>
                <Button variant={'solid'}
                        action={'negative'}
                        testID={`remove-button-${shoplistItem.id}`}
                        onPress={() => removeShoplistItem(shoplistItem)}>
                    <ButtonIcon as={TrashIcon}/>
                </Button>
                <Button variant={'outline'}
                        action={'secondary'}
                        testID={`add-to-pantry-button-${shoplistItem.id}`}
                        onPress={() => addShoplistItemToCart(shoplistItem)}>
                    <ButtonIcon as={AddIcon}/>
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


    return (
        <Screen className={'justify-between'}>
            <Text onPress={doSomething}>Valter</Text>

            <VStack className={'w-full flex-1 '}>
                <Text size={'xl'} bold>Lista de Compras</Text>
                <AddProductsDrawer variant={'shoplist'} afterInsert={refreshShoplist}/>

                <VStack space={'xl'}>
                    {shoplistItems.map((shoplistItem, index) => (
                        <ShoplistItemBox key={shoplistItem.id}
                                       shoplistItem={shoplistItem}
                                       index={index}
                                       control={control}
                                       updateShoplistItemState={updateShoplistItemState}
                                       onPortionTypeChange={onPortionTypeChange}
                                       onPortionChange={onPortionChange}
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

        </Screen>
    );
}

export default ShoplistPresentational