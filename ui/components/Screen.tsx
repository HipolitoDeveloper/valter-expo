import React from "react";
import {View, type ViewProps} from "react-native";
import {Box} from "./box";
import {HStack, IHStackProps} from "./hstack";
import {Spinner} from "./spinner";
import {IVStackProps, VStack} from "./vstack";

type ScreenProps = ViewProps & IHStackProps & IVStackProps & {
    children: React.ReactNode,
    lightColor?: string;
    darkColor?: string;
    direction?: 'row' | 'column';
    loading: boolean;
}

const Screen: React.FC<ScreenProps> = ({children, style, lightColor, darkColor, direction, loading, ...otherProps}) => {
    // const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');
    const backgroundColor = '#ffffff'; // Default to white if no colors provided
    let containerElement;

    switch (direction) {
        case 'row':
            containerElement = <HStack style={[{backgroundColor}, {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%'
            }, style]} {...otherProps} >{children}</HStack>;
            break;
        case 'column':
            containerElement = <VStack style={[{backgroundColor}, {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%'
            }, style]} {...otherProps} >{children}</VStack>;
            break;
        default:
            containerElement = <Box style={[{backgroundColor}, {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%'
            }, style]} {...otherProps} >{children}</Box>;
            break;
    }

    return (
        <Box style={[{backgroundColor}, {flex: 1, alignItems: 'center', justifyContent: 'flex-start'}]}>
            {loading ? <Box className={'flex-1 items-center justify-center'}><Spinner size="large" color="green"/>
            </Box> : containerElement}
        </Box>)

}

export default Screen