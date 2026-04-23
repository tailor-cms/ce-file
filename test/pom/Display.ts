import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly downloadBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-file-root');
    this.downloadBtn = this.root.locator('button');
  }
}
