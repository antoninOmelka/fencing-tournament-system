import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  globalIgnores([".next/", "out/", "build/", "coverage/", "next-env.d.ts"]),
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
]);
