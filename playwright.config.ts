import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Reduce retries to speed up CI */
  retries: process.env.CI ? 1 : 0,
  /* Increase workers for faster execution */
  workers: process.env.CI ? 2 : undefined,
  /* Use faster reporter */
  reporter: process.env.CI ? [
    ['line'],
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ] : 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Reduce trace collection to speed up tests */
    trace: 'retain-on-failure',
    /* Faster navigation timeout */
    navigationTimeout: 15000,
    /* Faster action timeout */
    actionTimeout: 10000,
  },

  /* Optimize projects for faster CI execution */
  projects: process.env.CI ? [
    /* Primary browser for CI - fastest and most reliable */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* One mobile test to ensure responsiveness */
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ] : [
    /* Full browser matrix for local development */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000, /* Reduce server startup timeout */
  },
});