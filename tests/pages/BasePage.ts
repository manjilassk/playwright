/**
 * BasePage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All page objects extend this class.
 *
 * It provides:
 *  - Common navigation helpers
 *  - Shared utility instances (WaitHelper, ToastHelper, etc.)
 *  - A consistent way to navigate to a page
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { WaitHelper } from '../utils/wait.helper';
import { ToastHelper } from '../utils/toast.helper';
import { TableHelper } from '../utils/table.helper';
import { FileUploadHelper } from '../utils/file-upload.helper';

export abstract class BasePage {
  // ── Utility helpers available to every page object ──────────────────────
  readonly waitHelper: WaitHelper;
  readonly toastHelper: ToastHelper;
  readonly tableHelper: TableHelper;
  readonly fileUploadHelper: FileUploadHelper;

  constructor(protected page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.toastHelper = new ToastHelper(page);
    this.tableHelper = new TableHelper(page);
    this.fileUploadHelper = new FileUploadHelper(page);
  }

  /**
   * Navigate to a URL relative to the base URL.
   * @param path - e.g. '/dashboard' or '/orders'
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Get the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Assert that the current URL contains the expected path.
   */
  async expectUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Assert that the page title matches.
   */
  async expectTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Take a screenshot with a descriptive name.
   * Useful for debugging — call this at key points in a test.
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
