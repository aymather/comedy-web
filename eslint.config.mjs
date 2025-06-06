import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	globalIgnores([
		'.now/*',
		'**/*.css',
		'**/.changeset',
		'**/dist',
		'esm/*',
		'public/*',
		'tests/*',
		'scripts/*',
		'**/*.config.js',
		'**/.DS_Store',
		'**/node_modules',
		'**/coverage',
		'**/.next',
		'**/build',
		'!**/.commitlintrc.cjs',
		'!**/.lintstagedrc.cjs',
		'!**/jest.config.js',
		'!**/plopfile.js',
		'!**/react-shim.js',
		'!**/tsup.config.ts'
	]),
	{
		extends: fixupConfigRules(
			compat.extends(
				'plugin:react/recommended',
				'plugin:prettier/recommended',
				'plugin:react-hooks/recommended',
				'plugin:jsx-a11y/recommended'
			)
		),

		plugins: {
			react: fixupPluginRules(react),
			'unused-imports': unusedImports,
			import: fixupPluginRules(_import),
			'@typescript-eslint': typescriptEslint,
			'jsx-a11y': fixupPluginRules(jsxA11Y),
			prettier: fixupPluginRules(prettier)
		},

		languageOptions: {
			globals: {
				...Object.fromEntries(
					Object.entries(globals.browser).map(([key]) => [key, 'off'])
				),
				...globals.node
			},

			parser: tsParser,
			ecmaVersion: 12,
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		},

		settings: {
			react: {
				version: 'detect'
			}
		},

		files: ['**/*.ts', '**/*.tsx'],

		rules: {
			'no-console': ['warn', { allow: ['error'] }],
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'jsx-a11y/click-events-have-key-events': 'warn',
			'jsx-a11y/interactive-supports-focus': 'warn',
			'prettier/prettier': [
				'warn',
				{
					singleQuote: true,
					trailingComma: 'none',
					useTabs: true,
					tabWidth: 4,
					printWidth: 80
				}
			],
			'no-unused-vars': 'off',
			'unused-imports/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'react/self-closing-comp': 'warn'
		}
	}
]);
