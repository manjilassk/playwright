/** @type {import('@playwright/test').PlaywrightTestConfig} */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
require('dotenv').config();
import path from 'path';

// Load .env file
dotenv.config()
export default defineConfig({
  testDir: './tests',

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail build if test.only exists in CI */
  forbidOnly: !!process.env.CI,

  /* Retry strategy */
  retries: process.env.CI ? 2 : 1,

  /* Parallel workers */
  workers: process.env.CI ? 1 : 3,

  /* Reporter (IMPORTANT FOR PORTFOLIO) */
  reporter: [
    ['html'],
    ['list']
  ],

  /* Global test settings */
  use: {
    baseURL: process.env.BASE_URL,

    /* Captures trace for debugging */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',

    /* IMPORTANT: uses logged-in session */
    
  },

  /* Browser projects */
  projects: [
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
  ],

  /* Optional local server (ignore for now) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});