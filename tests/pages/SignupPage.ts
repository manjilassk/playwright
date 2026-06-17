/**
 * SignupPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Signup / Registration screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

export class SignupPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private get firstNameInput() {
    return this.page.getByLabel(/first name/i);
  }

  private get lastNameInput() {
    return this.page.getByLabel(/last name/i);
  }

  private get emailInput() {
    return this.page.getByLabel(/e-mail|email/i);
  }

  private get passwordInput() {
    return this.page.getByLabel(/^password/i);
  }

  private get companyInput() {
    return this.page.getByLabel(/company/i);
  }

  private get phoneInput() {
    return this.page.getByLabel(/phone/i);
  }

  private get submitButton() {
    return this.page.getByRole('button', { name: /sign up|register|create account/i });
  }

  private get emailError() {
    return this.page.locator('[data-testid="email-error"], [class*="error"]').first();
  }

  private get passwordError() {
    return this.page.locator('[data-testid="password-error"], [class*="error"]').nth(1);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.SIGNUP);
  }

  /**
   * Fill in the signup form with the provided data.
   */
  async fillForm(data: SignupData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    if (data.company) await this.companyInput.fill(data.company);
    if (data.phone) await this.phoneInput.fill(data.phone);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async fillAndSubmit(data: SignupData): Promise<void> {
    await this.fillForm(data);
    await this.submit();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectSubmitButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectEmailError(): Promise<void> {
    await expect(this.emailError).toBeVisible({ timeout: 5_000 });
  }
}
