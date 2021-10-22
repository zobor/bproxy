module.exports = {
  parser:  '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  env:{
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaFeatures: {
      "experimentalDecorators": true,
    }
  },
  rules: {
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    't@typescript-eslint/no-unused-vars': 0,
  },
}
