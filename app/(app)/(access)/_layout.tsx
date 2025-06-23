import {Stack, useRouter} from "expo-router";
import '@expo/metro-runtime';
import {useEffect} from "react";
import {useSession} from "../../../hooks/use-session";


export default function AccessLayout() {
    const { isSessionLoading, isAuthenticated } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (!isSessionLoading && isAuthenticated) {
            router.replace("/(app)/(inside)");
        }
    }, [isSessionLoading, isAuthenticated, router]);

    if (isSessionLoading) return null;

    return (
        <Stack screenOptions={{ headerShown: false }} />

    )

}