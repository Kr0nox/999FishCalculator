<template>
  <div
    class="grid grid-cols-[auto_1fr_auto] grid-rows-2 items-center gap-x-2 rounded bg-slate-200 px-2 py-1"
  >
    <img
      :src="getFishImage(fish.displayname)"
      class="col-start-1 row-span-2 row-start-1 max-h-12 max-w-12"
    />
    <span class="col-start-2 row-start-1 font-bold">{{ fish.displayname }}</span>
    <span class="col-start-3 row-start-1 font-bold"
      >{{ (fish.finalChance * 100).toFixed(2) }}%</span
    >
    <span class="col-span-2 col-start-2 row-start-2 text-sm">
      {{ infoText.join(' | ') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import { getFishImage } from '@/model/images'
import type { PropType } from 'vue'

defineProps({
  fish: {
    type: Object as PropType<CalculatorResults>,
    required: true
  },
  infoText: {
    type: Array<string>,
    required: true
  }
})
</script>
