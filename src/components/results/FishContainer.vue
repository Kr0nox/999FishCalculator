<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col md:max-h-full md:overflow-auto">
      <h1 class="text-xl font-bold">Fish</h1>
      <div class="mb-2 flex items-center gap-1">
        Calculator<SwitchComponent v-model="store().doSimulation" />Simulation
      </div>
      <div class="flex flex-col text-sm">
        <span>Average Time to Bite: {{ store().timeToBite.toFixed(2) }} seconds</span>
        <span
          >Average Time per Cast:
          {{ store().strategy.calculateTimePerCast().toFixed(2) }} seconds</span
        >
        <span class="flex items-center gap-1"
          ><img src="@/assets/IridiumQuality.png" class="h-3" />Iridium Quality:
          {{ (iridiumChance.nonPerfect * 100).toFixed(2) }}% | With Perfect Catch:
          {{ (iridiumChance.perfect * 100).toFixed(2) }}%</span
        >
      </div>

      <FishDisplay v-for="f in fish" :key="f.Id" :fish="f" :time-per-catch="getTimePerCatch(f)" />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import ContainerComponent from '../ContainerComponent.vue'
import FishDisplay from './FishDisplay.vue'
import { store } from '@/store'
import { computed } from 'vue'
import { Quality } from '@/model'
import { getChanceForQuality } from '@/math/Quality'
import SwitchComponent from '../base/SwitchComponent.vue'

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
    const catchAmount = store().getChallengeBaitCatchAmount(fish.Id)
    if (catchAmount == 0) {
      return undefined
    }
    return time / catchAmount
  }
  if (store().bait.name == 'Wild') {
    const chanceForDouble = 0.25 + store().dailyLuck / 2.0
    const catchAmount = 1 * (1 - chanceForDouble) + 2 * chanceForDouble
    return time / catchAmount
  }
  return time
}

const iridiumChance = computed(() =>
  getChanceForQuality(Quality.IRIDIUM, store().depth, store().fishingLevel, store().tackles)
)
</script>
