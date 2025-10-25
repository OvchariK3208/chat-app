import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import { globalIgnores } from 'eslint/config'

export default [
  // Игнорируем сборочные директории
  globalIgnores(['dist', 'node_modules', 'build']),

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: parserTs,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json', // или './tsconfig.json'
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      '@typescript-eslint': pluginTs,
      react: pluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      prettier,
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        // 👇 добавляем node + typescript для корректного разрешения алиасов
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json' //['./tsconfig.json', './tsconfig.eslint.json'],
        },
      },
    },

    rules: {
      /* 🧠 Базовые рекомендации */
      ...js.configs.recommended.rules,

      /* 🔹 React */
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      /* 🔹 React Hooks */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* 🔹 TypeScript */
      ...pluginTs.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      /* 🔹 Import */
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'never',
          alphabetize: { order: 'ignore' },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',

      /* 🧩 Прочее */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'prettier/prettier': ['error', { singleQuote: true }, { usePrettierrc: true }],
    },
  },
]