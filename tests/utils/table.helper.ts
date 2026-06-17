/**
 * table.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable helpers for interacting with and validating HTML tables / data grids.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, Locator, expect } from '@playwright/test';

export class TableHelper {
  constructor(private page: Page) {}

  /**
   * Get all header cell texts from a table.
   * @param tableSelector - CSS selector for the <table> element
   */
  async getHeaders(tableSelector = 'table'): Promise<string[]> {
    const headers = this.page.locator(`${tableSelector} thead th`);
    return headers.allTextContents();
  }

  /**
   * Assert that the table has exactly the expected column headers.
   */
  async expectHeaders(expectedHeaders: string[], tableSelector = 'table'): Promise<void> {
    const actual = await this.getHeaders(tableSelector);
    // Trim whitespace from each header before comparing
    const trimmed = actual.map((h) => h.trim());
    expect(trimmed).toEqual(expectedHeaders);
  }

  /**
   * Get the number of data rows (excludes the header row).
   */
  async getRowCount(tableSelector = 'table'): Promise<number> {
    return this.page.locator(`${tableSelector} tbody tr`).count();
  }

  /**
   * Assert that the table has at least one data row.
   */
  async expectHasRows(tableSelector = 'table'): Promise<void> {
    const count = await this.getRowCount(tableSelector);
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Get all text values from a specific column (0-indexed).
   * @param columnIndex - Zero-based column index
   */
  async getColumnValues(columnIndex: number, tableSelector = 'table'): Promise<string[]> {
    const cells = this.page.locator(
      `${tableSelector} tbody tr td:nth-child(${columnIndex + 1})`,
    );
    return cells.allTextContents();
  }

  /**
   * Find a row that contains the given text in any cell.
   * Returns the row Locator so you can interact with it further.
   */
  getRowByText(text: string, tableSelector = 'table'): Locator {
    return this.page
      .locator(`${tableSelector} tbody tr`)
      .filter({ hasText: text });
  }

  /**
   * Click a specific action button inside a row identified by row text.
   * @param rowText      - Unique text that identifies the row
   * @param buttonLabel  - Accessible name or text of the button to click
   */
  async clickRowAction(
    rowText: string,
    buttonLabel: string,
    tableSelector = 'table',
  ): Promise<void> {
    const row = this.getRowByText(rowText, tableSelector);
    await row.getByRole('button', { name: buttonLabel }).click();
  }

  /**
   * Assert that a specific cell value exists somewhere in the table.
   */
  async expectCellValue(value: string, tableSelector = 'table'): Promise<void> {
    const cell = this.page
      .locator(`${tableSelector} tbody tr td`)
      .filter({ hasText: value });
    await expect(cell.first()).toBeVisible();
  }

  /**
   * Assert that the table shows an "empty state" message when there are no rows.
   * @param emptyText - Text shown when the table is empty (e.g. "No data found")
   */
  async expectEmptyState(emptyText: string): Promise<void> {
    const emptyMsg = this.page
      .locator('[data-testid="empty-state"], .empty-state, [class*="no-data"]')
      .filter({ hasText: emptyText });
    await expect(emptyMsg.first()).toBeVisible();
  }

  /**
   * Get all text content from every cell in a specific row (0-indexed).
   */
  async getRowData(rowIndex: number, tableSelector = 'table'): Promise<string[]> {
    const cells = this.page.locator(
      `${tableSelector} tbody tr:nth-child(${rowIndex + 1}) td`,
    );
    return cells.allTextContents();
  }
}
