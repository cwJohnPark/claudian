import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
	...obsidianmd.configs.recommended,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: tsparser,
			parserOptions: { project: "./tsconfig.json" },
			globals: {
				navigator: "readonly",
				setTimeout: "readonly",
				requestAnimationFrame: "readonly",
				ResizeObserver: "readonly",
				HTMLElement: "readonly",
				HTMLSpanElement: "readonly",
				Buffer: "readonly",
				process: "readonly",
			},
		},
		rules: {
			"obsidianmd/sample-names": "off",
			"obsidianmd/ui/sentence-case-locale-module": [
				"error",
				{ enforceCamelCaseLower: true, brands: ["Claude"] },
			],
		},
	},
]);
