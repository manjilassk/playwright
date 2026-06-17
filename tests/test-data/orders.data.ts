/**
 * orders.data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Static and dynamic order test data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A single order payload used in "create order" tests */
export const SINGLE_ORDER = {
  clientName: 'Test Client Automation',
  clientEmail: 'testclient@yopmail.com',
  companyName: 'Automation Corp',
  orderType: 'Standard',
} as const;

/** Expected column headers for the orders table */
export const ORDER_TABLE_HEADERS = [
  'Client Name',
  'Company',
  'Status',
  'Created At',
  'Actions',
] as const;

/** Possible order status values */
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
} as const;

/** Path to the sample bulk-upload CSV (relative to project root) */
export const BULK_UPLOAD_FILE_PATH = 'tests/test-data/files/sample-bulk-orders.csv';
