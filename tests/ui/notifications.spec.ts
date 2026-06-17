/**
 * notifications.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Notifications
 *
 * Tags: @regression @notifications
 *
 * Covers:
 *  ✅ Notification bell is visible
 *  ✅ Notification panel opens on click
 *  ✅ Notifications list is displayed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Notifications', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    // Start from the dashboard where the notification bell lives
    await dashboardPage.goto();
    await dashboardPage.expectDashboardLoaded();
  });

  test('should open the notifications panel @smoke', async ({ dashboardPage }) => {
    // Act: click the notification bell
    await dashboardPage.openNotifications();

    // Assert: the panel is visible
    await dashboardPage.expectNotificationPanelVisible();
  });

  test('should display notifications in the panel @regression', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openNotifications();

    // Assert: at least one notification item is visible
    // Adjust the selector to match the actual notification item in the app
    const notificationItems = page.locator(
      '[data-testid="notification-item"], [class*="notification-item"]',
    );

    // We don't assert a specific count — just that the list renders
    await expect(notificationItems.first()).toBeVisible({ timeout: 10_000 });
  });

  test('should close the notifications panel @regression', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.openNotifications();
    await dashboardPage.expectNotificationPanelVisible();

    // Close by pressing Escape or clicking outside
    await page.keyboard.press('Escape');

    // Assert: panel is no longer visible
    const panel = page.locator(
      '[data-testid="notification-panel"], [class*="notification-dropdown"]',
    ).first();
    await expect(panel).toBeHidden({ timeout: 5_000 });
  });
});
