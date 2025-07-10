<template>
  <div class="d-flex align-center justify-center">
    <AssetInput
      :extensions="[]"
      :public-url="element.data.url"
      :url="element.data.assets.url"
      class="mx-auto"
      upload-label="Upload file"
      @input="save"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { AssetInput } from '@tailor-cms/core-components';
import { cloneDeep } from 'lodash-es';
import type { Element } from '@tailor-cms/ce-file-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const save = ({
  url,
  publicUrl,
  name,
  size,
}: {
  url: string;
  publicUrl: string;
  name: string;
  size: number;
}) => {
  const payload = Object.assign(cloneDeep(props.element.data), {
    url: publicUrl,
    name,
    size,
    assets: { url },
  });
  emit('save', payload);
};
</script>

<style scoped></style>
