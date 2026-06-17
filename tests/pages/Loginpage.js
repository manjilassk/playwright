class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://ares.smarterrisk.app/');
  }

  async login(email, password) {

    // ✅ DEBUG GUARD (VERY IMPORTANT)
    if (!email || !password) {
      throw new Error(
        `❌ Missing credentials:
EMAIL = ${email}
PASSWORD = ${password}`
      );
    }

    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);

    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click('button:has-text("Login")')
    ]);
  }
}

module.exports = LoginPage;