/**
 * env.config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised environment configuration.
 *
 * All tests import from here instead of reading process.env directly.
 * This gives you:
 *  - A single place to change variable names
 *  - Type safety (no accidental `undefined` strings)
 *  - Easy mocking in unit tests
 *
 * Usage:
 *   import { ENV } from '@config/env.config';
 *   await page.goto(ENV.BASE_URL);
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const ENV = {
  /** Application base URL — set in .env as BASE_URL */
  BASE_URL: process.env.BASE_URL ?? 'https://ares.smarterrisk.app/',

  /** REST API base URL — set in .env as API_BASE_URL */
  API_BASE_URL: process.env.API_BASE_URL ?? 'https://ares.smarterrisk.app/api',

  /** Valid user credentials */
  VALID_EMAIL: process.env.VALID_EMAIL ?? 'agency@yopmail.com',
  VALID_PASSWORD: process.env.VALID_PASSWORD ?? '12345678',

  /** Admin credentials */
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'admin@yopmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '12345678',

  /** Partner credentials */
  PARTNER_EMAIL: process.env.PARTNER_EMAIL ?? 'partner@yopmail.com',
  PARTNER_PASSWORD: process.env.PARTNER_PASSWORD ?? '12345678',

  /** Current environment label */
  ENV: process.env.ENV ?? 'development',

  /** True when running inside a CI pipeline */
  IS_CI: !!process.env.CI,
} as const;
