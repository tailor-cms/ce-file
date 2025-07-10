<template>
  <div class="tce-file-root">
    <VBtn color="primary-darken-2" variant="tonal" @click="downloadFile">
      <VIcon icon="mdi-file-download" start />
      {{ label }}
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Element } from '@tailor-cms/ce-file-manifest';

const props = defineProps<{ element: Element; userState: any }>();

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
};
</script>

<style scoped>
.tce-file-root {
  background-color: transparent;
  margin: 1rem;
  padding: 1.5rem;
  text-align: center;
}
</style>
