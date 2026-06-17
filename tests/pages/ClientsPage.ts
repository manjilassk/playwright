/**
 * ClientsPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Clients / Partner Dashboard screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export class ClientsPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private get clientsTable() {
    return this.page.locator('table, [data-testid="clients-table"]').first();
  }

  private get firstClientScore() {
    return this.page
      .locator('[data-testid="client-score"], [class*="score"]')
      .first();
  }

  private get clientScoreColumn() {
    return this.page.locator('table tbody tr td[data-testid="score-cell"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.CLIENTS);
    await this.waitHelper.waitForPageLoader();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectClientsTableVisible(): Promise<void> {
    await expect(this.clientsTable).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Assert that at least one client score is visible on the partner dashboard.
   */
  async expectClientScoreVisible(): Promise<void> {
    await expect(this.firstClientScore).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Assert that the score value is a number (not empty or "N/A").
   */
  async expectClientScoreIsNumeric(): Promise<void> {
    const scoreText = await this.firstClientScore.textContent();
    const score = parseFloat(scoreText ?? '');
    expect(isNaN(score)).toBe(false);
  }
}
