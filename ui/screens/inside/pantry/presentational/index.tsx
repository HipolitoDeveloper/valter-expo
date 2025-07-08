import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/pantry/type";
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
import {PantryItemsSchemaType} from "../schema";

type PantryPresentationalProps = {
    doSomething?: () => void;
    control: Control<PantryItemsSchemaType>
    pantryItems: PantryItemsSchemaType['pantryItems']
    onPortionChange: () => void;
    onPortionTypeChange: () => void;
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

            <HStack className={'w-1/3 h-full justify-center items-center'}>
                <Input variant={'underlined'}
                       className={'w-10'}>
                    <InputField name={FormKeys.pantryItemsPortion(index)}
                                testID={`portion-input-${pantryItem.id}`}
                                control={control}
                                keyboardType="numeric"
                                onValueChange={onPortionChange}

                    />
                </Input>
                <PortionTypeSelector
                    testID={`portion-type-selector-${pantryItem.id}`}
                    control={control}
                                     name={FormKeys.pantryItemsPortionType(index)}
                                     onValueChange={onPortionTypeChange}

                />
            </HStack>
            <VStack className={'w-1/3 h-full justify-center items-center'}>
                <Text size={'2xl'}>
                    {pantryItem.name}
                </Text>
            </VStack>
            <HStack className={'w-1/3 h-full justify-center items-center'} space={'md'}>
                <Button variant={'solid'}
                        action={'negative'}
                        testID={`remove-button-${pantryItem.id}`}
                        onPress={() => removePantryItem(pantryItem)}>
                    <ButtonIcon as={TrashIcon}/>
                </Button>
                <Button variant={'outline'}
                        action={'secondary'}
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
                                                                       hasModification,
                                                                       refreshPantry,
                                                                       updatePantryItemState,
                                                                       onPortionChange,
                                                                       onPortionTypeChange,
                                                                   }) => {


    return (
        <Screen className={'justify-between'}>
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
                                       onPortionTypeChange={onPortionTypeChange}
                                       onPortionChange={onPortionChange}
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

        </Screen>
    );
}

export default PantryPresentational