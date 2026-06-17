/**
 * wait.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable helpers for waiting on loaders, spinners, and network activity.
 *
 * WHY: Avoid hardcoded `page.waitForTimeout(3000)` calls — they make tests
 * slow and brittle. Instead, wait for a specific DOM condition.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, Locator } from '@playwright/test';

export class WaitHelper {
  constructor(private page: Page) {}

  /**
   * Wait for a full-page loading spinner to disappear.
   * Adjust the selector to match the actual spinner in the app.
   */
  async waitForPageLoader(timeout = 30_000): Promise<void> {
    // Common spinner selectors — add more as you discover them in the app
    const spinnerSelectors = [
      '[data-testid="page-loader"]',
      '.loading-spinner',
      '.loader',
      '[class*="spinner"]',
      '[class*="loading"]',
    ];

    for (const selector of spinnerSelectors) {
      const spinner = this.page.locator(selector);
      // Only wait if the spinner is actually present in the DOM
      const count = await spinner.count();
      if (count > 0) {
        await spinner.waitFor({ state: 'hidden', timeout });
      }
    }
  }

  /**
   * Wait for a button-level loader (e.g. the upgrade button spinner).
   * @param buttonLocator - The button that shows a loader inside it
   */
  async waitForButtonLoader(buttonLocator: Locator, timeout = 15_000): Promise<void> {
    // Wait for the spinner inside the button to disappear
    const buttonSpinner = buttonLocator.locator('[class*="spinner"], [class*="loading"], svg.animate-spin');
    const count = await buttonSpinner.count();
    if (count > 0) {
      await buttonSpinner.waitFor({ state: 'hidden', timeout });
    }
  }

  /**
   * Wait for the network to be idle (no pending requests).
   * Use sparingly — prefer waiting for specific DOM elements.
   */
  async waitForNetworkIdle(timeout = 30_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for a specific API response to complete.
   * Useful when an action triggers a background API call.
   *
   * @param urlPattern - Partial URL or regex to match the request
   * @param action     - The UI action that triggers the request
   *
   * @example
   * await waitHelper.waitForApiResponse('/api/orders', async () => {
   *   await submitButton.click();
   * });
   */
  async waitForApiResponse(
    urlPattern: string | RegExp,
    action: () => Promise<void>,
    timeout = 30_000,
  ): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        (response) => {
          const url = response.url();
          return typeof urlPattern === 'string'
            ? url.includes(urlPattern)
            : urlPattern.test(url);
        },
        { timeout },
      ),
      action(),
    ]);
  }

  /**
   * Wait for a table to finish loading its rows.
   * @param tableSelector - CSS selector for the table or grid container
   */
  async waitForTableData(tableSelector = 'table', timeout = 15_000): Promise<void> {
    // First wait for the table itself to appear
    await this.page.locator(tableSelector).waitFor({ state: 'visible', timeout });
    // Then wait for at least one data row (not just the header)
    await this.page
      .locator(`${tableSelector} tbody tr, ${tableSelector} [data-testid="table-row"]`)
      .first()
      .waitFor({ state: 'visible', timeout });
  }

  /**
   * Poll until a condition function returns true.
   * Use as a last resort when no DOM signal is available.
   *
   * @param condition - Async function that returns true when ready
   * @param interval  - How often to check (ms)
   * @param timeout   - Maximum wait time (ms)
   */
  async pollUntil(
    condition: () => Promise<boolean>,
    interval = 500,
    timeout = 15_000,
  ): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await condition()) return;
      await this.page.waitForTimeout(interval);
    }
    throw new Error(`pollUntil: condition not met within ${timeout}ms`);
  }
}
