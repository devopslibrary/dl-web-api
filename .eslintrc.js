// @ts-check

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    // /!\ Order seems to matter

    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',

    // Already done by Airbnb
  ],
  plugins: ['@typescript-eslint'],

  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    // Jest Puppeteer, see https://github.com/smooth-code/jest-puppeteer/blob/v4.0.0/README.md#configure-eslint
    page: true,
  },

  rules: {
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-prototype-builtins': 'off',
    'no-plusplus': 'off',
    'spaced-comment': 'off',

    // See [no-return-assign should be configurable to ignore arrow-functions](https://github.com/eslint/eslint/issues/9471)
    'no-return-assign': 'off',

    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',

    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
  },

  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
    },
    {
      files: ['*.d.ts'],
      rules: {
        // FIXME Fix "TypeError: Cannot read property 'body' of null"
        // https://github.com/typescript-eslint/typescript-eslint/issues/420
        // https://github.com/eslint/eslint/issues/11464
        // https://github.com/eslint/eslint/issues/11440
        'no-useless-constructor': 'off',
      },
    },
  ],
};
