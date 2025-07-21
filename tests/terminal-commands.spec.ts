import { test, expect } from '@playwright/test';

test.describe('CV Terminal Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('input[type="text"]');
  });

  // Helper function to execute a command and wait for response
  async function executeCommand(page: any, command: string) {
    const input = page.locator('input[type="text"]');
    await input.fill(command);
    await input.press('Enter');
    
    // Wait for the command to process and output to appear
    await page.waitForTimeout(1000);
  }

  test('help command should display all available commands', async ({ page }) => {
    await executeCommand(page, 'help');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('AVAILABLE COMMANDS');
    
    // Check that all commands are listed
    const commands = ['info', 'work', 'education', 'skills', 'projects', 'languages', 'interests', 'contact', 'cache', 'clear', 'whoami', 'help'];
    
    for (const cmd of commands) {
      await expect(output).toContainText(cmd);
    }
  });

  test('info command should display personal information', async ({ page }) => {
    await executeCommand(page, 'info');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('PERSONAL INFORMATION');
    await expect(output).toContainText('Ben Davies');
    await expect(output).toContainText('PROFESSIONAL SUMMARY');
  });

  test('work command should display work experience', async ({ page }) => {
    await executeCommand(page, 'work');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('WORK EXPERIENCE');
    
    // Should contain company and position information
    await expect(output).toContainText('bet365');
    await expect(output).toContainText('Senior Software Developer');
  });

  test('education command should display educational background', async ({ page }) => {
    await executeCommand(page, 'education');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Education');
    await expect(output).toContainText('Trinity Sixth Form');
  });

  test('skills command should display technical skills', async ({ page }) => {
    await executeCommand(page, 'skills');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Technical Skills');
    await expect(output).toContainText('Backend Development');
    await expect(output).toContainText('Java');
  });

  test('projects command should display project portfolio', async ({ page }) => {
    await executeCommand(page, 'projects');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Projects');
    await expect(output).toContainText('SSH Sentinel');
  });

  test('languages command should display language proficiencies', async ({ page }) => {
    await executeCommand(page, 'languages');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Languages');
    await expect(output).toContainText('English');
  });

  test('interests command should display personal interests', async ({ page }) => {
    await executeCommand(page, 'interests');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Personal Interests');
    await expect(output).toContainText('Travelling');
  });

  test('contact command should display contact information', async ({ page }) => {
    await executeCommand(page, 'contact');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Contact Information');
    await expect(output).toContainText('ben@st2projects.com');
    await expect(output).toContainText('Social Profiles');
  });

  test('cache command should display cache status', async ({ page }) => {
    await executeCommand(page, 'cache');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Cache Status');
    await expect(output).toContainText('TTL');
  });

  test('whoami command should display user information', async ({ page }) => {
    await executeCommand(page, 'whoami');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Ben Davies');
    await expect(output).toContainText('Senior Software Engineer');
  });

  test('clear command should clear terminal history', async ({ page }) => {
    // First execute a command to have some history
    await executeCommand(page, 'help');
    
    // Verify there's output
    let outputs = page.locator('.terminal-output');
    await expect(outputs).not.toHaveCount(0);
    
    // Execute clear command
    await executeCommand(page, 'clear');
    
    // Verify history is cleared (only input prompt should remain)
    outputs = page.locator('.terminal-output');
    await expect(outputs).toHaveCount(0);
  });

  test('invalid command should show error message', async ({ page }) => {
    await executeCommand(page, 'invalidcommand');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('Command not found');
    await expect(output).toContainText('invalidcommand');
    await expect(output).toContainText("Type 'help' for available commands");
  });

  test('commands should be case-insensitive', async ({ page }) => {
    await executeCommand(page, 'HELP');
    
    const output = page.locator('.terminal-output').last();
    await expect(output).toBeVisible();
    await expect(output).toContainText('AVAILABLE COMMANDS');
  });

  test('should maintain command history in terminal output', async ({ page }) => {
    // Execute multiple commands
    await executeCommand(page, 'help');
    await executeCommand(page, 'info');
    
    // Verify both commands and their outputs are visible
    const helpOutput = page.locator('.terminal-output').filter({ hasText: 'AVAILABLE COMMANDS' });
    const infoOutput = page.locator('.terminal-output').filter({ hasText: 'PERSONAL INFORMATION' });
    
    await expect(helpOutput).toBeVisible();
    await expect(infoOutput).toBeVisible();
    
    // Check command prompts are shown
    const commandLines = page.locator('.terminal-line').filter({ hasText: 'help' });
    await expect(commandLines).toBeVisible();
  });

  test('should handle rapid command execution', async ({ page }) => {
    // Execute commands quickly
    const commands = ['help', 'info', 'skills'];
    
    for (const cmd of commands) {
      const input = page.locator('input[type="text"]');
      await input.fill(cmd);
      await input.press('Enter');
      await page.waitForTimeout(100); // Small delay between commands
    }
    
    // Wait for all commands to process
    await page.waitForTimeout(2000);
    
    // Verify all outputs are present
    await expect(page.locator('.terminal-output').filter({ hasText: 'AVAILABLE COMMANDS' })).toBeVisible();
    await expect(page.locator('.terminal-output').filter({ hasText: 'PERSONAL INFORMATION' })).toBeVisible();
    await expect(page.locator('.terminal-output').filter({ hasText: 'Technical Skills' })).toBeVisible();
  });
});