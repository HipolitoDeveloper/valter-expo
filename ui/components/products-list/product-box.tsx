import React from "react";
import {HStack} from "../hstack";
import {Pressable} from "../pressable";
import {Text} from "../text";
import {VStack} from "../vstack";
import {SelectedProduct} from "./type";

type ProductBoxProps = {
    key: string | number;
    product: SelectedProduct;
    onPress: (product: SelectedProduct) => void;
    productNameTextSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "2xs" | "5xl" | "6xl" | undefined;
    className?: string;
    height?: string;
}
const ProductBox: React.FC<ProductBoxProps> = ({
                                                   product,
                                                   onPress,
                                                   productNameTextSize = 'xl',
                                                   className,
                                                   height = 'h-20'
                                               }) => {

    return (
        <Pressable
            onPress={() => onPress(product)}
        >
            {({pressed}) => (
                <HStack
                    className={`${className} w-full ${height} border bg-white border-gray-200 items-center justify-between px-4 ${product.selected && 'bg-primary-200'} ${pressed && 'bg-gray-200'}`}>
                    <VStack className={'flex-1'}>
                        <Text size={productNameTextSize}>{product.name}</Text>
                        {product?.category && <Text>{product?.category?.name}</Text>}
                    </VStack>

                </HStack>
            )}

        </Pressable>
    )

}

export default ProductBox