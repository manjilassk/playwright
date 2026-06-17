/**
 * random-data.helper.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates random test data using @faker-js/faker.
 *
 * Using random data prevents test pollution — each test run creates unique
 * records so tests don't interfere with each other.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { faker } from '@faker-js/faker';

export class RandomDataHelper {
  /**
   * Generate a random email address.
   * Uses yopmail.com domain so you can check the inbox without signing up.
   */
  static email(): string {
    return `test.${faker.string.alphanumeric(8)}@yopmail.com`;
  }

  /**
   * Generate a random strong password.
   */
  static password(length = 12): string {
    return faker.internet.password({ length, memorable: false });
  }

  /**
   * Generate a random full name.
   */
  static fullName(): string {
    return faker.person.fullName();
  }

  /**
   * Generate a random company name.
   */
  static companyName(): string {
    return faker.company.name();
  }

  /**
   * Generate a random phone number.
   */
  static phone(): string {
    return faker.phone.number();
  }

  /**
   * Generate a random order reference number.
   */
  static orderRef(): string {
    return `ORD-${faker.string.alphanumeric(8).toUpperCase()}`;
  }

  /**
   * Generate a random integer between min and max (inclusive).
   */
  static integer(min = 1, max = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate a random past date as an ISO string.
   */
  static pastDate(): string {
    return faker.date.past().toISOString();
  }

  /**
   * Generate a random future date as an ISO string.
   */
  static futureDate(): string {
    return faker.date.future().toISOString();
  }

  /**
   * Generate a complete random user object.
   * Useful for signup / invite tests.
   */
  static user() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: RandomDataHelper.email(),
      password: RandomDataHelper.password(),
      company: RandomDataHelper.companyName(),
      phone: RandomDataHelper.phone(),
    };
  }

  /**
   * Generate a complete random order object.
   */
  static order() {
    return {
      clientName: RandomDataHelper.fullName(),
      clientEmail: RandomDataHelper.email(),
      companyName: RandomDataHelper.companyName(),
      orderRef: RandomDataHelper.orderRef(),
    };
  }
}
