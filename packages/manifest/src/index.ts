import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

export const type = 'FILE';
export const name = 'File';

export const initState: DataInitializer = (): ElementData => ({
  url: null,
  name: null,
  label: null,
  assets: {},
});

export const version = '1.0';

const ui = {
  icon: 'mdi-file',
  forceFullWidth: false,
};

export const isEmpty = (data: ElementData): boolean => !data.url;

const manifest: ElementManifest = {
  type,
  version,
  name,
  ssr: false,
  initState,
  isEmpty,
  ui,
};

export default manifest;
export * from './interfaces';
