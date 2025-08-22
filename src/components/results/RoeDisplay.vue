<template>
  <div class="flex items-center gap-x-2">
    <img :src="getFishImage(fish.displayname)" class="col-start-1 row-span-2 row-start-1 h-8" />
    <span class="col-start-2 row-start-1 text-sm">{{
      timePerCatch !== undefined ? text : 'Fish will not be caught'
    }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import { getFishImage } from '@/model/images'
import { store } from '@/store'
import { computed, type PropType } from 'vue'

const props = defineProps({
  fish: {
    type: Object as PropType<CalculatorResults>,
    required: true
  },
  timePerCatch: {
    type: Number,
    default: undefined
  }
})

const timePerChest = computed(() => {
  return (props.timePerCatch ?? 0) / store().chestChance
})

const timePerRoeChest = computed(() => {
  return timePerChest.value * 4
})

const timePerRoe = computed(() => {
  return timePerRoeChest.value / 3.5
})

const timePerStack = computed(() => {
  const timeInSeconds = timePerRoe.value * 999
  return timeInSeconds / 3600
})

const text = computed(
  () =>
    `${Math.round(timePerRoeChest.value)} s/chestWithRoe | ${Math.round(timePerRoe.value)} s/Roe | ${timePerStack.value.toFixed(2)} h/Stack`
)
</script>
