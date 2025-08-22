<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <h1 class="text-xl font-bold">Fish</h1>
      <FishDisplay v-for="f in fish" :key="f.Id" :fish="f" :time-per-catch="getTimePerCatch(f)" />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import ContainerComponent from '../ContainerComponent.vue'
import FishDisplay from './FishDisplay.vue'
import { store } from '@/store'

defineProps({
  fish: {
    type: Array<CalculatorResults>,
    required: true
  }
})

function getTimePerCatch(fish: CalculatorResults): number | undefined {
  const time = store().strategy.calculateTimePerCatch(fish)
  if (time === undefined) {
    return undefined
  }

  if (store().bait.name == 'Challenge') {
    return time / 3
  }
  if (store().bait.name == 'Wild') {
    return time / 1.25
  }
  return time
}
</script>
