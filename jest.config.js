// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // 开启覆盖率检查
  collectCoverage: true,

  collectCoverageFrom: ['src/proxy/*.ts', 'src/proxy/**/*.ts', '!src/**/*.d.ts', '!src/**/*.js'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '\\\\dist\\\\'],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '/test/.*\\.(test)\\.(ts)$',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['\\\\node_modules\\\\'],

  silent: false,
  verbose: true,
};
