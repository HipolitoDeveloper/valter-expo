import React, {useCallback, useEffect, useState} from "react";
import HttpError from "../../../../common/errors/http-error";
import {ITEM_STATE} from "../../../../services/enums";
import {updatePantry} from "../../../../services/pantry";
import {UpdatePantryBody} from "../../../../services/pantry/type";
import {findAllProducts, findAllRecommendedProducts} from "../../../../services/product";
import {Product} from "../../../../services/product/type";
import {updateShoplist} from "../../../../services/shoplist";
import {UpdateShoplistBody} from "../../../../services/shoplist/type";
import {Box} from "../../box";
import {Button} from "../../button";
import {Fab, FabIcon} from "../../fab";
import {HStack} from "../../hstack";
import {AddIcon} from "../../icon";
import {Text} from "../../text";
import {VStack} from "../../vstack";
import ProductBox from "../product-box";
import {SelectedProduct} from "../type";

type RecommendedProductsSectionProps = {
    className: string;
    afterInsert?: () => void;
}

const products = [
    {
        "id": "003b29f9-8f80-43bb-a503-3cbc16dbb4ed",
        "name": "Waffle integral",
        selected: false
    },
    {
        "id": "0063843a-7671-4062-b3b7-11af15b1022e",
        "name": "Espumante brut",
        selected: false
    },
    {
        "id": "006db4c6-2bb8-4278-9f17-57f38adea01b",
        "name": "Coquetel piña colada lata",
        selected: false
    },


]

const RecommendedProductsSection: React.FC<RecommendedProductsSectionProps> = ({
                                                                                   afterInsert
                                                                               }) => {

    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
    const [products, setProducts] = useState<Product[]>([])

    const [loading, setLoading] = useState(false)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const products = await findAllRecommendedProducts();

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
    }, [])

    useEffect(() => {
        fetchProducts()
        console.log("TESTE")
    }, []);


    const onSelectProduct = (product: SelectedProduct) => {
        setSelectedProducts((prevSelectedProducts) => {
            const alreadySelected = prevSelectedProducts.some((selectedProduct) => selectedProduct.id === product.id);
            if (alreadySelected) {
                return prevSelectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id);
            } else {
                return [...prevSelectedProducts, product];
            }
        });
    }

    const addProducts = async () => {
        setLoading(true)

        const items = selectedProducts.map((product) => ({
            productId: product.id,
            portionType: product.defaultPortionType,
            portion: product.defaultPortion,
            state: ITEM_STATE.IN_CART,
            validForDays: product.validForDays,
        })) as unknown as UpdatePantryBody | UpdateShoplistBody;

        try {
            await updateShoplist({items} as unknown as UpdateShoplistBody)
            afterInsert?.()
            await fetchProducts()

        } catch (error) {
            if (error instanceof HttpError) {
                console.log("updateShoplist Error", error)
            } else {
                console.log("updateShoplist Error", error)
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        products && products.length > 0 &&
        <VStack className="w-full shrink min-w-0 overflow-hidden">
            <Box className={'w-full h-10'}>
                <HStack className={'w-full h-full justify-between items-center px-4'}>
                    <Text size={'lg'}>Produtos recomendados</Text>
                    {selectedProducts.length > 0 &&
                        <Button onPress={addProducts}
                                size={'sm'}
                                className={'w-1/2'}
                                variant={'solid'}
                        >
                            <Text className={'color-white font-bold'} size={'sm'}>Adicionar
                                selecionados: {selectedProducts.length}</Text>
                        </Button>}
                </HStack>
            </Box>
            <Box className="flex-row flex-wrap w-full max-h-[2*40px] overflow-hidden">
                {products.map((product) => (
                    <Box className="w-1/3 p-6" key={product.id}>
                        <ProductBox
                            testID={`recommended-product-${product.id}`}
                            className={'rounded-lg'}
                            height={'h-10'}
                            key={product.id}
                            onPress={onSelectProduct}
                            product={{
                                ...product,
                                selected: selectedProducts.some((p) => p.id === product.id)
                            }}
                            productNameTextSize={'xs'}

                        />
                    </Box>
                ))}
            </Box>

        </VStack>
    )
}

export default RecommendedProductsSection