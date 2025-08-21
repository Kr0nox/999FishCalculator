<template>
  <input v-model="inputModel" :disabled="disabled" type="text" class="w-8 bg-white border border-slate-400 rounded px-1 py-0 text-sm" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const model = defineModel<number>({
  default: 0
})

const inputModel = computed({
  get: () => model.value.toString(),
  set: (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      model.value = parsedValue;
    } else {
      model.value = 0; // Reset to 0 if the input is invalid
    }
  }
})
</script>