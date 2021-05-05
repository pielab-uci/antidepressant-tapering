module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'import/no-cycle': 'off',
        'import/extensions': 'off',
        'arrow-body-style': 'off',
      },
    },
  ],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['webpack.config.js'],
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {

  },
};
