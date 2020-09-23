// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // 开启覆盖率检查
  collectCoverage: false,

  collectCoverageFrom: ['src/*.{js,ts}', 'src/**/*.{js,ts}', '!src/**/*.d.{js,ts}', '!src/**/*.js'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  testRegex: '/test/.*\\.(test)\\.((t|j)sx?)$',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['\\\\node_modules\\\\'],

  silent: false,
  verbose: true,
};
