/**
 * users.data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised user test data.
 * Credentials are pulled from environment variables so nothing sensitive
 * is hardcoded in source control.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ENV } from '../config/env.config';

export const USERS = {
  /** Standard agency user — used for most tests */
  valid: {
    email: ENV.VALID_EMAIL,
    password: ENV.VALID_PASSWORD,
  },

  /** Admin user — used for admin-only tests */
  admin: {
    email: ENV.ADMIN_EMAIL,
    password: ENV.ADMIN_PASSWORD,
  },

  /** Partner user — used for partner dashboard tests */
  partner: {
    email: ENV.PARTNER_EMAIL,
    password: ENV.PARTNER_PASSWORD,
  },

  /** Intentionally wrong credentials — used for negative login tests */
  invalid: {
    email: 'wrong@example.com',
    password: 'wrongpassword',
  },

  /** Correct email but wrong password */
  wrongPassword: {
    email: ENV.VALID_EMAIL,
    password: 'wrongpassword123',
  },

  /** Malformed email — used for validation tests */
  malformedEmail: {
    email: 'not-an-email',
    password: ENV.VALID_PASSWORD,
  },
} as const;
