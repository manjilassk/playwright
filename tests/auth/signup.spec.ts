/**
 * signup.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Signup / Registration validation
 *
 * Tags: @regression @auth
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';
import { RandomDataHelper } from '../utils/random-data.helper';

// Fresh session — no auth state needed
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Signup Validation', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  test('should display the signup form @regression', async ({ signupPage }) => {
    await signupPage.expectPageVisible();
  });

  test('should allow signup with valid random data @regression', async ({
    signupPage,
    page,
  }) => {
    // Generate unique user data so this test can run repeatedly
    const newUser = RandomDataHelper.user();

    await signupPage.fillAndSubmit({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      company: newUser.company,
    });

    // Assert: either redirected to dashboard or a success/verification message
    // Adjust the URL pattern to match what the app does after signup
    await expect(page).toHaveURL(/dashboard|verify|success/, { timeout: 15_000 });
  });

  test('should show validation error for invalid email format @regression', async ({
    signupPage,
  }) => {
    const user = RandomDataHelper.user();

    await signupPage.fillAndSubmit({
      firstName: user.firstName,
      lastName: user.lastName,
      email: 'not-a-valid-email', // intentionally malformed
      password: user.password,
    });

    await signupPage.expectEmailError();
  });

  test('should disable submit button when form is empty @regression', async ({
    signupPage,
  }) => {
    // Without filling anything, the submit button should be disabled
    // (if the app implements this — otherwise this test will be skipped)
    await signupPage.expectSubmitButtonDisabled();
  });
});
