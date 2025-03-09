import reactPlugin from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  globalIgnores(["dist"]),
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
