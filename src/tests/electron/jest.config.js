// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const baseConfig = require('../../../jest.config.base');

const rootDir = '../../../';
const currentDir = '<rootDir>/src/tests/electron';

module.exports = {
    ...baseConfig,
    collectCoverage: false,
    displayName: 'electron tests',
    globalSetup: `${currentDir}/setup/global-setup.ts`,
    globalTeardown: `${currentDir}/setup/global-teardown.ts`,
    globals: {
        rootDir: path.resolve(__dirname, rootDir),
    },
    moduleDirectories: [...baseConfig.moduleDirectories, 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: '.',
                outputName: '<rootDir>/test-results/electron/junit-electron.xml',
            },
        ],
    ],
    rootDir: rootDir,
    roots: [currentDir],
    setupFilesAfterEnv: [`${currentDir}/setup/test-setup.ts`],
};
