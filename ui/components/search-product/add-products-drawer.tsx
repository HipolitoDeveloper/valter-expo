import React, {useCallback, useEffect, useState} from "react";
import HttpError from "../../../common/errors/http-error";
import {me} from "../../../services/auth";
import {ITEM_STATE} from "../../../services/enums";
import {updatePantry} from "../../../services/pantry";
import {PantryItem, UpdatePantryBody} from "../../../services/pantry/type";
import {findAllProducts} from "../../../services/product";
import {PORTION_TYPE, Product} from "../../../services/product/type";
import {updateShoplist} from "../../../services/shoplist";
import {UpdateShoplistBody} from "../../../services/shoplist/type";
import {
    Drawer,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader
} from "../drawer";
import {Fab, FabIcon, FabLabel} from "../fab";
import {HStack} from "../hstack";
import {AddIcon} from "../icon";
import {Pressable} from "../pressable";
import {Text} from "../text";
import {VStack} from "../vstack";
import OpenButton from "./open-button";

type SelectedProduct = { selected: boolean } & Product

type ProductListProps = {
    variant: 'pantry' | 'shoplist';
    afterInsert?: () => void;
}

type ProductBoxProps = {
    product: SelectedProduct;
    onPress: (product: SelectedProduct) => void;
}
const ProductBox: React.FC<ProductBoxProps> = ({
                                                   product,
                                                   onPress
                                               }) => {

    return (
        <Pressable
            onPress={() => onPress(product)}
        >
            {({pressed}) => (
                <HStack
                    className={`w-full h-20 border bg-white border-gray-200 items-center justify-between px-4 ${product.selected && 'bg-primary-200'} ${pressed && 'bg-gray-200'}`}>
                    <VStack className={'flex-1'}>
                        <Text size={'xl'}>{product.name}</Text>
                        <Text>{product.category.name}</Text>
                    </VStack>

                </HStack>
            )}

        </Pressable>
    )

}

const ProductList: React.FC<ProductListProps> = ({variant, afterInsert}) => {
    const [visible, setVisible] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)


    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const products = await findAllProducts({
                limit: 10,
                page: 1
            });

            setProducts(products.data);
            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("findAllProducts Error", error)
            } else {
                console.log("findAllProducts Error", error)
            }
            setLoading(false)
        }
    }, [visible])

    const openDrawer = () => {
        setVisible(true)
    }

    const closeDrawer = () => {
        setProducts([])
        setSelectedProducts([])
        afterInsert?.()
        setVisible(false)
    }

    const addProducts = async () => {
        setLoading(true)
        let updateMethod;
        let itemState;

        switch (variant) {
            case 'pantry':
                updateMethod = (items: UpdatePantryBody | UpdateShoplistBody) => updatePantry({items} as unknown as UpdatePantryBody)
                itemState = ITEM_STATE.IN_PANTRY;
                break;
            case 'shoplist':
                updateMethod = (items: UpdatePantryBody | UpdateShoplistBody) => updateShoplist({items} as unknown as UpdateShoplistBody)
                itemState = ITEM_STATE.IN_CART;

                break;
        }

        const items = selectedProducts.map((product) => ({
            productId: product.id,
            portionType: product.defaultPortionType,
            portion: product.defaultPortion,
            state: itemState,
            validUntil: product.validUntil,
        })) as unknown as UpdatePantryBody | UpdateShoplistBody;

        try {
            setLoading(false)

            await updateMethod(items)
            closeDrawer()
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("findAllProducts Error", error)
            } else {
                console.log("findAllProducts Error", error)
            }
            setLoading(false)
        }
    }

    const selectProduct = (product: Product) => {
        setSelectedProducts((prevSelectedProducts) => {
            const alreadySelected = prevSelectedProducts.some((selectedProduct) => selectedProduct.id === product.id);
            if (alreadySelected) {
                return prevSelectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id);
            } else {
                return [...prevSelectedProducts, product];
            }
        });
    };

    useEffect(() => {
        if(visible) {
            fetchProducts()
        }
    }, [fetchProducts, visible]);


    return <>
        <OpenButton onPress={openDrawer}/>
        <Drawer isOpen={visible}
                anchor={'bottom'}
                size={'lg'}
                onClose={closeDrawer}
        >
            <DrawerBackdrop/>
            <DrawerContent>
                <DrawerHeader>
                    <Text>
                        <DrawerCloseButton  />
                    </Text>
                </DrawerHeader>
                <DrawerBody>
                    <VStack className={'flex-1'} space={'xl'}>
                        {products.map((product) => (
                            <ProductBox
                                key={product.id}
                                onPress={() => selectProduct(product)}
                                product={{
                                    ...product,
                                    selected: selectedProducts.some((p) => p.id === product.id)
                                }}
                            />
                        ))}
                    </VStack>
                </DrawerBody>
                <DrawerFooter className={'flex-col'}>

                    {selectedProducts.length > 0 && (
                        <Fab
                            testID="add-products-button"
                            onPress={addProducts}
                            size="lg"
                            placement="bottom center"
                        >
                            <FabIcon as={AddIcon} height={25} width={25}/>
                        </Fab>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>
}

export default ProductList;