/**
 * RecommendationsPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Recommendations screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export type Priority = 'High' | 'Medium' | 'Low';

export class RecommendationsPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private get recommendationsList() {
    return this.page.locator('[data-testid="recommendations-list"], [class*="recommendation"]').first();
  }

  private get firstRecommendationItem() {
    return this.page.locator('[data-testid="recommendation-item"]').first();
  }

  /**
   * Priority dropdown for the first recommendation.
   * Adjust selector to match the actual app.
   */
  private get firstPriorityDropdown() {
    return this.page
      .locator('[data-testid="priority-select"], select[name*="priority"]')
      .first();
  }

  private get savePriorityButton() {
    return this.page.getByRole('button', { name: /save|update/i });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.RECOMMENDATIONS);
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Update the priority of the first recommendation.
   * @param priority - 'High' | 'Medium' | 'Low'
   */
  async updateFirstRecommendationPriority(priority: Priority): Promise<void> {
    await this.firstPriorityDropdown.selectOption(priority);
    await this.savePriorityButton.click();
    await this.toastHelper.expectSuccessToast('updated');
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectRecommendationsVisible(): Promise<void> {
    await expect(this.recommendationsList).toBeVisible({ timeout: 15_000 });
  }

  async expectFirstPriorityIs(priority: Priority): Promise<void> {
    await expect(this.firstPriorityDropdown).toHaveValue(priority, { timeout: 5_000 });
  }
}
