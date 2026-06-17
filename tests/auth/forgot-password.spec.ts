/**
 * forgot-password.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Forgot Password flow
 *
 * Tags: @regression @auth
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';
import { USERS } from '../test-data/users.data';

// Fresh session — no auth state needed
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Start from the login page and navigate to forgot password
    await loginPage.goto();
    await loginPage.clickForgotPassword();
  });

  test('should display the forgot password page @regression', async ({
    forgotPasswordPage,
  }) => {
    await forgotPasswordPage.expectPageVisible();
  });

  test('should show success message after submitting a valid email @regression', async ({
    forgotPasswordPage,
  }) => {
    // Act: submit a registered email
    await forgotPasswordPage.submitEmail(USERS.valid.email);

    // Assert: success confirmation is shown
    await forgotPasswordPage.expectSuccessMessageVisible();
  });

  test('should navigate back to login page @regression', async ({
    forgotPasswordPage,
    page,
  }) => {
    await forgotPasswordPage.clickBackToLogin();

    // Assert: back on the login page
    await expect(page).toHaveURL(/\/$/);
  });
});
