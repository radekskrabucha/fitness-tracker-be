import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-empty-object-type': ['off', { allowObjectTypes: true }]
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier
]
