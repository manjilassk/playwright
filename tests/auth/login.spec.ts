/**
 * login.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Login functionality
 *
 * Tags: @smoke @regression @auth
 *
 * Covers:
 *  ✅ Login with valid credentials
 *  ✅ Login with invalid credentials
 *  ✅ Login with wrong password
 *  ✅ Login with malformed email
 *  ✅ Login button state
 *  ✅ Logout flow
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NOTE: These tests do NOT use the saved auth state because they test the
 * login page itself. They use a fresh browser context each time.
 */

// Import from our custom fixture — NOT from '@playwright/test' directly
import { test, expect } from '../fixtures/base.fixture';
import { USERS } from '../test-data/users.data';

// Tell Playwright NOT to use the saved auth state for this file
// (login tests need a fresh, unauthenticated session)
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  // Navigate to the login page before each test in this block
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Positive Tests ─────────────────────────────────────────────────────

  test('should login successfully with valid credentials @smoke', async ({
    loginPage,
    page,
  }) => {
    // Act: perform the login
    await loginPage.login(USERS.valid.email, USERS.valid.password);

    // Assert: we should be on the dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show the login form correctly @smoke', async ({ loginPage }) => {
    // Assert: all form elements are visible
    await loginPage.expectLoginPageVisible();
    await loginPage.expectLoginButtonEnabled();
  });

  // ── Negative Tests ─────────────────────────────────────────────────────

  test('should show error for completely invalid credentials @regression', async ({
    loginPage,
  }) => {
    // Act: attempt login with wrong email and password
    await loginPage.attemptLogin(USERS.invalid.email, USERS.invalid.password);

    // Assert: an error message should appear
    await loginPage.expectErrorVisible();
  });

  test('should show error for correct email but wrong password @regression', async ({
    loginPage,
  }) => {
    await loginPage.attemptLogin(USERS.wrongPassword.email, USERS.wrongPassword.password);
    await loginPage.expectErrorVisible();
  });

  test('should show validation error for malformed email @regression', async ({
    loginPage,
  }) => {
    // Act: type a malformed email and try to submit
    await loginPage.attemptLogin(USERS.malformedEmail.email, USERS.malformedEmail.password);

    // Assert: browser or app-level validation should prevent submission
    // The URL should NOT change to /dashboard
    await expect(loginPage['page']).not.toHaveURL(/dashboard/);
  });

  test('should not login with empty credentials @regression', async ({
    loginPage,
    page,
  }) => {
    // Act: click login without filling anything
    await loginPage.clickLogin();

    // Assert: still on the login page
    await expect(page).not.toHaveURL(/dashboard/);
  });
});

test.describe('Logout', () => {
  // These tests start already logged in (uses saved auth state from setup)
  test('should logout successfully @smoke', async ({ dashboardPage, page }) => {
    // Navigate to dashboard (already logged in via storageState)
    await dashboardPage.goto();
    await dashboardPage.expectDashboardLoaded();

    // Act: perform logout
    await dashboardPage.logout();

    // Assert: redirected back to login page
    await expect(page).toHaveURL(/\/$/);
  });
});
