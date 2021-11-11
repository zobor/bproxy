"use strict";
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/proxy/*.ts', 'src/proxy/**/*.ts', '!src/**/*.d.ts', '!src/**/*.js'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
    coverageProvider: 'v8',
    moduleFileExtensions: ['ts', 'js'],
    testEnvironment: 'jest-environment-jsdom',
    testPathIgnorePatterns: ['\\\\node_modules\\\\', '\\\\dist\\\\'],
    testRegex: '/test/.*\\.(test)\\.(ts)$',
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['\\\\node_modules\\\\'],
    silent: false,
    verbose: true,
};
