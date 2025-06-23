import {Stack, useRouter} from "expo-router";
import {useEffect} from "react";
import {useSession} from "../../../hooks/use-session";

export default function InsideLayout() {
    const { isSessionLoading, isAuthenticated } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isSessionLoading && !isAuthenticated) {
            router.replace("/(app)/(access)");
        }
    }, [isSessionLoading, isAuthenticated, router]);

    if (isSessionLoading) return null;

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )

}