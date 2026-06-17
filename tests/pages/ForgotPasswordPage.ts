/**
 * ForgotPasswordPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Forgot Password screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export class ForgotPasswordPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private get emailInput() {
    return this.page.getByLabel(/e-mail|email/i);
  }

  private get submitButton() {
    return this.page.getByRole('button', { name: /send|reset|submit/i });
  }

  private get successMessage() {
    return this.page.locator(
      '[data-testid="success-message"], .success-message, [class*="success"], [role="status"]',
    ).first();
  }

  private get backToLoginLink() {
    return this.page.getByRole('link', { name: /back to login|sign in/i });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.FORGOT_PASSWORD);
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginLink.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 10_000 });
  }
}
