<template>
  <div class="flex items-center gap-x-2">
    <div class="grid h-8 w-12 grid-cols-[24px_24px]">
      <img
        src="https://stardewvalleywiki.com/mediawiki/images/5/56/Roe.png"
        class="z-0 col-start-2 row-start-1 h-6"
      />
      <img
        :src="getFishImage(fish.displayname)"
        class="z-10 col-span-2 col-start-1 row-start-1 h-8"
      />
    </div>
    <span class="col-start-2 row-start-1 text-sm">{{
      timePerCatch !== undefined ? text : 'Fish will not be caught'
    }}</span>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import { getFishImage } from '@/model/images'
import { mainStore } from '@/store'
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
  if (mainStore().cancelChests) {
    return props.timePerCatch ?? Infinity
  }
  return (props.timePerCatch ?? Infinity) / mainStore().chestChance
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
