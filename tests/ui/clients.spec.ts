/**
 * clients.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Client score visibility on partner dashboard
 *
 * Tags: @regression @clients
 *
 * Covers:
 *  ✅ Clients table is visible
 *  ✅ Client score is visible
 *  ✅ Client score is a numeric value
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Partner Dashboard — Client Scores', () => {
  test.beforeEach(async ({ clientsPage }) => {
    await clientsPage.goto();
  });

  test('should display the clients table @smoke', async ({ clientsPage }) => {
    await clientsPage.expectClientsTableVisible();
  });

  test('should show client score on the partner dashboard @regression', async ({
    clientsPage,
  }) => {
    await clientsPage.expectClientScoreVisible();
  });

  test('should display a numeric client score @regression', async ({
    clientsPage,
  }) => {
    await clientsPage.expectClientScoreIsNumeric();
  });
});
