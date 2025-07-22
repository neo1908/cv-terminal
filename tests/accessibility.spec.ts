import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Check for main content area
    const terminalWindow = page.locator('.terminal-window');
    await expect(terminalWindow).toBeVisible();
    
    // Check for form element
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check for input element
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    // Input should be focusable and accept input (may already be focused on load)
    await input.focus();
    
    // Input should accept keyboard input
    await page.keyboard.type('help');
    await expect(input).toHaveValue('help');
    
    // Enter should submit the command
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toContainText('AVAILABLE COMMANDS');
  });

  test('should have proper color contrast', async ({ page }) => {
    const terminalContent = page.locator('.terminal-content');
    const backgroundColor = await terminalContent.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const input = page.locator('input[type="text"]');
    const textColor = await input.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Verify that we have dark background and light text (terminal theme)
    expect(backgroundColor).toContain('0, 0, 0'); // Dark background
    expect(textColor).toContain('0, 255, 0'); // Green text
  });

  test('should handle focus management correctly', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    // Input should be visible and interactable
    await expect(input).toBeVisible();
    await expect(input).not.toBeDisabled();
    
    // Execute a command
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    // Input should still be interactable after command execution
    await expect(input).not.toBeDisabled();
    
    // Input should be cleared and ready for next command
    await expect(input).toHaveValue('');
  });

  test('should support screen reader friendly output', async ({ page }) => {
    // Execute a command
    await page.fill('input[type="text"]', 'info');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForTimeout(1000);
    
    const output = page.locator('.terminal-output').last();
    const outputText = await output.textContent();
    
    // Output should be readable text (not just visual formatting)
    expect(outputText).toContain('Ben Davies');
    expect(outputText).toContain('PERSONAL INFORMATION');
    
    // Text should be properly structured
    expect(outputText?.length).toBeGreaterThan(50);
  });

  test('should handle rapid keyboard input without losing functionality', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    
    // Rapidly type and submit commands
    const commands = ['help', 'clear', 'help'];
    
    for (const cmd of commands) {
      await input.fill(cmd);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
      
      // Input should remain functional
      await expect(input).not.toBeDisabled();
      await expect(input).toHaveValue('');
    }
  });

  test('should maintain accessibility during loading states', async ({ page }) => {
    // Start a command that might take time to load
    await page.fill('input[type="text"]', 'work');
    await page.press('input[type="text"]', 'Enter');
    
    // Check for loading indicator
    const loadingIndicator = page.locator('.typing-animation');
    
    // If loading indicator appears, it should be accessible
    if (await loadingIndicator.isVisible()) {
      const loadingText = await loadingIndicator.textContent();
      expect(loadingText).toContain('Processing');
    }
    
    // Wait for command to complete
    await page.waitForTimeout(2000);
    
    // Input should still be accessible after loading
    const input = page.locator('input[type="text"]');
    await expect(input).not.toBeDisabled();
  });

  test('should provide clear error messages', async ({ page }) => {
    // Execute invalid command
    await page.fill('input[type="text"]', 'invalidcommand');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForTimeout(1000);
    
    const errorOutput = page.locator('.terminal-output').last();
    const errorText = await errorOutput.textContent();
    
    // Error message should be descriptive and helpful
    expect(errorText).toContain('Command not found');
    expect(errorText).toContain('invalidcommand');
    expect(errorText).toContain('help');
    
    // Error styling should be appropriate
    const hasErrorClass = await errorOutput.evaluate((el) => {
      return el.className.includes('text-terminal-error');
    });
    expect(hasErrorClass).toBe(true);
  });

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast by checking if styles are properly defined
    const terminalText = page.locator('.text-terminal-text').first();
    const textShadow = await terminalText.evaluate((el) => {
      return window.getComputedStyle(el).textShadow;
    });
    
    // Terminal text should have glow effect for better visibility
    expect(textShadow).toContain('0px 0px 3px');
  });

  test('should support basic browser zoom', async ({ page }) => {
    // Test with 150% zoom
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => {
      document.body.style.zoom = '1.5';
    });
    
    await page.waitForTimeout(500);
    
    // Terminal should still be functional at higher zoom levels
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    
    // Should still be able to execute commands
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(1000);
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toContainText('AVAILABLE COMMANDS');
  });
});