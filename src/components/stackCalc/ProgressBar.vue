<template>
  <div
    class="grid grid-cols-1 grid-rows-1 items-center rounded border-2 border-slate-400 bg-slate-200 text-center"
  >
    <span class="z-10 col-start-1 row-start-1">{{ text }}</span>
    <div
      class="col-start-1 row-start-1 h-full"
      :style="{ width: `${percentage * 100}%`, background: color }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: false,
    default: ''
  },
  color: {
    type: String,
    required: false,
    default: 'lime'
  },
  percentage: {
    type: Number,
    required: true
  }
})
</script>
