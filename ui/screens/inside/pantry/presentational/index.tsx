import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {AddIcon, TrashIcon} from "../../../../components/icon";
import PortionInput from "../../../../components/portion-input/portion-input";
import PortionTypeSelector from "../../../../components/portion-type-selector/portion-type-selector";
import Screen from "../../../../components/Screen";
import AddProductsDrawer from "../../../../components/search-product/add-products-drawer";
import {Text} from "../../../../components/text";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../enum";
import {PantryItemsSchemaType} from "../schema";

type PantryPresentationalProps = {
    doSomething?: () => void;
    control: Control<PantryItemsSchemaType>
    pantryItems: PantryItemsSchemaType['pantryItems']
    onPortionChange: (pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id'] ) => void;
    onPortionTypeChange: (pantryItemId: PantryItemsSchemaType['pantryItems'][number]['id'] ) => void;
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
        <HStack className={'h-24 justify-between items-center '}>

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
                <Text size={'2xl'}>
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
            <Text onPress={doSomething}>Valter</Text>

            <VStack className={'w-full flex-1 '}>
                <Text size={'xl'} bold>Despensa</Text>
                <AddProductsDrawer variant={'pantry'} afterInsert={refreshPantry}/>

                <VStack space={'xl'}>
                    {pantryItems.map((pantryItem, index) => (
                        <PantryItemBox key={pantryItem.id}
                                       pantryItem={pantryItem}
                                       index={index}
                                       control={control}
                                       updatePantryItemState={updatePantryItemState}
                                       onPortionTypeChange={() => onPortionTypeChange(pantryItem.id)}
                                       onPortionChange={() => onPortionChange(pantryItem.id)}
                        />
                    ))}
                </VStack>


            </VStack>

            {/*{hasModification && (*/}
            {/*    <Box className={'w-full'}>*/}
            {/*        <Button onPress={updatePantry}>*/}
            {/*            <Text>Salvar Despensa</Text>*/}
            {/*        </Button>*/}
            {/*    </Box>*/}
            {/*)}*/}

        </>
    );
}

export default PantryPresentational