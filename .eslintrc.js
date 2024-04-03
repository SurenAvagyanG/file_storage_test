module.exports = {
  plugins: ['prettier', 'jest', 'import'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/naming-convention': ['off'],
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': 'off',
    'new-cap': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': [2, { props: false }],
    'no-useless-constructor': 'off',
    'import/no-cycle': 'error',
  },
  extends: [
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['/dist'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
