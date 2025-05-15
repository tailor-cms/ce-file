<template>
  <div class="tce-file">
    <ElementPlaceholder
      v-if="!element.data.url"
      :icon="manifest.ui.icon"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
      :name="`${manifest.name} component`"
      active-icon="mdi-arrow-up"
      active-placeholder="Use toolbar to upload the file"
    />
    <div v-else class="text-center">
      <VBtn
        :text="element.data.label"
        color="primary-darken-2"
        prepend-icon="mdi-file-download"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Element } from '@tailor-cms/ce-file-manifest';
import { ElementPlaceholder } from '@tailor-cms/core-components';
import manifest from '@tailor-cms/ce-file-manifest';

defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
}>();
defineEmits(['save']);
</script>

<style lang="scss" scoped>
.tce-file {
  text-align: left;
}
</style>
