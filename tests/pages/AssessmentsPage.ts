/**
 * AssessmentsPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Assessments screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export class AssessmentsPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  private get assessmentsList() {
    return this.page.locator('[data-testid="assessments-list"], [class*="assessment-list"]').first();
  }

  private get firstAssessmentItem() {
    return this.page.locator('[data-testid="assessment-item"], [class*="assessment-item"]').first();
  }

  private get startAssessmentButton() {
    return this.page.getByRole('button', { name: /start assessment|begin/i });
  }

  private get nextQuestionButton() {
    return this.page.getByRole('button', { name: /next|continue/i });
  }

  private get submitAssessmentButton() {
    return this.page.getByRole('button', { name: /submit|finish|complete/i });
  }

  private get completionMessage() {
    return this.page.locator('[data-testid="completion-message"], [class*="completion"]').first();
  }

  private get assessmentScore() {
    return this.page.locator('[data-testid="assessment-score"], [class*="score"]').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.ASSESSMENTS);
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Open the first available assessment.
   */
  async openFirstAssessment(): Promise<void> {
    await this.firstAssessmentItem.click();
    await expect(this.startAssessmentButton).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Start the assessment.
   */
  async startAssessment(): Promise<void> {
    await this.startAssessmentButton.click();
  }

  /**
   * Answer all questions by clicking the first available option on each page,
   * then clicking Next until the Submit button appears.
   *
   * @param maxQuestions - Safety limit to prevent infinite loops
   */
  async completeAssessment(maxQuestions = 50): Promise<void> {
    for (let i = 0; i < maxQuestions; i++) {
      // Select the first radio/checkbox option on the current question
      const firstOption = this.page
        .locator('input[type="radio"], input[type="checkbox"]')
        .first();

      const optionCount = await firstOption.count();
      if (optionCount > 0) {
        await firstOption.check();
      }

      // Check if Submit button is visible — if so, we're on the last question
      const submitVisible = await this.submitAssessmentButton.isVisible();
      if (submitVisible) {
        await this.submitAssessmentButton.click();
        return;
      }

      // Otherwise click Next
      const nextVisible = await this.nextQuestionButton.isVisible();
      if (nextVisible) {
        await this.nextQuestionButton.click();
      } else {
        break;
      }
    }
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectAssessmentsListVisible(): Promise<void> {
    await expect(this.assessmentsList).toBeVisible({ timeout: 15_000 });
  }

  async expectCompletionMessageVisible(): Promise<void> {
    await expect(this.completionMessage).toBeVisible({ timeout: 15_000 });
  }

  async expectScoreVisible(): Promise<void> {
    await expect(this.assessmentScore).toBeVisible({ timeout: 10_000 });
  }
}
