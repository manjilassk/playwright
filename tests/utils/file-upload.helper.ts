/**
 * file-upload.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable helpers for file upload interactions.
 *
 * Handles both:
 *  - Standard <input type="file"> elements
 *  - Drag-and-drop upload zones
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Page, Locator } from '@playwright/test';
import path from 'path';

export class FileUploadHelper {
  constructor(private page: Page) {}

  /**
   * Upload a file via a standard file input element.
   *
   * @param inputSelector - CSS selector for the <input type="file">
   * @param filePath      - Path to the file (relative to project root)
   *
   * @example
   * await fileUploadHelper.uploadViaInput('[data-testid="file-input"]', 'tests/test-data/files/sample.csv');
   */
  async uploadViaInput(inputSelector: string, filePath: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), filePath);
    await this.page.locator(inputSelector).setInputFiles(absolutePath);
  }

  /**
   * Upload a file via a drag-and-drop zone.
   * Playwright's setInputFiles works on hidden inputs too — we find the
   * hidden input inside the drop zone.
   *
   * @param dropZoneSelector - CSS selector for the drop zone container
   * @param filePath         - Path to the file (relative to project root)
   */
  async uploadViaDragDrop(dropZoneSelector: string, filePath: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const dropZone = this.page.locator(dropZoneSelector);

    // Try to find a hidden file input inside the drop zone first
    const hiddenInput = dropZone.locator('input[type="file"]');
    const inputCount = await hiddenInput.count();

    if (inputCount > 0) {
      await hiddenInput.setInputFiles(absolutePath);
    } else {
      // Fallback: use Playwright's drag-and-drop API
      await this.page.dispatchEvent(dropZoneSelector, 'drop', {
        dataTransfer: await this.createDataTransfer(absolutePath),
      });
    }
  }

  /**
   * Upload a file using a Locator reference (useful when the input is
   * already captured in a page object).
   */
  async uploadViaLocator(locator: Locator, filePath: string): Promise<void> {
    const absolutePath = path.resolve(process.cwd(), filePath);
    await locator.setInputFiles(absolutePath);
  }

  /**
   * Create a DataTransfer object for simulated drag-and-drop.
   * Runs inside the browser context where DataTransfer is available.
   * (Internal helper — not typically called directly.)
   */
  private async createDataTransfer(absolutePath: string): Promise<unknown> {
    return this.page.evaluateHandle((filePath: string) => {
      const dt = new DataTransfer();
      const file = new File([''], filePath.split('/').pop() ?? 'file', {
        type: 'text/csv',
      });
      dt.items.add(file);
      return dt;
    }, absolutePath);
  }
}
