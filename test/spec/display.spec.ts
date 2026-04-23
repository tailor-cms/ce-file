import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-file-display';
const FILE_URL = 'https://example.com/test.txt';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.route(FILE_URL, (route) =>
    route.fulfill({ status: 200, body: 'test' }),
  );
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Empty state', () => {
  test('Renders placeholder when empty', async ({ page }) => {
    const display = new Display(page);
    await expect(display.placeholder).toBeVisible();
    await expect(display.root).not.toBeVisible();
  });
});

test.describe('When file is set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      url: FILE_URL,
      name: 'test.txt',
      label: 'My document',
      assets: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Renders the download button with the label', async ({ page }) => {
    const display = new Display(page);
    await expect(display.downloadBtn).toBeVisible();
    await expect(display.downloadBtn).toContainText('My document');
  });

  test('Clicking download switches button to downloaded state', async ({
    page,
  }) => {
    const display = new Display(page);
    await expect(display.downloadBtn.locator('.mdi-check')).not.toBeVisible();
    await display.downloadBtn.click();
    await expect(display.downloadBtn.locator('.mdi-check')).toBeVisible();
  });
});

test.describe('Falls back to generic label when none provided', () => {
  test('Shows "Download file"', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      url: FILE_URL,
      name: 'test.txt',
      assets: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.downloadBtn).toContainText('Download file');
  });
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
