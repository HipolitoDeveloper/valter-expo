import {ThemeProvider} from "@react-navigation/core";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {Stack} from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text} from "../../ui/components/text";


export default function AppLayout() {
    const colorScheme = 'dark';
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </SafeAreaView>
    );
}