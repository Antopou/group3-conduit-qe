const { test, expect } = require('@playwright/test');

test('E2E-001 User registers and logs in — verify username appears in navbar', async ({ page }) => {
  const user = {
    username: `user${Date.now()}`,
    email: `user${Date.now()}@test.com`,
    password: 'Password123!'
  };

  await page.goto('http://localhost:4100/register');

  await page.fill('input[placeholder="Username"]', user.username);
  await page.fill('input[placeholder="Email"]', user.email);
  await page.fill('input[placeholder="Password"]', user.password);

  await page.click('button[type="submit"]');

  await expect(page.locator('nav')).toContainText(user.username);

  await page.goto('http://localhost:4100/login');

  await page.fill('input[placeholder="Email"]', user.email);
  await page.fill('input[placeholder="Password"]', user.password);

  await page.click('button[type="submit"]');

  await expect(page.locator('nav')).toContainText(user.username);
});

test('E2E-002 User logs in, creates article — verify article appears', async ({ page }) => {
  const user = {
    username: `author${Date.now()}`,
    email: `author${Date.now()}@test.com`,
    password: 'Password123!'
  };

  const articleTitle = `Test Article ${Date.now()}`;
  const articleDescription = 'Article created by Playwright';
  const articleBody = 'This is an automated Playwright test article.';

  // Register
  await page.goto('http://localhost:4100/register');

  await page.fill('input[placeholder="Username"]', user.username);
  await page.fill('input[placeholder="Email"]', user.email);
  await page.fill('input[placeholder="Password"]', user.password);

  await page.click('button[type="submit"]');

  await expect(page.locator('nav')).toContainText(user.username);

  // Create article
  await page.goto('http://localhost:4100/editor');

  await page.fill('input[placeholder="Article Title"]', articleTitle);
  await page.fill(
    'input[placeholder="What\'s this article about?"]',
    articleDescription
  );
  await page.fill('textarea', articleBody);

  await page.click('button:has-text("Publish Article")');

  // Wait for page load
  await page.waitForLoadState('networkidle');

  // Verify article title is displayed
  await expect(page.locator('body')).toContainText(articleTitle);

  // Verify author name appears
  await expect(page.locator('body')).toContainText(user.username);
});