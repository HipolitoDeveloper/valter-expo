import React from "react";
import {Control} from "react-hook-form";
import {Box} from "../../../../components/box";
import {Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText} from "../../../../components/button";
import {Input, InputField} from "../../../../components/form/input";
import {HStack} from "../../../../components/hstack";
import {TrashIcon} from "../../../../components/icon";
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
    updatePantry: () => Promise<void>;
    hasModification: boolean;
    refreshPantry: () => void;
    onRemove: (pantryItem: PantryItemsSchemaType['pantryItems'][number]) => void;
}

type PantryItemBoxProps = {
    control: Control<PantryItemsSchemaType>;
    index: number;
    pantryItem: PantryItemsSchemaType['pantryItems'][number];
    onRemove: (pantryItem: PantryItemsSchemaType['pantryItems'][number]) => void;
}

const PantryItemBox = ({
                           control,
                           index,
                           pantryItem,
                           onRemove
                       }: PantryItemBoxProps) => {


    return (
        <HStack className={'h-24 justify-between items-center '}>

            <HStack className={'w-1/3 h-full justify-center items-center'}>
                <Input variant={'underlined'} className={'w-10'}>
                    <InputField name={FormKeys.pantryItemsPortion(index)}
                                control={control}
                                keyboardType="numeric"

                    />
                </Input>
                <PortionTypeSelector control={control}
                                     name={FormKeys.pantryItemsPortionType(index)}
                />
            </HStack>
            <VStack className={'w-1/3 h-full justify-center items-center'}>
                <Text size={'2xl'}>
                    {pantryItem.name}
                </Text>
            </VStack>
            <VStack className={'w-1/3 h-full justify-center items-center'}>
                <Button variant={'solid'}
                        action={'negative'}
                        testID={`remove-button-${pantryItem.id}`}
                        onPress={() => onRemove(pantryItem)}>
                    <ButtonIcon as={TrashIcon}/>
                </Button>

            </VStack>
        </HStack>
    )

}

const PantryPresentational: React.FC<PantryPresentationalProps> = ({
                                                                       doSomething,
                                                                       control,
                                                                       pantryItems,
                                                                       updatePantry,
                                                                       hasModification,
                                                                       refreshPantry,
                                                                       onRemove
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
                                       onRemove={onRemove}
                        />
                    ))}
                </VStack>


            </VStack>

            {hasModification && (
                <Box className={'w-full'}>
                    <Button onPress={updatePantry}>
                        <Text>Salvar Despensa</Text>
                    </Button>
                </Box>
            )}

        </Screen>
    );
}

export default PantryPresentational