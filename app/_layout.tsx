import "@/global.css";
import {GluestackUIProvider} from "../ui/providers/gluestack-ui-provider";
import {useFonts} from 'expo-font';
import {Slot, Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {SafeAreaView} from "react-native-safe-area-context";
import {SessionProvider} from "../ui/providers/session/provider";


export default function RootLayout() {
    return (
        <GluestackUIProvider mode="light">
            <SessionProvider>
                <Slot/>
            </SessionProvider>
        </GluestackUIProvider>
    );
}