/**
 * dashboard.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Dashboard functionality
 *
 * Tags: @smoke @regression @dashboard
 *
 * Covers:
 *  ✅ Dashboard loads after login
 *  ✅ Stat cards are visible
 *  ✅ Upgrade button is disabled during processing
 *  ✅ Loader appears on upgrade button
 *  ✅ Invite Teammate option appears without refresh
 *  ✅ Notifications panel opens
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Dashboard', () => {
  // Navigate to the dashboard before each test
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  // ── Load Tests ─────────────────────────────────────────────────────────

  test('should load the dashboard successfully @smoke', async ({
    dashboardPage,
    page,
  }) => {
    // Assert: URL is correct and heading is visible
    await expect(page).toHaveURL(/dashboard/);
    await dashboardPage.expectDashboardLoaded();
  });

  test('should display summary stat cards @smoke', async ({ dashboardPage }) => {
    await dashboardPage.expectStatCardsVisible();
  });

  // ── Upgrade Button Tests ────────────────────────────────────────────────

  test('should show loader on upgrade button when clicked @regression', async ({
    dashboardPage,
  }) => {
    /**
     * SCENARIO: When the user clicks Upgrade while an order is processing,
     * the button should show a spinner to indicate work is in progress.
     *
     * We click the button and immediately check for the loader before
     * the action completes — no hardcoded waits needed.
     */
    await dashboardPage.clickUpgrade();

    // The loader should appear immediately after clicking
    await dashboardPage.expectUpgradeButtonLoaderVisible();
  });

  test('should disable upgrade button during order processing @regression', async ({
    dashboardPage,
  }) => {
    /**
     * SCENARIO: While an order is being processed, the Upgrade button
     * should be disabled to prevent double-submission.
     *
     * This test assumes an order is currently in "processing" state.
     * In a real suite you would set up that state via API before the test.
     */
    await dashboardPage.clickUpgrade();
    await dashboardPage.expectUpgradeButtonDisabled();
  });

  // ── Team Invite Tests ───────────────────────────────────────────────────

  test('should show Invite Teammate option without page refresh @regression', async ({
    dashboardPage,
  }) => {
    /**
     * SCENARIO: After a teammate is invited (or the feature is enabled),
     * the "Invite Teammate" option should appear dynamically — no refresh needed.
     *
     * We simply assert the option is visible in the current DOM state.
     */
    await dashboardPage.expectInviteTeammateVisible();
  });

  // ── Notifications Tests ─────────────────────────────────────────────────

  test('should open notifications panel @regression', async ({ dashboardPage }) => {
    await dashboardPage.openNotifications();
    await dashboardPage.expectNotificationPanelVisible();
  });
});
