import React from "react";
import Screen from "../../../../components/Screen";
import {Text} from "../../../../components/text";

type ShoplistPresentationalProps = {
    doSomething?: () => void;

}

const ShoplistPresentational: React.FC<ShoplistPresentationalProps> = ({
                                                                           doSomething
                                                                       }) => {
    return (
        <Screen>
            <Text onPress={doSomething}>Shoplist</Text>
        </Screen>
    );
}

export default ShoplistPresentational