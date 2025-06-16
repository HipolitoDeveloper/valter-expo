import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import "@/global.css";
import {GluestackUIProvider} from "../ui/providers/gluestack-ui-provider";
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {SafeAreaView} from "react-native-safe-area-context";
import {ProfileProvider} from "../ui/providers/profile/provider";
import {SessionProvider} from "../ui/providers/session/provider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    // const colorScheme = useColorScheme();
    const colorScheme = 'dark'
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GluestackUIProvider mode="light">
            <SessionProvider>
                <ProfileProvider>
                    <SafeAreaView style={{flex: 1}}>
                        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                            <Stack>
                                <Stack.Screen name="(access)" options={{headerShown: false}}/>
                                <Stack.Screen name="+not-found"/>
                            </Stack>
                            <StatusBar style="auto"/>
                        </ThemeProvider>
                    </SafeAreaView>
                </ProfileProvider>
            </SessionProvider>
        </GluestackUIProvider>
    );
}
