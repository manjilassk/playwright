/**
 * api.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable helpers for making and validating API requests directly.
 *
 * Uses Playwright's built-in APIRequestContext so no extra HTTP library
 * is needed. Useful for:
 *  - Setting up test data before a UI test
 *  - Validating that a UI action triggered the correct API call
 *  - Cleaning up test data after a test
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { APIRequestContext, expect } from '@playwright/test';
import { ENV } from '../config/env.config';

export class ApiHelper {
  private baseUrl: string;

  constructor(private request: APIRequestContext) {
    this.baseUrl = ENV.API_BASE_URL;
  }

  /**
   * Perform a GET request and return the parsed JSON body.
   * Asserts that the response status is 200 by default.
   *
   * @param endpoint      - API path (e.g. '/orders')
   * @param expectedStatus - Expected HTTP status code (default: 200)
   */
  async get<T = unknown>(endpoint: string, expectedStatus = 200): Promise<T> {
    const response = await this.request.get(`${this.baseUrl}${endpoint}`);
    expect(response.status()).toBe(expectedStatus);
    return response.json() as Promise<T>;
  }

  /**
   * Perform a POST request and return the parsed JSON body.
   *
   * @param endpoint      - API path
   * @param body          - Request body (will be JSON-serialised)
   * @param expectedStatus - Expected HTTP status code (default: 201)
   */
  async post<T = unknown>(
    endpoint: string,
    body: Record<string, unknown>,
    expectedStatus = 201,
  ): Promise<T> {
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: body,
    });
    expect(response.status()).toBe(expectedStatus);
    return response.json() as Promise<T>;
  }

  /**
   * Perform a PUT request and return the parsed JSON body.
   */
  async put<T = unknown>(
    endpoint: string,
    body: Record<string, unknown>,
    expectedStatus = 200,
  ): Promise<T> {
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      data: body,
    });
    expect(response.status()).toBe(expectedStatus);
    return response.json() as Promise<T>;
  }

  /**
   * Perform a DELETE request.
   */
  async delete(endpoint: string, expectedStatus = 200): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`);
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Assert that a response body contains a specific key with the expected value.
   *
   * @example
   * const body = await apiHelper.get('/orders/123');
   * apiHelper.expectField(body, 'status', 'completed');
   */
  expectField(
    body: Record<string, unknown>,
    key: string,
    expectedValue: unknown,
  ): void {
    expect(body[key]).toBe(expectedValue);
  }

  /**
   * Assert that a response array has at least one item.
   */
  expectNonEmptyArray(body: unknown[]): void {
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  }
}
