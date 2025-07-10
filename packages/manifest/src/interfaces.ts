import type * as common from '@tailor-cms/cek-common';

export interface ElementData extends common.ElementConfig {
  url: string | null;
  name: string | null;
  label: string | null;
  assets: { url?: string };
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
