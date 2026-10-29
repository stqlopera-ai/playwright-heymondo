import { test, expect } from '../../fixtures';

test.describe('Flaky Demo', () => {
  // Run only on demand (tagged and excluded from CI). Use: npx playwright test --grep "@flaky"
  test.describe.configure({ mode: 'serial' });

  test('this test is flaky - fails ~50% of the time @flaky', async ({ page }) => {
    await page.goto('/');

    const randomDelay = Math.random() * 3000;
    await page.waitForTimeout(randomDelay);

    const shouldFail = Math.random() > 0.5;
    if (shouldFail) {
      await expect(page.locator('[data-test="nonexistent-element"]')).toBeVisible({ timeout: 2000 });
    } else {
      await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
    }
  });

});
