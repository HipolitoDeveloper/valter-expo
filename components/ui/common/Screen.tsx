import React from "react";
import {View, type ViewProps} from "react-native";
import {Box} from "./box";
import {useThemeColor} from "../../../hooks/useThemeColor";

type ScreenProps = ViewProps & {
    children: React.ReactNode,
    lightColor?: string;
    darkColor?: string;
}

const Screen: React.FC<ScreenProps> = ({children, style, lightColor, darkColor, ...otherProps}) => {
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

    return <Box style={[{backgroundColor}, {flex: 1}, style]} {...otherProps} >{children}</Box>;


}

export default Screen