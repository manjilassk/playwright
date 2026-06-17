/**
 * assessments.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Assessment completion flow
 *
 * Tags: @regression @assessments
 *
 * Covers:
 *  ✅ Assessments list is visible
 *  ✅ Can start an assessment
 *  ✅ Can complete an assessment
 *  ✅ Completion message is shown
 *  ✅ Score is visible after completion
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Assessments', () => {
  test.beforeEach(async ({ assessmentsPage }) => {
    await assessmentsPage.goto();
  });

  test('should display the assessments list @smoke', async ({ assessmentsPage }) => {
    await assessmentsPage.expectAssessmentsListVisible();
  });

  test('should complete an assessment and show completion message @regression', async ({
    assessmentsPage,
  }) => {
    // Open the first available assessment
    await assessmentsPage.openFirstAssessment();

    // Start it
    await assessmentsPage.startAssessment();

    // Answer all questions (selects first option on each page)
    await assessmentsPage.completeAssessment();

    // Assert: completion message is shown
    await assessmentsPage.expectCompletionMessageVisible();
  });

  test('should show score after assessment completion @regression', async ({
    assessmentsPage,
  }) => {
    await assessmentsPage.openFirstAssessment();
    await assessmentsPage.startAssessment();
    await assessmentsPage.completeAssessment();

    // Assert: a score value is displayed
    await assessmentsPage.expectScoreVisible();
  });
});
