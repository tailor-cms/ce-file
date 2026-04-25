<template>
  <div class="tce-file">
    <TailorElementPlaceholder
      v-if="!element.data.url"
      :is-disabled="isReadonly"
      :is-focused="isFocused"
      :name="`${manifest.name} component`"
      active-icon="mdi-arrow-up"
      active-placeholder="Use toolbar to upload the file"
      icon="mdi-file-upload"
    />
    <div v-else class="text-center">
      <VBtn
        color="primary-darken-2"
        prepend-icon="mdi-file-download"
        variant="tonal"
        @click="downloadFile"
      >
        {{ element.data.label || 'Download file' }}
      </VBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Element } from '@tailor-cms/ce-file-manifest';
import manifest from '@tailor-cms/ce-file-manifest';

const props = defineProps<{
  element: Element;
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();

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
</script>

<style lang="scss" scoped>
.tce-file {
  text-align: left;
}
</style>
