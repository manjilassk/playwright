/**
 * DashboardPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the main Dashboard screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export class DashboardPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  /** Main dashboard heading */
  private get dashboardHeading() {
    return this.page.getByRole('heading', { name: /dashboard/i });
  }

  /** Sidebar navigation */
  private get sidebar() {
    return this.page.locator('[data-testid="sidebar"], nav, aside').first();
  }

  /** Upgrade button in the sidebar or header */
  private get upgradeButton() {
    return this.page.getByRole('button', { name: /upgrade/i });
  }

  /** Spinner/loader inside the upgrade button */
  private get upgradeButtonLoader() {
    return this.upgradeButton.locator('[class*="spinner"], [class*="loading"], svg.animate-spin');
  }

  /** Invite Teammate button / menu item */
  private get inviteTeammateOption() {
    return this.page.getByRole('button', { name: /invite teammate/i })
      .or(this.page.getByText(/invite teammate/i));
  }

  /** Notification bell icon */
  private get notificationBell() {
    return this.page.locator('[data-testid="notification-bell"], [aria-label*="notification"]').first();
  }

  /** Notification dropdown panel */
  private get notificationPanel() {
    return this.page.locator('[data-testid="notification-panel"], [class*="notification-dropdown"]').first();
  }

  /** User avatar / profile menu trigger */
  private get userMenu() {
    return this.page.locator('[data-testid="user-menu"], [aria-label*="user menu"], [class*="avatar"]').first();
  }

  /** Logout menu item */
  private get logoutMenuItem() {
    return this.page.getByRole('menuitem', { name: /logout|sign out/i })
      .or(this.page.getByRole('button', { name: /logout|sign out/i }));
  }

  /** Summary stat cards (e.g. total orders, active clients) */
  private get statCards() {
    return this.page.locator('[data-testid="stat-card"], [class*="stat-card"], [class*="summary-card"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.DASHBOARD);
  }

  /**
   * Click the Upgrade button and return immediately.
   * Use expectUpgradeButtonLoaderVisible() to check the loader state.
   */
  async clickUpgrade(): Promise<void> {
    await this.upgradeButton.click();
  }

  /**
   * Open the notification panel by clicking the bell icon.
   */
  async openNotifications(): Promise<void> {
    await this.notificationBell.click();
    await expect(this.notificationPanel).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Open the user profile menu.
   */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  /**
   * Perform a full logout.
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutMenuItem.click();
    // Wait for redirect back to the login page
    await this.page.waitForURL('**/', { timeout: 15_000 });
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Assert that the dashboard has fully loaded.
   */
  async expectDashboardLoaded(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible({ timeout: 15_000 });
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Assert that the upgrade button is disabled (e.g. during order processing).
   */
  async expectUpgradeButtonDisabled(): Promise<void> {
    await expect(this.upgradeButton).toBeDisabled({ timeout: 10_000 });
  }

  /**
   * Assert that the upgrade button is enabled.
   */
  async expectUpgradeButtonEnabled(): Promise<void> {
    await expect(this.upgradeButton).toBeEnabled({ timeout: 10_000 });
  }

  /**
   * Assert that the loader/spinner is visible inside the upgrade button.
   */
  async expectUpgradeButtonLoaderVisible(): Promise<void> {
    await expect(this.upgradeButtonLoader).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Assert that the "Invite Teammate" option is visible without a page refresh.
   */
  async expectInviteTeammateVisible(): Promise<void> {
    await expect(this.inviteTeammateOption).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Assert that the notification panel is visible.
   */
  async expectNotificationPanelVisible(): Promise<void> {
    await expect(this.notificationPanel).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Assert that at least one stat card is visible.
   */
  async expectStatCardsVisible(): Promise<void> {
    await expect(this.statCards.first()).toBeVisible({ timeout: 10_000 });
  }
}
