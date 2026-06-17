/**
 * base.fixture.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom Playwright fixtures that extend the built-in `test` object.
 *
 * WHY USE FIXTURES?
 * Instead of instantiating page objects in every test file, fixtures inject
 * them automatically. This keeps tests clean and DRY.
 *
 * USAGE:
 *   // Import `test` from this file instead of '@playwright/test'
 *   import { test, expect } from '../fixtures/base.fixture';
 *
 *   test('my test', async ({ loginPage, dashboardPage }) => {
 *     await loginPage.goto();
 *     // ...
 *   });
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { OrdersPage } from '../pages/OrdersPage';
import { AssessmentsPage } from '../pages/AssessmentsPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { ClientsPage } from '../pages/ClientsPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { SignupPage } from '../pages/SignupPage';
import { WaitHelper } from '../utils/wait.helper';
import { ToastHelper } from '../utils/toast.helper';
import { TableHelper } from '../utils/table.helper';
import { ApiHelper } from '../utils/api.helper';

// ── Type definition for all custom fixtures ──────────────────────────────────
type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  ordersPage: OrdersPage;
  assessmentsPage: AssessmentsPage;
  recommendationsPage: RecommendationsPage;
  clientsPage: ClientsPage;
  forgotPasswordPage: ForgotPasswordPage;
  signupPage: SignupPage;
  waitHelper: WaitHelper;
  toastHelper: ToastHelper;
  tableHelper: TableHelper;
  apiHelper: ApiHelper;
};

// ── Extended test object ──────────────────────────────────────────────────────
export const test = base.extend<CustomFixtures>({
  // Page objects — each receives the current `page` automatically
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  assessmentsPage: async ({ page }, use) => {
    await use(new AssessmentsPage(page));
  },
  recommendationsPage: async ({ page }, use) => {
    await use(new RecommendationsPage(page));
  },
  clientsPage: async ({ page }, use) => {
    await use(new ClientsPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  // Utility helpers
  waitHelper: async ({ page }, use) => {
    await use(new WaitHelper(page));
  },
  toastHelper: async ({ page }, use) => {
    await use(new ToastHelper(page));
  },
  tableHelper: async ({ page }, use) => {
    await use(new TableHelper(page));
  },
  apiHelper: async ({ request }, use) => {
    await use(new ApiHelper(request));
  },
});

// Re-export expect so tests only need one import
export { expect };
