<template>
  <div class="grid grid-cols-[auto_1fr_auto]">
    <label class="col-start-1 row-start-1 text-sm font-bold">{{ label }}</label>
    <span class="col-start-3 row-start-1 text-sm">{{ model }}</span>
    <input
      v-model="model"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="col-span-3 col-start-1 row-start-2"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 10
  },
  step: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ''
  }
})

const model = defineModel<number>({
  default: 0
})
</script>
