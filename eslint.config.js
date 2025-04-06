// eslint.config.js
// @ts-check
import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  extends: [
    eslintJs.configs.recommended,
    tseslint.configs.recommended,
    eslintReact.configs["recommended-typescript"],
  ],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
});
