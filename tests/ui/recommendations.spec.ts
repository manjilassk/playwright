/**
 * recommendations.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Recommendations priority update
 *
 * Tags: @regression @recommendations
 *
 * Covers:
 *  ✅ Recommendations list is visible
 *  ✅ Can update priority of a recommendation
 *  ✅ Priority change is persisted (visible after update)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Recommendations', () => {
  test.beforeEach(async ({ recommendationsPage }) => {
    await recommendationsPage.goto();
  });

  test('should display the recommendations list @smoke', async ({
    recommendationsPage,
  }) => {
    await recommendationsPage.expectRecommendationsVisible();
  });

  test('should update recommendation priority to High @regression', async ({
    recommendationsPage,
  }) => {
    // Act: change the first recommendation's priority to High
    await recommendationsPage.updateFirstRecommendationPriority('High');

    // Assert: the dropdown now shows "High"
    await recommendationsPage.expectFirstPriorityIs('High');
  });

  test('should update recommendation priority to Low @regression', async ({
    recommendationsPage,
  }) => {
    await recommendationsPage.updateFirstRecommendationPriority('Low');
    await recommendationsPage.expectFirstPriorityIs('Low');
  });

  test('should update recommendation priority to Medium @regression', async ({
    recommendationsPage,
  }) => {
    await recommendationsPage.updateFirstRecommendationPriority('Medium');
    await recommendationsPage.expectFirstPriorityIs('Medium');
  });
});
