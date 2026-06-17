// tests/setup/auth.spec.js
const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
require('dotenv').config();
test('login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto('https://ares.smarterrisk.app/');
   console.log(process.env.EMAIL);     // DEBUG
  console.log(process.env.PASSWORD); 
  await login.login(process.env.EMAIL, process.env.PASSWORD);

  // ✅ WAIT FOR SUCCESS STATE
  await page.waitForLoadState('networkidle');

  // OR verify dashboard element
  await page.locator('text=Dashboard').waitFor();

  // keep open for debugging (optional)
  await page.pause();
});