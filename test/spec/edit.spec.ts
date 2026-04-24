import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';
import { FILE } from '../fixtures';

const ELEMENT_ID = 'test-file-edit';
const FILE_URL = 'https://example.com/test.txt';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('When file is not set', () => {
  test('Shows placeholder', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.placeholder).toBeVisible();
    await expect(edit.downloadBtn).not.toBeVisible();
  });

  test('Can upload a file', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.open();
    await edit.fileInput.upload(FILE);
    await expect(edit.downloadBtn).toBeVisible();
    await expect(edit.fileInput.removeBtn).toBeVisible();
  });

  test('Can import a file via URL', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.open();
    await edit.fileInput.importUrl(FILE_URL);
    await expect(edit.downloadBtn).toBeVisible();
  });

  test('Returns to empty state after upload and delete', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.open();
    await edit.fileInput.upload(FILE);
    await expect(edit.downloadBtn).toBeVisible();
    await edit.fileInput.remove();
    await expect(edit.downloadBtn).not.toBeVisible();
    await expect(edit.placeholder).toBeVisible();
  });
});

test.describe('When file is set', () => {
  test.beforeEach(async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      url: FILE_URL,
      name: 'test.txt',
      assets: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Shows download button', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.downloadBtn).toBeVisible();
    await expect(edit.placeholder).not.toBeVisible();
  });

  test('Can set a custom label', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fillLabel('My document');
    await expect(edit.downloadBtn).toContainText('My document');
    await page.reload({ waitUntil: 'networkidle' });
    await edit.focus();
    await expect(edit.labelInput).toHaveValue('My document');
  });
});

test.describe('Readonly mode', () => {
  test('Hides upload prompt when empty', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await edit.focus();
    await expect(edit.placeholder).toBeVisible();
    await expect(
      edit.el.getByText('Use toolbar to upload the file'),
    ).not.toBeVisible();
  });

  test('Keeps download button visible when set', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, {
      url: FILE_URL,
      name: 'test.txt',
      assets: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.downloadBtn).toBeVisible();
  });
});
