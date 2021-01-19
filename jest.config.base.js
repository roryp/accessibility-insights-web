// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/**/*.js',
        '<rootDir>/**/*.ts',
        '<rootDir>/**/*.tsx',
        '!<rootDir>/bundle/**',
        '!<rootDir>/dist/**',
        '!<rootDir>/drop/**',
        '!<rootDir>/extension/**',
        '!<rootDir>/out/**',
        '!<rootDir>/**/jest.config.js',
        '!<rootDir>/**/prettier.config.js',
        '!<rootDir>/**/webpack.config.js',
        '!<rootDir>/**/node_modules/**',
        '!<rootDir>/**/test-results/**',
    ],
    coverageDirectory: '<rootDir>/test-results/unit/coverage',
    coverageReporters: ['text', 'lcov', 'cobertura'],
    displayName: '<should be overriden by individual jest.configs>',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        'office-ui-fabric-react/lib/(.*)$': 'office-ui-fabric-react/lib-commonjs/$1',
        '@uifabric/utilities': '@uifabric/utilities/lib-commonjs',
        '@uifabric/styling': '@uifabric/styling/lib-commonjs',
        /* Using proxy to handle css modules, as per: https://jestjs.io/docs/en/webpack#mocking-css-modules */
        '\\.(scss)$': 'identity-obj-proxy',
    },
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: '<rootDir>/test-results/unit',
                outputName: 'junit.xml',
            },
        ],
    ],
    testEnvironment: 'node',
    testMatch: ['**/*.spec.[tj]s', '**/*.test.[tj]s'],
    testPathIgnorePatterns: ['/dist/', '/out/'],
    // This ensures that failures in beforeAll/beforeEach result in dependent tests not trying to run.
    // See https://github.com/facebook/jest/issues/2713
    testRunner: 'jest-circus/runner',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
