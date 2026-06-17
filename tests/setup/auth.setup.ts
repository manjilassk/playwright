/**
 * auth.setup.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Global authentication setup.
 *
 * This file runs ONCE before all other test projects (see playwright.config.ts).
 * It logs in with valid credentials and saves the browser storage state
 * (cookies + localStorage) to a JSON file.
 *
 * All other test projects load that saved state so they start already
 * logged in — no need to log in at the start of every test.
 *
 * HOW IT WORKS:
 *   1. Open the login page
 *   2. Fill in credentials from .env
 *   3. Wait for the dashboard to load
 *   4. Save the browser state to tests/fixtures/auth-state.json
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../../playwright.config';
import { ENV } from '../config/env.config';

setup('authenticate', async ({ page }) => {
  console.log(`\n🔐 Running auth setup for: ${ENV.VALID_EMAIL}`);

  // Navigate to the login page
  await page.goto('/');

  // Fill in credentials
  await page.getByLabel('E-mail').fill(ENV.VALID_EMAIL);
  await page.locator('input[type="password"]').fill(ENV.VALID_PASSWORD);

  // Click the submit button — use a more specific locator to avoid matching
  // the sidebar "Login" nav link that also exists on the page
  const loginBtn = page.locator('button[type="submit"]').or(
    page.locator('form').getByRole('button', { name: 'Login' })
  ).first();

  await loginBtn.click();

  // Wait for navigation to the dashboard after login
  await page.waitForURL('**/dashboard**', { timeout: 30_000 });

  // Confirm we are on the dashboard
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({
    timeout: 15_000,
  });

  // Save the authenticated browser state
  await page.context().storageState({ path: STORAGE_STATE });

  console.log(`✅ Auth state saved to: ${STORAGE_STATE}`);
});
