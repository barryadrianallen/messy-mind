import { defineVitestConfig } from '@nuxt/test-utils/config';
import dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom', // or 'happy-dom' if you prefer and have it installed
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    // If you have setup files, include them here, e.g.:
    // setupFiles: ['./tests/setup/global.setup.js'],
  },
  // Aliases like '~' should be handled by Nuxt environment automatically
});
