/**
 * toast.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable helpers for validating toast / snackbar notifications.
 *
 * Toast messages are transient — they appear briefly then disappear.
 * These helpers capture them reliably before they vanish.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';

/** Common toast container selectors — extend as needed */
const TOAST_SELECTORS = [
  '[data-testid="toast"]',
  '[data-testid="notification"]',
  '.toast',
  '.snackbar',
  '[class*="toast"]',
  '[class*="notification"]',
  '[role="alert"]',
  '[role="status"]',
];

export class ToastHelper {
  constructor(private page: Page) {}

  /**
   * Wait for a toast to appear and return its text content.
   * Tries each known selector until one is found.
   */
  async getToastText(timeout = 10_000): Promise<string> {
    for (const selector of TOAST_SELECTORS) {
      const toast = this.page.locator(selector).first();
      try {
        await toast.waitFor({ state: 'visible', timeout: 3_000 });
        return (await toast.textContent()) ?? '';
      } catch {
        // Try the next selector
      }
    }
    throw new Error(`No toast message appeared within ${timeout}ms`);
  }

  /**
   * Assert that a success toast containing the expected text is visible.
   * @param expectedText - Partial or full text to match
   */
  async expectSuccessToast(expectedText: string, timeout = 10_000): Promise<void> {
    const text = await this.getToastText(timeout);
    expect(text.toLowerCase()).toContain(expectedText.toLowerCase());
  }

  /**
   * Assert that an error toast containing the expected text is visible.
   */
  async expectErrorToast(expectedText: string, timeout = 10_000): Promise<void> {
    const text = await this.getToastText(timeout);
    expect(text.toLowerCase()).toContain(expectedText.toLowerCase());
  }

  /**
   * Assert that any toast is visible (without checking content).
   */
  async expectToastVisible(timeout = 10_000): Promise<void> {
    for (const selector of TOAST_SELECTORS) {
      const toast = this.page.locator(selector).first();
      try {
        await toast.waitFor({ state: 'visible', timeout: 3_000 });
        return;
      } catch {
        // Try next
      }
    }
    throw new Error(`No toast appeared within ${timeout}ms`);
  }

  /**
   * Wait for all toasts to disappear (useful before the next action).
   */
  async waitForToastToDisappear(timeout = 10_000): Promise<void> {
    for (const selector of TOAST_SELECTORS) {
      const toast = this.page.locator(selector).first();
      const count = await toast.count();
      if (count > 0) {
        await toast.waitFor({ state: 'hidden', timeout });
      }
    }
  }
}
