import { config as baseConfig } from "@prismate/eslint-config/base";

/**
 * ESLint configuration for the main package
 * Extends the base configuration with package-specific rules
 */
export default [
  ...baseConfig,
  {
    // Package-specific overrides
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Additional rules specific to this package
      "import/no-unresolved": "off", // Disable for monorepo packages
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-readonly": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    // Ignore patterns
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
]; 