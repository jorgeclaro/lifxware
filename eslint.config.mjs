import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import markdown from "@eslint/markdown";
import json from "@eslint/json";

export default [
	{
		ignores: ["node_modules/", "dist/"],
	}, {
		ignores: ["**/*.md", "**/*.json", "**/*.yaml"],

		languageOptions: {
			globals: {
				...globals.jest,
			},

			parser: tsParser,
			ecmaVersion: 6,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					modules: true,
				},
			},
		},

		rules: {
			"callback-return": "off",

			complexity: ["error", {
				max: 10,
			}],

			"eol-last": ["error", "always"],

			"indent-legacy": ["error", "tab", {
				SwitchCase: 1,
			}],

			"no-unused-vars": "off",
			"no-unreachable": "error",

			"no-multiple-empty-lines": ["error", {
				max: 1,
			}],

			"typescript/no-unused-vars": "off",
			"typescript/interface-name-prefix": "off",
			"typescript/no-explicit-any": "off",
			"no-mixed-spaces-and-tabs": "error",
			"newline-before-return": "error",
			"newline-after-var": ["error", "always"],

			"padding-line-between-statements": ["error", {
				blankLine: "always",
				prev: ["const", "let", "var", "block", "block-like"],
				next: ["block", "block-like"],
			}],

			"prefer-const": "error",
			"valid-typeof": "error",
			"object-curly-spacing": ["warn", "always"],
			"spaced-comment": "off",
		},
	},
	{
		files: ["**/*.md"],
		plugins: {
			markdown
		},
		processor: "markdown/markdown"
	},
	{
		files: ["**/*.json"],
		plugins: {
			json
		},
		language: "json/json",
		...json.configs.recommended,
		rules: {
			"json/no-empty-keys": "off",
		},
	},
];
