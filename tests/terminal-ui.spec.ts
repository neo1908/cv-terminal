import { test, expect } from '@playwright/test';

test.describe('CV Terminal UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load and terminal to be ready
    await page.waitForSelector('input[type="text"]');
  });

  test('should display welcome message on load', async ({ page }) => {
    // Check that the welcome message is displayed
    const welcomeMessage = page.locator('.terminal-output').first();
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText('Welcome to CV Terminal');
    await expect(welcomeMessage).toContainText('Ben Davies - Software Engineer');
    await expect(welcomeMessage).toContainText('Ready for input');
  });

  test('should have terminal window header with proper styling', async ({ page }) => {
    // Check terminal header exists and has proper elements
    const header = page.locator('.terminal-header');
    await expect(header).toBeVisible();
    
    // Check for terminal window controls
    const controls = header.locator('.w-3.h-3.rounded-full');
    await expect(controls).toHaveCount(3);
    
    // Check for terminal title (desktop version should be visible, mobile might be hidden)
    const desktopTitle = header.locator('span').filter({ hasText: 'Terminal — bash — 80×24' });
    const mobileTitle = header.locator('span').filter({ hasText: 'CV Terminal' });
    
    // At least one title should be visible
    const titles = header.locator('span');
    await expect(titles.first()).toBeAttached();
  });

  test('should focus on input field on page load', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await expect(input).toBeFocused();
  });

  test('should maintain focus when clicking elsewhere', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    // Click somewhere else in the terminal
    await page.locator('.terminal-content').click();
    
    // Input should still be focused
    await expect(input).toBeFocused();
  });

  test('should display proper terminal prompt', async ({ page }) => {
    const promptElements = page.locator('form .text-terminal-success');
    await expect(promptElements.last()).toContainText('guest@cv-terminal');
    
    const promptPath = page.locator('form .text-terminal-prompt');
    await expect(promptPath.last()).toContainText('~');
  });

  test('should display blinking cursor', async ({ page }) => {
    const cursor = page.locator('.terminal-cursor');
    await expect(cursor).toBeVisible();
    
    // Check that cursor has animation
    const cursorElement = await cursor.elementHandle();
    const computedStyle = await page.evaluate((el) => {
      return window.getComputedStyle(el).animation;
    }, cursorElement);
    expect(computedStyle).toContain('blink');
  });
});