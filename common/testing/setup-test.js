import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import React from "react";

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('@legendapp/motion', () => ({
    Motion: () => null,
    AnimatePresence: () => null,
    createMotionAnimatedComponent: (Component) => Component,
}));

jest.mock('nativewind', () => ({ cssInterop: jest.fn() }));

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

jest.mock('../../ui/components/drawer', () => {
    const React = require('react');
    return {
        Drawer: ({isOpen, children}) => (isOpen ? <>{children}</> : null),
        DrawerBackdrop: () => null,
        DrawerContent: ({children}) => <>{children}</>,
        DrawerHeader: ({children}) => <>{children}</>,
        DrawerBody: ({children}) => <>{children}</>,
        DrawerFooter: ({children}) => <>{children}</>,
        DrawerCloseButton: () => null,
    };
});



jest.mock('../../ui/components/select', () => {
    const React = require('react');
    const { Pressable, Text, View} = require('react-native');
    function attachOnValueChange(children, onValueChange) {
        return React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(
                child,
                { ...child.props, onValueChange },
                attachOnValueChange(child.props.children, onValueChange)
            );
        });
    }

    return {
        Select: ({ children, onValueChange, selectedValue, testID }) => (
            <View testID={testID}>
                <Text testID="selected-value">{selectedValue}</Text>
                <View testID="options">       {attachOnValueChange(children, onValueChange)}
                </View>
            </View>
        ),
        SelectTrigger: ({ children }) => <React.Fragment>{children}</React.Fragment>,
        SelectInput: () => null,
        SelectPortal: ({ children }) => <React.Fragment>{children}</React.Fragment>,
        SelectBackdrop: () => null,
        SelectContent: ({ children }) => <React.Fragment>{children}</React.Fragment>,
        SelectDragIndicatorWrapper: ({ children }) => <React.Fragment>{children}</React.Fragment>,
        SelectDragIndicator: () => null,
        SelectItem: ({ label, value, onValueChange }) => (
            <Pressable
                testID={`option-${value}`}
                onPress={() => onValueChange(value)}

            >
                <Text>{label}</Text>
            </Pressable>
        ),
    };
});

export * from '@testing-library/react-native';
