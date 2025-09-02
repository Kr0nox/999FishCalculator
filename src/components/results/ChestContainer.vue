<template>
  <ExpandableContainer title="Chests" class="bg-slate-100">
    <div class="flex flex-col gap-2 md:max-h-full md:flex-1 md:overflow-auto">
      <div>Chest chance: {{ (store().chestChance * 100).toFixed(2) }}%</div>
      <div>Time per chest: {{ averageTimePerChest.toFixed(2) }} s/chest</div>
      <RoeDisplay
        v-for="f in baitFish"
        :key="f.Id"
        :fish="f"
        :time-per-catch="getTimePerCatch(f)"
      />
    </div>
  </ExpandableContainer>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import ExpandableContainer from '../ExpandableContainer.vue'
import { store } from '@/store'
import RoeDisplay from './RoeDisplay.vue'
import { BaitableFish, checkIdEquality } from '@/model/Fish'
import { computed } from 'vue'

const props = defineProps({
  fish: {
    type: Array<CalculatorResults>,
    required: true
  }
})

const baitFishNames = computed(() => BaitableFish.map((f) => f.displayname))

const baitFish = computed(() =>
  props.fish.filter((f) => baitFishNames.value.some((n) => f.displayname.startsWith(n)))
)

function getTimePerCatch(fish: CalculatorResults): number | undefined {
  return store().strategy.calculateTimePerCatch(fish)
}

const baitableFishChance = computed(() =>
  store()
    .results.filter((f) => BaitableFish.some((b) => checkIdEquality(f.Id, b.Id)))
    .reduce((a, b) => a + b.finalChance, 0)
)

const averageTimePerChest = computed(() => {
  const timePerCast = store().strategy.calculateTimePerCast()
  return timePerCast / (store().chestChance * baitableFishChance.value)
})
</script>
