// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var common = require('../jest.common.config');
const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/unit';

module.exports = {
    ...common,
    coverageDirectory: '<rootDir>/test-results/unit/coverage',
    displayName: 'unit tests',
    setupFiles: [`${currentDir}/jest-setup.ts`],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    rootDir: rootDir,
    roots: [currentDir],
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/tests/**/*',
        '!<rootDir>/src/**/*.d.ts',
    ],
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
    testEnvironment: 'jsdom',
    testMatch: [`${currentDir}/**/*.test.(ts|tsx|js)`],
    reporters: [
        'default',
        [
            'jest-junit',
            { outputDirectory: '.', outputName: '<rootDir>/test-results/unit/junit.xml' },
        ],
    ],
};
