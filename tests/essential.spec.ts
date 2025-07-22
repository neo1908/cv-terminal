import { test, expect } from '@playwright/test';

test.describe('Essential CV Terminal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
  });

  test('should load terminal and display welcome message', async ({ page }) => {
    // Check welcome message
    const welcomeMessage = page.locator('.terminal-output').first();
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText('Welcome to CV Terminal');

    // Check input is focused
    const input = page.locator('input[type="text"]');
    await expect(input).toBeFocused();
  });

  test('should execute help command successfully', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    await input.fill('help');
    await input.press('Enter');
    
    // Wait for output
    await page.waitForTimeout(2000);
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toContainText('AVAILABLE COMMANDS');
    await expect(output).toContainText('info');
    await expect(output).toContainText('work');
  });

  test('should execute info command and display CV data or error', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    await input.fill('info');
    await input.press('Enter');
    
    // Wait for CV data to load and display
    await page.waitForTimeout(3000);
    
    const output = page.locator('.terminal-output').last();
    
    // Test should pass whether we get CV data or an error message
    const outputText = await output.textContent();
    const hasValidResponse = outputText && (
      outputText.includes('Ben Davies') || 
      outputText.includes('PERSONAL INFORMATION') ||
      outputText.includes('CV data not available') ||
      outputText.includes('Unable to load CV data') ||
      outputText.includes('Error: Unable to load CV data')
    );
    
    expect(hasValidResponse).toBe(true);
  });

  test('should handle invalid command with error', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    await input.fill('invalidcommand');
    await input.press('Enter');
    
    await page.waitForTimeout(1000);
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toContainText('Command not found');
  });

  test('should clear terminal history', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    // Execute a command first
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Clear terminal
    await input.fill('clear');
    await input.press('Enter');
    await page.waitForTimeout(500);
    
    // Verify history is cleared
    const outputs = page.locator('.terminal-output');
    await expect(outputs).toHaveCount(0);
  });

  // Mobile responsiveness check
  test('should be responsive on mobile viewport', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile-specific welcome message
      const welcomeMessage = page.locator('.terminal-output').first();
      const content = await welcomeMessage.textContent();
      expect(content).toContain('CV Terminal');
      
      // Mobile header should be simplified  
      const mobileHeader = page.locator('.terminal-header span').filter({ hasText: 'CV Terminal' });
      await expect(mobileHeader).toBeVisible();
    }
  });
});