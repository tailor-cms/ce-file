<template>
  <div class="tce-file text-left">
    <TailorElementPlaceholder
      v-if="!element.data.url && isReadonly"
      :name="`${manifest.name} component`"
      icon="mdi-file-upload"
      is-readonly
    />
    <TailorFileInput
      v-else
      :allowed-extensions="EXTENSIONS"
      :file-key="element.data.assets?.url || element.data.url"
      :file-name="element.data.name || undefined"
      :public-url="element.data.url"
      :readonly="isReadonly"
      :show-actions="isFocused"
      mode="dropzone"
      allow-url-source
      @delete="onDelete"
      @input="save"
      @upload="save"
    >
      <div class="text-center my-3">
        <VBtn
          color="secondary"
          prepend-icon="mdi-download"
          size="large"
          variant="tonal"
          @click="downloadFile"
        >
          {{ element.data.label || 'Download file' }}
        </VBtn>
      </div>
    </TailorFileInput>
  </div>
</template>

<script lang="ts" setup>
import type { Element, ElementData } from '@tailor-cms/ce-file-manifest';
import manifest from '@tailor-cms/ce-file-manifest';

const EXTENSIONS: string[] = [];

const props = defineProps<{
  element: Element;
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const downloadFile = async () => {
  const { element } = props;
  const { url } = element.data || {};
  if (!url) return;
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  const filename = element.data.name || element.data.label || 'untitled';
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const save = (payload: Record<string, any> | null) => {
  if (!payload) return;
  const { url, publicUrl, name } = payload;
  const assets = { url };
  emit('save', {
    ...props.element.data,
    url: publicUrl ?? url,
    name: name || null,
    assets,
  });
};

const onDelete = () => {
  emit('save', { ...props.element.data, url: null, name: null, assets: {} });
};
</script>
