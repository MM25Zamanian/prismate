import baseConfig from '@prismate/eslint-config/base.js'
import reactConfig from '@prismate/eslint-config/react-internal.js'

export default [
  ...baseConfig,
  ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]