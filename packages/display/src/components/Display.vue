<template>
  <div class="tce-file-root">
    <VBtn
      :color="downloaded ? 'success' : 'primary'"
      :prepend-icon="downloaded ? 'mdi-check' : 'mdi-file-download'"
      variant="tonal"
      @click="downloadFile"
    >
      {{ label }}
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Element } from '@tailor-cms/ce-file-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits<{ interaction: [data: { downloadedAt: number }] }>();

const downloaded = computed(() => Boolean(props.userState?.downloadedAt));

const label = computed(() => {
  const { data } = props.element;
  return data.label || 'Download file';
});

const downloadFile = async () => {
  const { data } = props.element;
  const { url } = data;
  if (!url) return;
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  const filename = data.name || data.label || 'untitled';
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  emit('interaction', { downloadedAt: Date.now() });
};
</script>

<style scoped>
.tce-file-root {
  background: transparent;
  margin: 1rem;
  padding: 1.5rem;
  text-align: center;
}
</style>
