<template>
  <div>
    <VTextField
      v-model="label"
      label="Label"
      placeholder="Enter download button label..."
      variant="outlined"
      @update:focused="onFocusChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { Element } from '@tailor-cms/ce-file-manifest';
import { ref } from 'vue';

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const label = ref(props.element.data.label || '');

const onFocusChange = (focused: boolean) => {
  if (focused) return;
  emit('save', {
    ...props.element.data,
    label: label.value,
  });
};
</script>

<style scoped></style>
