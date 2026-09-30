import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'aip2wt',
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0
    },
    defaultCommandTimeout: 6000,
    requestTimeout: 6000,
    responseTimeout: 6000
  }
});
