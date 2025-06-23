import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useSession} from "../hooks/use-session";

SplashScreen.preventAutoHideAsync();

export default function IndexRedirect() {
    const router = useRouter();
    const {isSessionLoading, isAuthenticated} = useSession();


    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded && !isSessionLoading) {
            SplashScreen.hideAsync();
            if (isAuthenticated) {

                router.replace("/(app)/(inside)");
            } else {

                router.replace("/(app)/(access)");
            }
        }
    }, [fontsLoaded, isSessionLoading, router, isAuthenticated]);

    if(!fontsLoaded || isSessionLoading) {
        return null;
    }

    return null;
}