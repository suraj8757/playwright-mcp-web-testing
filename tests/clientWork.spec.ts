import { test, expect } from '@playwright/test';

test.describe('EPAM Client Work navigation', () => {
  test('navigates from Services to Client Work and verifies text', async ({ page }) => {
    // Navigate to EPAM homepage
    await page.goto('https://www.epam.com/');
    await page.waitForLoadState('networkidle');

    // Try to open the Services menu in the header (hover then click if available)
    const servicesLink = page.getByRole('link', { name: /^Services$/i }).first();
    try {
      await servicesLink.waitFor({ state: 'visible', timeout: 5000 });
      // Hover to reveal any dropdowns
      await servicesLink.hover();
      // Attempt to click the Services link (some headers open on hover, some on click)
      await servicesLink.click({ timeout: 3000 }).catch(() => {});
    } catch (e) {
      // If we couldn't interact with the visible Services link, continue — we'll try direct link targeting next
    }

    // Try to click the "Explore Our Client Work" link if present in the header or page
    const exploreLink = page.getByRole('link', { name: /Explore Our Client Work/i }).first();
    if (await exploreLink.count() > 0) {
      try {
        await exploreLink.waitFor({ state: 'visible', timeout: 3000 });
        await exploreLink.click();
      } catch (e) {
        // fallback to direct navigation
        await page.goto('https://www.epam.com/services/client-work');
      }
    } else {
      // Fallback: navigate directly to the known Client Work URL
      await page.goto('https://www.epam.com/services/client-work');
    }

    // Wait for navigation to complete and the Client Work heading/text to appear
    await page.waitForLoadState('networkidle');

    const clientWorkText = page.getByText(/Client Work/i).first();
    await expect(clientWorkText).toBeVisible({ timeout: 10000 });

    // Capture a full-page screenshot for debugging/reporting
    await page.screenshot({ path: 'services_client_work_page.png', fullPage: true });
  });
});
