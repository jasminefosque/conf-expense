import { test, expect } from '@playwright/test';

test.describe('Conference Expense Planner - Full User Flow', () => {
  test('complete user journey from landing to export', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Conference Expense Command Center');
    
    // 2. Click Get Started
    await page.getByRole('button', { name: /get started/i }).click();
    await page.waitForURL('**/planner');
    
    // 3. Add venue rooms
    await expect(page.locator('h2').filter({ hasText: 'Venue Rooms' })).toBeVisible();
    
    // Add 2 Auditorium Halls
    const auditoriumSection = page.locator('text=Auditorium Hall').locator('..').locator('..');
    await auditoriumSection.getByLabel(/increase auditorium hall/i).click();
    await auditoriumSection.getByLabel(/increase auditorium hall/i).click();
    
    // Add 1 Conference Room
    const conferenceSection = page.locator('text=Conference Room').locator('..').locator('..');
    await conferenceSection.getByLabel(/increase conference room/i).click();
    
    // 4. Add add-ons
    await page.locator('text=Add-ons').first().scrollIntoViewIfNeeded();
    
    // Add 3 Projectors
    const projectorsSection = page.locator('text=Projectors').locator('..').locator('..');
    await projectorsSection.getByLabel(/increase projectors/i).click();
    await projectorsSection.getByLabel(/increase projectors/i).click();
    await projectorsSection.getByLabel(/increase projectors/i).click();
    
    // Add 2 Whiteboards
    const whiteboardsSection = page.locator('text=Whiteboards').locator('..').locator('..');
    await whiteboardsSection.getByLabel(/increase whiteboards/i).click();
    await whiteboardsSection.getByLabel(/increase whiteboards/i).click();
    
    // 5. Select meals
    await page.locator('text=Meals & Catering').scrollIntoViewIfNeeded();
    
    // Enter number of people (100)
    await page.getByLabel(/number of people/i).fill('100');
    
    // Select Breakfast and Lunch
    await page.getByLabel(/select this meal/i).filter({ has: page.locator('text=Breakfast').locator('..') }).first().check();
    await page.locator('text=Lunch').locator('..').getByLabel(/select this meal/i).check();
    
    // 6. Verify summary shows correct totals
    const summary = page.locator('text=Summary').locator('..').locator('..');
    await expect(summary).toContainText(/\$25,960/);  // Expected total before discount
    
    // 7. Apply promo code CATER15
    await page.getByPlaceholder(/enter promo code/i).fill('CATER15');
    await page.getByRole('button', { name: /apply/i }).click();
    
    // Wait for toast notification
    await expect(page.locator('text=Promo code CATER15 applied!')).toBeVisible({ timeout: 5000 });
    
    // 8. Open details modal
    await page.getByRole('button', { name: /show details/i }).click();
    
    // Verify modal is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#modal-title')).toContainText('Event Details');
    
    // Verify line items in table
    await expect(page.getByRole('dialog')).toContainText('Auditorium Hall');
    await expect(page.getByRole('dialog')).toContainText('Conference Room');
    await expect(page.getByRole('dialog')).toContainText('Projectors');
    await expect(page.getByRole('dialog')).toContainText('Whiteboards');
    await expect(page.getByRole('dialog')).toContainText('Breakfast');
    await expect(page.getByRole('dialog')).toContainText('Lunch');
    
    // Verify grand total with discount
    await expect(page.getByRole('dialog')).toContainText('Grand Total');
    
    // 9. Export CSV
    await page.getByRole('button', { name: /export csv/i }).click();
    
    // Wait for download toast
    await expect(page.locator('text=Plan exported as CSV')).toBeVisible({ timeout: 5000 });
    
    // 10. Close modal with Escape key
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // 11. Test Reset functionality
    await page.getByRole('button', { name: /reset/i }).click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Give some time for the reset
    await page.waitForTimeout(500);
    
    // Verify reset was successful - summary should show $0
    await expect(summary).toContainText(/\$0/);
  });

  test('promo code validation works correctly', async ({ page }) => {
    await page.goto('/planner');
    
    // Try invalid promo code
    await page.getByPlaceholder(/enter promo code/i).fill('INVALID');
    await page.getByRole('button', { name: /apply/i }).click();
    
    // Should show error
    await expect(page.locator('text=Invalid promo code')).toBeVisible();
    
    // Try AVBUNDLE5 without meeting condition
    await page.getByPlaceholder(/enter promo code/i).fill('AVBUNDLE5');
    await page.getByRole('button', { name: /apply/i }).click();
    
    // Should show error about condition
    await expect(page.getByText(/Add-ons subtotal must be at least \$500/i)).toBeVisible();
  });
});
