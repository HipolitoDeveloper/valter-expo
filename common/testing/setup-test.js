import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Opcional: evitar warnings irrelevantes
jest.spyOn(console, 'error').mockImplementation((...args) => {
    const silentPatterns = [
        'Warning: An update to .* inside a test was not wrapped in act',
        'Use `screen` instead of destructuring `getBy...`',
    ];

    const shouldIgnore = silentPatterns.some((pattern) =>
        args[0]?.toString().includes(pattern),
    );

    if (!shouldIgnore) {
        console.warn(...args);
    }
});

export * from '@testing-library/react-native';
