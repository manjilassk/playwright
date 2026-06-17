/**
 * OrdersPage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Page Object for the Orders screen (single order creation + bulk upload).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls.config';

export interface SingleOrderData {
  clientName: string;
  clientEmail: string;
  companyName: string;
  orderType?: string;
}

export class OrdersPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────

  /** "Create Order" / "New Order" button */
  private get createOrderButton() {
    return this.page.getByRole('button', { name: /create order|new order/i });
  }

  /** "Bulk Upload" button */
  private get bulkUploadButton() {
    return this.page.getByRole('button', { name: /bulk upload/i });
  }

  /** Order form — client name field */
  private get clientNameInput() {
    return this.page.getByLabel(/client name/i);
  }

  /** Order form — client email field */
  private get clientEmailInput() {
    return this.page.getByLabel(/client email/i);
  }

  /** Order form — company name field */
  private get companyNameInput() {
    return this.page.getByLabel(/company name/i);
  }

  /** Order form — order type dropdown */
  private get orderTypeSelect() {
    return this.page.getByLabel(/order type/i);
  }

  /** Submit button inside the order creation form/modal */
  private get submitOrderButton() {
    return this.page.getByRole('button', { name: /submit|create|save/i });
  }

  /** File input for bulk upload */
  private get bulkUploadInput() {
    return this.page.locator('input[type="file"]');
  }

  /** "Upload" / "Process" button in the bulk upload modal */
  private get processUploadButton() {
    return this.page.getByRole('button', { name: /upload|process|import/i });
  }

  /** Orders table */
  private get ordersTable() {
    return this.page.locator('table, [data-testid="orders-table"]').first();
  }

  /** Status badge for the first order in the table */
  private get firstOrderStatus() {
    return this.page
      .locator('table tbody tr:first-child [data-testid="status-badge"], table tbody tr:first-child td')
      .nth(2); // Adjust column index to match actual table
  }

  /** Processing status indicator */
  private get processingIndicator() {
    return this.page.locator('[data-testid="processing-indicator"], [class*="processing"]').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(URLS.ORDERS);
    await this.waitHelper.waitForPageLoader();
  }

  /**
   * Open the "Create Order" form/modal.
   */
  async openCreateOrderForm(): Promise<void> {
    await this.createOrderButton.click();
    // Wait for the form/modal to appear
    await expect(this.clientNameInput).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Fill in and submit a single order.
   */
  async createOrder(data: SingleOrderData): Promise<void> {
    await this.openCreateOrderForm();
    await this.clientNameInput.fill(data.clientName);
    await this.clientEmailInput.fill(data.clientEmail);
    await this.companyNameInput.fill(data.companyName);
    if (data.orderType) {
      await this.orderTypeSelect.selectOption(data.orderType);
    }
    await this.submitOrderButton.click();
    // Wait for the success toast
    await this.toastHelper.expectSuccessToast('created');
  }

  /**
   * Open the bulk upload modal.
   */
  async openBulkUpload(): Promise<void> {
    await this.bulkUploadButton.click();
    await expect(this.bulkUploadInput).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Upload a CSV file for bulk order processing.
   * @param filePath - Path to the CSV file (relative to project root)
   */
  async uploadBulkOrders(filePath: string): Promise<void> {
    await this.openBulkUpload();
    await this.fileUploadHelper.uploadViaLocator(this.bulkUploadInput, filePath);
    await this.processUploadButton.click();
    // Wait for the upload to be acknowledged
    await this.toastHelper.expectSuccessToast('upload');
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async expectOrdersTableVisible(): Promise<void> {
    await expect(this.ordersTable).toBeVisible({ timeout: 15_000 });
  }

  async expectOrderInTable(clientName: string): Promise<void> {
    await this.tableHelper.expectCellValue(clientName);
  }

  async expectProcessingStatus(): Promise<void> {
    await expect(this.processingIndicator).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Assert that the first order's status matches the expected value.
   */
  async expectFirstOrderStatus(status: string): Promise<void> {
    await expect(this.firstOrderStatus).toContainText(status, { timeout: 15_000 });
  }
}
