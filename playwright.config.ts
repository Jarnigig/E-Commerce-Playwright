require('dotenv').config();
import { defineConfig, devices } from '@playwright/test';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'always' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    storageState: './playwright/.auth/user.json',
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://shop.qaautomationlabs.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    video: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testDir: '.',
      testMatch: '**/auth.setup.ts',
      testIgnore: [],
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
        trace: 'on',
        video: 'on',
      },
    },

    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: ['**/auth.setup.ts', '**/login.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      dependencies: ['setup'],
      testIgnore: ['**/auth.setup.ts', '**/login.spec.ts'],
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'login',
      testMatch: '**/login.spec.ts',
      testIgnore: '**/auth.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
