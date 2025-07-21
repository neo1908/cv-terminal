import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.describe('Mobile viewport tests', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
    
    test('should display mobile welcome message on small screens', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-output');
      
      const welcomeMessage = page.locator('.terminal-output').first();
      await expect(welcomeMessage).toBeVisible();
      
      // Mobile version should have compact ASCII art
      const content = await welcomeMessage.textContent();
      expect(content).toContain('Welcome to CV Terminal v1.0');
      expect(content).toContain('Ben Davies - Software Engineer');
      
      // Mobile ASCII should be different (more compact)
      expect(content).toContain('██████╗██╗   ██╗');
      expect(content).not.toContain('CV TERMINAL'); // Full desktop ASCII
    });

    test('should have fullscreen terminal on mobile', async ({ page }) => {
      await page.goto('/');
      
      const terminalWindow = page.locator('.terminal-window');
      const boundingBox = await terminalWindow.boundingBox();
      
      // Terminal should take up most of the viewport on mobile
      expect(boundingBox?.height).toBeGreaterThan(600); // Close to viewport height
      expect(boundingBox?.width).toBeGreaterThan(350); // Close to viewport width
    });

    test('should hide detailed header info on mobile', async ({ page }) => {
      await page.goto('/');
      
      // Desktop header text should be hidden
      const desktopHeader = page.locator('.terminal-header span').filter({ hasText: 'Terminal — bash — 80×24' });
      await expect(desktopHeader).toBeHidden();
      
      // Mobile header should be visible
      const mobileHeader = page.locator('.terminal-header span').filter({ hasText: 'CV Terminal' });
      await expect(mobileHeader).toBeVisible();
      
      // Window controls should be hidden on mobile
      const controls = page.locator('.terminal-header').locator('div').last();
      await expect(controls).toBeHidden();
    });

    test('should have proper mobile font sizes', async ({ page }) => {
      await page.goto('/');
      
      const terminalOutput = page.locator('.terminal-output').first();
      const fontSize = await terminalOutput.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Font size should be smaller on mobile (14px or 12px)
      expect(parseInt(fontSize)).toBeLessThanOrEqual(14);
    });

    test('should handle mobile touch interactions', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('input[type="text"]');
      
      const input = page.locator('input[type="text"]');
      
      // Touch the terminal area
      await page.tap('.terminal-content');
      
      // Input should still be focused after touch
      await expect(input).toBeFocused();
    });

    test('should have proper mobile padding and spacing', async ({ page }) => {
      await page.goto('/');
      
      const terminalContent = page.locator('.terminal-content');
      const padding = await terminalContent.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.padding;
      });
      
      // Mobile should have reduced padding
      const paddingValue = parseInt(padding.split('px')[0]);
      expect(paddingValue).toBeLessThanOrEqual(8);
    });
  });

  test.describe('Tablet viewport tests', () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad size
    
    test('should display appropriate layout for tablet', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-output');
      
      const terminalWindow = page.locator('.terminal-window');
      const boundingBox = await terminalWindow.boundingBox();
      
      // Terminal should be responsive but not fullscreen on tablet
      expect(boundingBox?.width).toBeLessThan(768);
      expect(boundingBox?.height).toBeLessThan(1024);
    });
  });

  test.describe('Desktop viewport tests', () => {
    test.use({ viewport: { width: 1280, height: 720 } }); // Desktop size
    
    test('should display desktop welcome message on large screens', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-output');
      
      const welcomeMessage = page.locator('.terminal-output').first();
      const content = await welcomeMessage.textContent();
      
      // Desktop version should have full ASCII art
      expect(content).toContain('Welcome to CV Terminal v1.0');
      expect(content).toContain('Ben Davies - Software Engineer');
      
      // Desktop ASCII should be more elaborate
      expect(content).toContain('CV TERMINAL'); // Full ASCII art
      expect(content).toContain('Interactive CV Terminal - Type');
    });

    test('should show full header information on desktop', async ({ page }) => {
      await page.goto('/');
      
      // Desktop header text should be visible
      const desktopHeader = page.locator('.terminal-header span').filter({ hasText: 'Terminal — bash — 80×24' });
      await expect(desktopHeader).toBeVisible();
      
      // Window controls should be visible on desktop
      const controls = page.locator('.terminal-header').locator('div').last();
      await expect(controls).toBeVisible();
      expect(await controls.textContent()).toContain('◐ ◑ ◒');
    });

    test('should have larger font sizes on desktop', async ({ page }) => {
      await page.goto('/');
      
      const terminalOutput = page.locator('.terminal-output').first();
      const fontSize = await terminalOutput.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Font size should be larger on desktop (16px or similar)
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
    });
  });

  test.describe('Viewport transitions', () => {
    test('should handle viewport size changes gracefully', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('.terminal-output');
      
      // Start with desktop size
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(500);
      
      let terminalWindow = page.locator('.terminal-window');
      let desktopBox = await terminalWindow.boundingBox();
      
      // Switch to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      let mobileBox = await terminalWindow.boundingBox();
      
      // Terminal should adapt to new viewport
      expect(mobileBox?.width).toBeLessThan(desktopBox?.width || 0);
      expect(mobileBox?.height).toBeGreaterThan((desktopBox?.height || 0) * 0.8);
      
      // Input should still be functional after resize
      const input = page.locator('input[type="text"]');
      await expect(input).toBeFocused();
      await input.fill('help');
      await input.press('Enter');
      
      await page.waitForTimeout(1000);
      const output = page.locator('.terminal-output').last();
      await expect(output).toContainText('AVAILABLE COMMANDS');
    });
  });
});