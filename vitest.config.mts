import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      include: [
        'lib/chapter-submission.ts',
        'lib/chapter-validation.ts',
        'lib/submission-security.ts',
      ],
    },
  },
})
