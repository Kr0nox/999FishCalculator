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
      {{ primaryInformationText
      }}{{ secondaryInformationText ? ` | ${secondaryInformationText}` : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import { extractCalcFishId } from '@/fishcalc/lib/fishdata'
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
  },
  chanceForFish: {
    type: Number,
    required: true
  }
})

const normalPrimaryInformationText = computed(() => {
  if (props.timePerCatch === undefined) {
    return 'Fish will not be caught'
  }
  return `${props.timePerCatch.toFixed(2)} s/Fish`
})

const normalSecondaryInformationText = computed(() => {
  if (props.timePerCatch === undefined) {
    return undefined
  }
  const totalTime = props.timePerCatch * 999
  const timeInHours = (totalTime / 3600).toFixed(2)
  return `${timeInHours} h/Stack`
})

const chanceOutOfFishes = computed(() => props.fish.finalChance / props.chanceForFish)
const perBlessingDay = computed(() => {
  let baseExpectedPerCast = chanceOutOfFishes.value
  if (store().bait.name == 'Challenge') {
    const catchAmount = store().getChallengeBaitCatchAmount(props.fish.Id)
    baseExpectedPerCast *= catchAmount
  }
  if (store().bait.name == 'Wild') {
    const chanceForDouble = 0.25 + store().dailyLuck / 2.0
    const catchAmount = 1 * (1 - chanceForDouble) + 2 * chanceForDouble
    baseExpectedPerCast *= catchAmount
  }

  return baseExpectedPerCast * 3
})
const blessingPrimaryInfo = computed(() =>
  extractCalcFishId(props.fish.Id) !== undefined
    ? `${perBlessingDay.value.toFixed(2)} / blessing`
    : 'Not effected by blessing'
)
const blessingSecondaryInfo = computed(() =>
  extractCalcFishId(props.fish.Id) !== undefined
    ? `${(999 / perBlessingDay.value).toFixed(2)} blessings/stack`
    : undefined
)

const primaryInformationText = computed(() =>
  store().blessingMode ? blessingPrimaryInfo.value : normalPrimaryInformationText.value
)
const secondaryInformationText = computed(() =>
  store().blessingMode ? blessingSecondaryInfo.value : normalSecondaryInformationText.value
)
</script>
