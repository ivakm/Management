import { test, expect } from '@playwright/test';

test.describe('Unauthenticated user', () => {
  test('main page loads and redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/');

    // authGuard should redirect to /login
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');

    // Login page must show a recognisable heading or card title
    const heading = page.locator('h1, h2, mat-card-title').filter({
      hasText: /login|sign in/i,
    });
    await expect(heading.first()).toBeVisible();
  });

  test('login page has email and password fields', async ({ page }) => {
    await page.goto('/login');

    // Wait for the page to be fully loaded
    await page.waitForURL('**/login');

    // Email input — covers type="email" and name/placeholder variations
    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[placeholder*="email" i]',
    );
    await expect(emailInput.first()).toBeVisible();

    // Password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput.first()).toBeVisible();

    // Submit button
    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")',
    );
    await expect(submitButton.first()).toBeVisible();
  });
});
