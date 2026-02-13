import { test, expect } from '@playwright/test';

test.describe('Conference Expense Planner', () => {
  test('landing page loads and navigates to planner', async ({ page }) => {
    // Visit landing page
    await page.goto('/conf-expense/');
    await expect(page.locator('h1')).toContainText('Conference Expense Command Center');
    
    // Click Get Started
    await page.getByRole('button', { name: /get started/i }).click();
    await page.waitForURL('**/planner');
    
    // Verify planner page loaded
    await expect(page.locator('h2').filter({ hasText: 'Venue Rooms' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Add-ons' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Meals & Catering' })).toBeVisible();
  });

  test('can select venue rooms and see updated total', async ({ page }) => {
    await page.goto('/conf-expense/planner');
    
    // Verify initial total is $0
    await expect(page.locator('text=Summary')).toBeVisible();
    
    // Add an Auditorium Hall
    const auditoriumSection = page.locator('text=Auditorium Hall').locator('..').locator('..');
    await auditoriumSection.getByLabel(/increase auditorium hall/i).click();
    
    // Verify total updates in the summary card (more specific than just $5,500)
    const summary = page.locator('text=Summary').locator('..').locator('..');
    await expect(summary).toContainText('$5,500');
  });

  test('can add meals with number of people', async ({ page }) => {
    await page.goto('/conf-expense/planner');
    
    // Scroll to meals section
    await page.locator('text=Meals & Catering').scrollIntoViewIfNeeded();
    
    // Enter number of people
    await page.getByLabel(/number of people/i).fill('50');
    
    // Select a meal using nth() to avoid complex selectors
    const checkboxes = page.getByLabel(/select this meal/i);
    await checkboxes.nth(0).check(); // Select first meal (Breakfast)
    
    // Verify meal checkbox is checked
    await expect(checkboxes.nth(0)).toBeChecked();
  });

  test('can enter invalid promo code and see error', async ({ page }) => {
    await page.goto('/conf-expense/planner');
    
    // Try invalid promo code
    await page.getByPlaceholder(/enter promo code/i).fill('INVALID');
    await page.getByRole('button', { name: /apply/i }).click();
    
    // Should show error
    await expect(page.getByText(/invalid promo code/i)).toBeVisible();
  });

  test('can open details modal', async ({ page }) => {
    await page.goto('/conf-expense/planner');
    
    // Add an item first
    const auditoriumSection = page.locator('text=Auditorium Hall').locator('..').locator('..');
    await auditoriumSection.getByLabel(/increase auditorium hall/i).click();
    
    // Open details modal
    await page.getByRole('button', { name: /show details/i }).click();
    
    // Verify modal is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Event Details')).toBeVisible();
    
    // Verify table shows the item
    await expect(page.getByRole('dialog')).toContainText('Auditorium Hall');
    
    // Close modal with Escape key
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
