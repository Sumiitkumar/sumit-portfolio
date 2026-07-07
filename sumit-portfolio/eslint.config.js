import { defineConfig } from 'eslint/config'

export default defineConfig({
  root: true,
  ignorePatterns: ['node_modules', '.next', 'dist'],
  extends: ['next/core-web-vitals'],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
  },
})
