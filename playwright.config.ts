/**
 * Playwright Configuration
 * Enterprise-grade setup for SmarterRisk automation framework
 *
 * Supports:
 * - Multi-environment (staging / production)
 * - Cross-browser (Chromium, Firefox, WebKit)
 * - Mobile viewport testing
 * - Parallel execution
 * - HTML + Allure reporting
 * - Trace viewer, screenshots, videos on failure
 * - Global auth setup
 */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// ---------------------------------------------------------------------------
// Load environment-specific .env file
// Usage: ENV=staging npm test  →  loads .env.staging
//        ENV=production npm test  →  loads .env.production
//        (default)  →  loads .env
// ---------------------------------------------------------------------------
const env = process.env.ENV ?? 'development';
const envFile = env === 'development' ? '.env' : `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Path where the authenticated browser state is saved by the auth setup project
export const STORAGE_STATE = path.join(__dirname, 'tests/fixtures/auth-state.json');

export default defineConfig({
  // Root directory for all test files
  testDir: './tests',

  // Match only .spec.ts files
  testMatch: '**/*.spec.ts',

  // Run tests in parallel within each file
  fullyParallel: true,

  // Fail the build in CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests: 2 times in CI, 1 time locally
  retries: process.env.CI ? 2 : 1,

  // Parallel workers: 1 in CI to avoid resource contention, 3 locally
  workers: process.env.CI ? 1 : 3,

  // ---------------------------------------------------------------------------
  // Reporters
  // ---------------------------------------------------------------------------
  reporter: [
    // Human-readable HTML report saved to reports/html
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    // Console output during test run
    ['list'],
    // JSON report for CI integrations
    ['json', { outputFile: 'reports/results.json' }],
  ],

  // ---------------------------------------------------------------------------
  // Global settings applied to every test
  // ---------------------------------------------------------------------------
  use: {
    // Base URL from .env — all page.goto('/path') calls are relative to this
    baseURL: process.env.BASE_URL ?? 'https://ares.smarterrisk.app/',

    // Capture trace on first retry for debugging failures
    trace: 'on-first-retry',

    // Screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Keep video only for failed tests
    video: 'retain-on-failure',

    // Default timeout for each action (click, fill, etc.)
    actionTimeout: 15_000,

    // Default timeout for navigation (page.goto, waitForURL, etc.)
    navigationTimeout: 30_000,

    // Ignore HTTPS certificate errors (useful for staging environments)
    ignoreHTTPSErrors: true,

    // Viewport size
    viewport: { width: 1280, height: 720 },
  },

  // Default timeout for each test (30 seconds)
  timeout: 60_000,

  // Default timeout for expect() assertions
  expect: {
    timeout: 10_000,
  },

  // Output directory for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results',

  // ---------------------------------------------------------------------------
  // Browser Projects
  // ---------------------------------------------------------------------------
  projects: [
    // ── Auth Setup ──────────────────────────────────────────────────────────
    // Runs first to log in and save the browser state.
    // All other projects depend on this so they reuse the session.
    {
      name: 'setup',
      testMatch: '**/setup/auth.setup.ts',
    },

    // ── Desktop Browsers ────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reuse the saved auth state so tests start already logged in
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },

    // ── Mobile Viewports ────────────────────────────────────────────────────
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
