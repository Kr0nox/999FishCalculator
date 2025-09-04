<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <h1 class="flex items-center text-xl font-bold">
        <span class="flex-1">Fish</span>
        <FontAwesomeIcon
          :icon="faGears"
          class="float-right cursor-pointer text-base font-normal text-slate-600"
          @click="showFishAmountConfigurator = true"
        />
        <FishAmountModifier
          v-if="showFishAmountConfigurator"
          class="text-base font-normal"
          @close="showFishAmountConfigurator = false"
        />
      </h1>
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

      <FishDisplay
        v-for="f in fish"
        :key="f.Id"
        :fish="f"
        :time-per-catch="getTimePerCatch(f)"
        :secondary-information="getSecondaryInformation()"
      />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import ContainerComponent from '../ContainerComponent.vue'
import FishDisplay from './FishDisplay.vue'
import { store } from '@/store'
import { computed, ref } from 'vue'
import { Quality } from '@/model'
import { getChanceForQuality } from '@/math/Quality'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGears } from '@fortawesome/free-solid-svg-icons'
import FishAmountModifier from '../selectors/FishAmountModifier.vue'
import type { SecondaryInfo } from '@/model/SecondaryInformation'

const props = defineProps({
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
    return time / 1.25
  }
  return time
}

const iridiumChance = computed(() =>
  getChanceForQuality(Quality.IRIDIUM, store().depth, store().fishingLevel, store().tackles)
)

const showFishAmountConfigurator = ref(false)

const fishWithLimits = computed(() =>
  props.fish.filter((f) => store().getFishAmounts(f.Id).hasLimit)
)

const maxTimeWithLimit = computed(() => {
  let maxTotalTime = 0
  for (const fish of fishWithLimits.value) {
    const timePerCatch = getTimePerCatch(fish)
    if (timePerCatch === undefined) {
      continue
    }
    const amount = store().getFishAmounts(fish.Id).amount
    const totalTime = timePerCatch * amount
    if (totalTime > maxTotalTime) {
      maxTotalTime = totalTime
    }
  }
  return maxTotalTime
})

function getSecondaryInformation(): SecondaryInfo {
  if (fishWithLimits.value.length > 0) {
    return { kind: 'forTime', time: maxTimeWithLimit.value }
  } else {
    return { kind: 'perStack' }
  }
}
</script>
