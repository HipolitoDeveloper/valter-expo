import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {AddIcon, TrashIcon} from "../../../../components/icon";
import PortionInput from "../../../../components/products-list/portion-input/portion-input";
import PortionTypeSelector from "../../../../components/products-list/portion-type-selector/portion-type-selector";
import Screen from "../../../../components/Screen";
import AddProductsDrawer from "../../../../components/products-list/search-product/add-products-drawer";
import {Text} from "../../../../components/text";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../enum";
import {PantryItemsSchemaType} from "../schema";

type PantryPresentationalProps = {
    doSomething?: () => void;
    control: Control<PantryItemsSchemaType>
    pantryItems: PantryItemsSchemaType['pantryItems']
    onPortionChange: (pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id']) => void;
    onPortionTypeChange: (pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id']) => void;
    hasModification: boolean;
    refreshPantry: () => void;
    updatePantryItemState: (pantryItem: PantryItemsSchemaType['pantryItems'][number], state: ItemState) => void;

}

type PantryItemBoxProps = {
    control: Control<PantryItemsSchemaType>;
    index: number;
    pantryItem: PantryItemsSchemaType['pantryItems'][number];
    updatePantryItemState: (pantryItem: PantryItemsSchemaType['pantryItems'][number], state: ItemState) => void;
    onPortionChange: () => void;
    onPortionTypeChange: () => void;

}

const PantryItemBox = ({
                           control,
                           index,
                           pantryItem,
                           updatePantryItemState,
                           onPortionChange,
                           onPortionTypeChange,
                       }: PantryItemBoxProps) => {

    const removePantryItem = (pantryItem: PantryItemsSchemaType['pantryItems'][number]) => {
        updatePantryItemState(pantryItem, ITEM_STATE.REMOVED);
    }

    const addPantryItemToCart = (pantryItem: PantryItemsSchemaType['pantryItems'][number]) => {
        updatePantryItemState(pantryItem, ITEM_STATE.IN_CART);
    }


    return (
        <HStack className={'h-16 justify-between items-center '}>

            <HStack className={'w-2/6 h-full justify-start items-center'}>
                <Button variant={'invisible'}
                        action={'negative'}
                        size={'sm'}
                        testID={`remove-button-${pantryItem.id}`}
                        onPress={() => removePantryItem(pantryItem)}>
                    <ButtonIcon as={TrashIcon}/>
                </Button>

                <PortionInput
                    name={FormKeys.pantryItemsPortion(index)}
                    testId={`portion-input-${pantryItem.id}`}
                    onPortionChange={onPortionChange}
                    control={control}
                />
                <PortionTypeSelector
                    testID={`portion-type-selector-${pantryItem.id}`}
                    control={control}
                    name={FormKeys.pantryItemsPortionType(index)}
                    onValueChange={onPortionTypeChange}

                />
            </HStack>
            <VStack className={'w-3/6 h-full justify-center items-start'}>
                <Text size={'xl'}>
                    {pantryItem.name}
                </Text>
            </VStack>
            <HStack className={'w-1/6 h-full justify-end items-center'} space={'md'}>

                <Button variant={'invisible'}
                        action={'primary'}
                        testID={`add-to-cart-button-${pantryItem.id}`}
                        onPress={() => addPantryItemToCart(pantryItem)}>
                    <ButtonIcon as={AddIcon}/>
                </Button>
            </HStack>
        </HStack>
    )

}

const PantryPresentational: React.FC<PantryPresentationalProps> = ({
                                                                       doSomething,
                                                                       control,
                                                                       pantryItems,
                                                                       refreshPantry,
                                                                       updatePantryItemState,
                                                                       onPortionChange,
                                                                       onPortionTypeChange,
                                                                   }) => {


    return (
        <>
            <VStack className={'w-full h-full '}>
                <Box className={'flex-[1]'}>
                    <AddProductsDrawer variant={'pantry'} afterInsert={refreshPantry}/>
                </Box>
                <VStack space={'xl'} className={'w-full flex-[10] bg-white p-2 rounded-tl-3xl rounded-tr-3xl'}>
                    <Box className={'px-4 pt-2'}>
                        <Text size={'lg'} className={'font-black'}>
                            Aqui estão os itens da sua despensa
                        </Text>
                    </Box>
                    <VStack space={'md'} className={'flex-[9.5]'}>
                        {pantryItems?.length !== 0 ? (
                        pantryItems.map((pantryItem, index) => (
                            <PantryItemBox key={pantryItem.id}
                                           pantryItem={pantryItem}
                                           index={index}
                                           control={control}
                                           updatePantryItemState={updatePantryItemState}
                                           onPortionTypeChange={() => onPortionTypeChange(pantryItem.id)}
                                           onPortionChange={() => onPortionChange(pantryItem.id)}
                            />
                            ))): (
                            <VStack className={'flex-1 justify-center '}>
                                <Text size={'lg'} className={'font-black text-center'}>
                                    Sua despensa está vazia!
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </VStack>


            </VStack>
        </>
    );
}

export default PantryPresentational