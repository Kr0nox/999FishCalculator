<template>
  <input
    v-model="inputModel"
    :disabled="disabled"
    type="text"
    class="w-8 rounded border border-slate-400 bg-white px-1 py-0 text-sm"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: Number,
    default: 0
  }
})

const model = defineModel<number>({
  default: 0
})

const inputModel = computed({
  get: () => model.value.toString(),
  set: (value: string) => {
    const parsedValue = parseFloat(value)
    if (!isNaN(parsedValue)) {
      model.value = parsedValue
    } else {
      model.value = props.defaultValue // Reset to default if the input is invalid
    }
  }
})
</script>
