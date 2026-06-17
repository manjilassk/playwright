/**
 * urls.config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All application routes in one place.
 * Use these constants in page objects and tests instead of hardcoding paths.
 *
 * Usage:
 *   import { URLS } from '@config/urls.config';
 *   await page.goto(URLS.LOGIN);
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const URLS = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  BULK_UPLOAD: '/orders/bulk-upload',
  ASSESSMENTS: '/assessments',
  RECOMMENDATIONS: '/recommendations',
  CLIENTS: '/clients',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  TEAM: '/team',
  UPGRADE: '/upgrade',
  FORGOT_PASSWORD: '/forgot-password',
  SIGNUP: '/signup',
} as const;
