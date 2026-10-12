import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';
import { FILE } from '../fixtures';

const ELEMENT_ID = 'test-file-edit';
const FILE_URL = 'https://example.com/test.txt';
const OTHER_FILE_URL = 'https://example.com/other.txt';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('When file is not set', () => {
  test('Shows dropzone as empty state', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.fileInput.dropzone).toBeVisible();
    await expect(edit.placeholder).not.toBeVisible();
    await expect(edit.downloadBtn).not.toBeVisible();
  });

  test('Can import a file via URL', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.openUrlFromDropzone();
    await edit.fileInput.importUrl(FILE_URL);
    await expect(edit.downloadBtn).toBeVisible();
    await expect(edit.fileInput.dropzone).not.toBeVisible();
  });

  test('Can upload a file via dropzone', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.dropzoneUpload(FILE);
    await expect(edit.downloadBtn).toBeVisible();
    await expect(edit.fileInput.dropzone).not.toBeVisible();
    // File row only renders when file-key (assets.url) is set —
    // proves onUpload mapped the storage key, not just publicUrl.
    await edit.fileInput.expectFile('test-file.txt');
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
    await expect(edit.downloadBtn).toContainText('Download file');
    await expect(edit.fileInput.dropzone).not.toBeVisible();
  });

  test.describe('Download name after URL import', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('https://example.com/**', (route) =>
        route.fulfill({ body: 'content', contentType: 'text/plain' }),
      );
    });

    test('Uses the title entered with the URL', async ({ page }) => {
      const edit = new Edit(page);
      await edit.focus();
      await edit.fileInput.replace();
      await edit.fileInput.importUrl(OTHER_FILE_URL, 'syllabus.txt');
      await edit.fileInput.expectFile('syllabus.txt');
      await page.reload({ waitUntil: 'networkidle' });
      const download = page.waitForEvent('download');
      await edit.downloadBtn.click();
      expect((await download).suggestedFilename()).toBe('syllabus.txt');
    });

    test('Falls back to the URL file name without a title', async ({
      page,
    }) => {
      const edit = new Edit(page);
      await edit.focus();
      await edit.fileInput.replace();
      await edit.fileInput.importUrl(OTHER_FILE_URL);
      await edit.fileInput.expectFile('other.txt');
      const download = page.waitForEvent('download');
      await edit.downloadBtn.click();
      expect((await download).suggestedFilename()).toBe('other.txt');
    });
  });

  test('Can remove file', async ({ page }) => {
    const edit = new Edit(page);
    await edit.focus();
    await edit.fileInput.removeFromRow();
    await expect(edit.downloadBtn).not.toBeVisible();
    await expect(edit.fileInput.dropzone).toBeVisible();
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
  test('Shows placeholder instead of dropzone when empty', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.placeholder).toBeVisible();
    await expect(edit.fileInput.dropzone).not.toBeVisible();
  });

  test('Keeps download button visible and hides file actions when set', async ({
    page,
  }) => {
    await elementClient.update(ELEMENT_ID, {
      url: FILE_URL,
      name: 'test.txt',
      assets: {},
    });
    await page.reload({ waitUntil: 'networkidle' });
    const edit = new Edit(page);
    await edit.setReadonly();
    await edit.focus();
    await expect(edit.downloadBtn).toBeVisible();
    await expect(edit.fileInput.replaceBtn).not.toBeVisible();
  });
});
