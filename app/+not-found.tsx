import { Link, Stack } from 'expo-router';
import {StyleSheet} from 'react-native';

import Screen from "../ui/components/Screen";
import {Text} from "../ui/components/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Screen style={styles.container}>
        <Text bold>This screen doesn't exist.</Text>
        <Link href="" style={styles.link}>
          <Text highlight>Go to home screen!</Text>
        </Link>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
