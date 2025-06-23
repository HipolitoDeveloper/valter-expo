import {useRouter, useSegments, Tabs, Slot} from 'expo-router';
import { Pressable } from 'react-native';
import { Box } from '../../../../ui/components/box';
import { HStack } from '../../../../ui/components/hstack';
import { Text } from '../../../../ui/components/text';
import { config } from '../../../../ui/providers/gluestack-ui-provider/config';

const tabs = [
    { name: '(app)/(inside)/(tabs)', title: 'Lista de Compras', icon: 'home-outline' },
    { name: '(app)/(inside)/(tabs)/pantry', title: 'Despensa', icon: 'fast-food-outline' },
    { name: '(app)/(inside)/(tabs)/profile', title: 'Perfil', icon: 'person-outline' },
];

export default function TabLayout() {
    const router = useRouter();
    const segments = useSegments();
    const currentTab = segments.toString().replace(/,/g, '/');

    const isActive = (currentTabName: string) => {
        return currentTab === currentTabName;
    }

    return (
        <Box style={{flex: 1}} className={'bg-background-0'}>
            <Box style={{flex: 1}}>
                <Slot />
            </Box>
            <HStack
                className={'bg-background-0 border-t border-background-100'}
                style={{ justifyContent: 'space-around' }}
            >
                {tabs.map(tab => (
                    <Pressable
                        key={tab.name}
                        onPress={() => router.replace(`${tab.name}` as any)}
                        style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}
                    >
                        <Text
                            className={isActive(tab.name) ? 'text-primary-500' :  'text-secondary-300' }
                        >
                            {tab.title}
                        </Text>
                    </Pressable>
                ))}
            </HStack>
        </Box>
    );
}
