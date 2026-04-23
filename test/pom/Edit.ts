import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly placeholder: Locator;
  readonly downloadBtn: Locator;
  readonly labelInput: Locator;
  readonly fileInput: pom.FileInput;

  constructor(page: Page) {
    super(page);
    this.placeholder = this.editor.getByText('File component');
    this.downloadBtn = this.editor.locator('.tce-file').getByRole('button');
    this.labelInput = this.sideToolbar.getByLabel('Label');
    this.fileInput = new pom.FileInput(this.el);
  }

  async fillLabel(text: string) {
    await this.labelInput.fill(text);
    await this.labelInput.press('Tab');
  }
}
