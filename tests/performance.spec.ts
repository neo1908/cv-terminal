import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load the page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should execute commands quickly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    const startTime = Date.now();
    
    // Execute help command
    await page.fill('input[type="text"]', 'help');
    await page.press('input[type="text"]', 'Enter');
    
    // Wait for output to appear
    await page.waitForSelector('.terminal-output:last-child', { timeout: 5000 });
    
    const responseTime = Date.now() - startTime;
    
    // Command should execute within 2 seconds
    expect(responseTime).toBeLessThan(2000);
  });

  test('should handle multiple rapid commands efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    const commands = ['help', 'info', 'skills', 'work', 'projects'];
    const startTime = Date.now();
    
    // Execute commands rapidly
    for (const cmd of commands) {
      await page.fill('input[type="text"]', cmd);
      await page.press('input[type="text"]', 'Enter');
      await page.waitForTimeout(50); // Small delay between commands
    }
    
    // Wait for all commands to complete
    await page.waitForTimeout(3000);
    
    const totalTime = Date.now() - startTime;
    
    // All commands should complete within 6 seconds
    expect(totalTime).toBeLessThan(6000);
    
    // Verify all outputs are present
    const outputs = page.locator('.terminal-output');
    const outputCount = await outputs.count();
    expect(outputCount).toBeGreaterThanOrEqual(5); // At least 5 command outputs
  });

  test('should maintain performance with long terminal history', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    // Build up terminal history
    const commands = ['help', 'info', 'work', 'skills', 'projects', 'languages', 'interests', 'contact'];
    
    for (const cmd of commands) {
      await page.fill('input[type="text"]', cmd);
      await page.press('input[type="text"]', 'Enter');
      await page.waitForTimeout(100);
    }
    
    // Test performance of additional command after building history
    const startTime = Date.now();
    
    await page.fill('input[type="text"]', 'cache');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForSelector('.terminal-output:last-child');
    
    const responseTime = Date.now() - startTime;
    
    // Should still be responsive even with long history
    expect(responseTime).toBeLessThan(2000);
  });

  test('should scroll efficiently with large outputs', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    // Execute commands that produce large outputs
    const commands = ['help', 'work', 'projects', 'skills'];
    
    for (const cmd of commands) {
      await page.fill('input[type="text"]', cmd);
      await page.press('input[type="text"]', 'Enter');
      await page.waitForTimeout(200);
    }
    
    // Check that terminal auto-scrolls to bottom
    const terminalContent = page.locator('.terminal-content > div').first();
    const isScrolledToBottom = await terminalContent.evaluate((el) => {
      return el.scrollHeight - el.scrollTop === el.clientHeight;
    });
    
    // Should be scrolled to bottom to show latest content
    expect(isScrolledToBottom).toBe(true);
  });

  test('should handle clear command efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    // Build up some history
    const commands = ['help', 'info', 'work', 'skills'];
    for (const cmd of commands) {
      await page.fill('input[type="text"]', cmd);
      await page.press('input[type="text"]', 'Enter');
      await page.waitForTimeout(100);
    }
    
    // Verify history exists
    let outputs = page.locator('.terminal-output');
    let outputCount = await outputs.count();
    expect(outputCount).toBeGreaterThan(0);
    
    // Execute clear command
    const startTime = Date.now();
    
    await page.fill('input[type="text"]', 'clear');
    await page.press('input[type="text"]', 'Enter');
    
    await page.waitForTimeout(500);
    
    const clearTime = Date.now() - startTime;
    
    // Clear should be almost instantaneous
    expect(clearTime).toBeLessThan(1000);
    
    // History should be cleared
    outputs = page.locator('.terminal-output');
    outputCount = await outputs.count();
    expect(outputCount).toBe(0);
  });

  test('should handle CV data caching properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    // First call to a command that fetches CV data
    const firstCallStart = Date.now();
    await page.fill('input[type="text"]', 'info');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForSelector('.terminal-output:last-child');
    const firstCallTime = Date.now() - firstCallStart;
    
    // Second call should be faster due to caching
    const secondCallStart = Date.now();
    await page.fill('input[type="text"]', 'work');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForSelector('.terminal-output:last-child');
    const secondCallTime = Date.now() - secondCallStart;
    
    // Both should complete in reasonable time
    expect(firstCallTime).toBeLessThan(3000);
    expect(secondCallTime).toBeLessThan(2000);
    
    // Check cache status
    await page.fill('input[type="text"]', 'cache');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForSelector('.terminal-output:last-child');
    
    const cacheOutput = page.locator('.terminal-output').last();
    await expect(cacheOutput).toContainText('Cache Status');
    await expect(cacheOutput).toContainText('Cached');
  });

  test('should maintain responsive UI during data loading', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    // Start a command that might take time
    await page.fill('input[type="text"]', 'projects');
    await page.press('input[type="text"]', 'Enter');
    
    // UI should remain responsive during loading
    const input = page.locator('input[type="text"]');
    
    // Input should be disabled during loading
    const isDisabled = await input.isDisabled();
    
    // Wait for command to complete
    await page.waitForSelector('.terminal-output:last-child');
    
    // Input should be re-enabled and focused after command completes
    await expect(input).not.toBeDisabled();
    await expect(input).toBeFocused();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // This test simulates network issues
    await page.route('**/cv.json', route => {
      route.abort();
    });
    
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
    
    const startTime = Date.now();
    
    // Try to execute a command that requires CV data
    await page.fill('input[type="text"]', 'info');
    await page.press('input[type="text"]', 'Enter');
    
    // Wait for response (error or cached data)
    await page.waitForSelector('.terminal-output:last-child', { timeout: 10000 });
    
    const responseTime = Date.now() - startTime;
    
    // Should handle error within reasonable time
    expect(responseTime).toBeLessThan(5000);
    
    // Should still be able to use the terminal
    const input = page.locator('input[type="text"]');
    await expect(input).toBeFocused();
    await expect(input).not.toBeDisabled();
  });
});