/**
 * orders.spec.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Test suite: Order management
 *
 * Tags: @regression @orders
 *
 * Covers:
 *  ✅ Create a single order
 *  ✅ Bulk order upload via CSV
 *  ✅ Verify order processing status
 *  ✅ Validate orders table structure
 *  ✅ Bulk upload performance (timing assertion)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '../fixtures/base.fixture';
import { SINGLE_ORDER, ORDER_TABLE_HEADERS, ORDER_STATUSES, BULK_UPLOAD_FILE_PATH } from '../test-data/orders.data';
import { RandomDataHelper } from '../utils/random-data.helper';

test.describe('Orders', () => {
  test.beforeEach(async ({ ordersPage }) => {
    await ordersPage.goto();
  });

  // ── Table Structure ─────────────────────────────────────────────────────

  test('should display the orders table @smoke', async ({ ordersPage }) => {
    await ordersPage.expectOrdersTableVisible();
  });

  test('should display correct table headers @regression', async ({ ordersPage, tableHelper }) => {
    // Wait for the table to be visible before checking headers
    await ordersPage.expectOrdersTableVisible();
    const headers = await tableHelper.getHeaders('table');
    const trimmed = headers.map((h) => h.trim()).filter(Boolean);

    // Assert that all expected headers are present
    for (const expected of ORDER_TABLE_HEADERS) {
      expect(trimmed).toContain(expected);
    }
  });

  // ── Single Order Creation ───────────────────────────────────────────────

  test('should create a single order successfully @regression', async ({
    ordersPage,
    tableHelper,
  }) => {
    // Use random data so each test run creates a unique order
    const order = RandomDataHelper.order();

    // Act: create the order
    await ordersPage.createOrder({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      companyName: order.companyName,
    });

    // Assert: the new order appears in the table
    await ordersPage.expectOrderInTable(order.clientName);
  });

  test('should show the new order in the table after creation @regression', async ({
    ordersPage,
    tableHelper,
  }) => {
    const order = RandomDataHelper.order();

    await ordersPage.createOrder({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      companyName: order.companyName,
    });

    // Assert: table has at least one row
    await tableHelper.expectHasRows('table');

    // Assert: the specific client name is in the table
    await tableHelper.expectCellValue(order.clientName);
  });

  // ── Bulk Upload ─────────────────────────────────────────────────────────

  test('should upload bulk orders via CSV @regression', async ({ ordersPage }) => {
    await ordersPage.uploadBulkOrders(BULK_UPLOAD_FILE_PATH);
  });

  test('should complete bulk upload within acceptable time @regression', async ({
    ordersPage,
  }) => {
    /**
     * PERFORMANCE TEST: Bulk upload should complete within 30 seconds.
     * This is a basic timing assertion — for full performance testing
     * use a dedicated tool like k6 or Artillery.
     */
    const startTime = Date.now();

    await ordersPage.uploadBulkOrders(BULK_UPLOAD_FILE_PATH);

    const elapsed = Date.now() - startTime;
    console.log(`Bulk upload completed in ${elapsed}ms`);

    // Assert: upload completed within 30 seconds
    expect(elapsed).toBeLessThan(30_000);
  });

  // ── Order Processing Status ─────────────────────────────────────────────

  test('should show processing status after order submission @regression', async ({
    ordersPage,
  }) => {
    /**
     * SCENARIO: After creating an order, its status should change to
     * "Processing" while the backend works on it.
     */
    const order = RandomDataHelper.order();

    await ordersPage.createOrder({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      companyName: order.companyName,
    });

    // Assert: the order status shows "Processing" or "Pending"
    await ordersPage.expectFirstOrderStatus(ORDER_STATUSES.PROCESSING);
  });

  test('should eventually show completed status @regression', async ({
    ordersPage,
    waitHelper,
  }) => {
    /**
     * SCENARIO: Poll the order status until it becomes "Completed".
     * Uses pollUntil() instead of a hardcoded wait.
     *
     * NOTE: Adjust the timeout based on how long processing actually takes.
     */
    const order = RandomDataHelper.order();

    await ordersPage.createOrder({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      companyName: order.companyName,
    });

    // Poll every 2 seconds for up to 2 minutes
    await waitHelper.pollUntil(
      async () => {
        const statusText = await ordersPage['firstOrderStatus'].textContent();
        return statusText?.includes(ORDER_STATUSES.COMPLETED) ?? false;
      },
      2_000,   // check every 2 seconds
      120_000, // give up after 2 minutes
    );

    await ordersPage.expectFirstOrderStatus(ORDER_STATUSES.COMPLETED);
  });
});
