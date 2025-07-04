// jest.config.js

module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/common/testing/setup-test.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(expo|@expo|expo-router|expo-asset|expo-constants|expo-linking|expo-modules-core|expo-secure-store|@unimodules|@react-native|react-native|@react-navigation|@gluestack-ui|react-native-css-interop)/)',
    ],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
