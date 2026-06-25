/**
 * LoginPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Login screen.
 *
 * Encapsulates all locators and actions related to logging in.
 * Tests should never interact with the DOM directly — always go through here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export class LoginPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────
  // Prefer data-testid selectors. Fall back to role/label selectors when
  // data-testid attributes are not present in the app.

  /** Email input field */
  private get emailInput() {
    return this.page.getByLabel('E-mail');
  }

  /** Password input field — scoped to input only to avoid matching the eye icon button */
  private get passwordInput() {
    return this.page.locator('input[type="password"]');
  }

  /** Login submit button — scoped to the form to avoid matching the sidebar nav link */
  private get loginButton() {
    return this.page.locator('button[type="submit"]').or(
      this.page.locator('form').getByRole('button', { name: 'Login' })
    ).first();
  }

  /** "Forgot password?" link */
  private get forgotPasswordLink() {
    return this.page.getByRole('link', { name: /forgot password/i });
  }

  /** "Sign up" / "Create account" link */
  private get signUpLink() {
    return this.page.getByRole('link', { name: /sign up|create account|register/i });
  }

  /** Error message shown for invalid credentials */
  private get errorMessage() {
    return this.page.locator(
      '[data-testid="login-error"], .error-message, [class*="error"], [role="alert"]',
    ).first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    await this.navigate(URLS.LOGIN);
  }

  /**
   * Fill in the email field.
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in the password field.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the Login button.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Full login flow: fill credentials and submit.
   * Waits for navigation to the dashboard on success.
   *
   * @param email    - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    // Admin accounts land on /admin, regular users on /dashboard
    await this.page.waitForURL(/\/(dashboard|admin)/, { timeout: 30_000 });
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Attempt login without waiting for navigation.
   * Use this for negative tests (invalid credentials) where no redirect happens.
   */
  async attemptLogin(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Click the "Forgot password?" link.
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click the "Sign up" link.
   */
  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert that the login page is visible (email input is present).
   */
  async expectLoginPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert that the login button is enabled.
   */
  async expectLoginButtonEnabled(): Promise<void> {
    await expect(this.loginButton).toBeEnabled();
  }

  /**
   * Assert that an error message is visible after a failed login.
   */
  async expectErrorVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Assert that the error message contains specific text.
   */
  async expectErrorText(text: string): Promise<void> {
    await expect(this.errorMessage).toContainText(text, { timeout: 10_000 });
  }
}
