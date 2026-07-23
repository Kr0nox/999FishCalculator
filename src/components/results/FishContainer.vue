<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col md:max-h-full md:overflow-auto">
      <div class="flex w-full gap-2">
        <h1 class="flex-1 text-xl font-bold">Fish</h1>
        <div class="relative">
          <FontAwesomeIcon
            :icon="faGears"
            class="h-1 cursor-pointer"
            @click="(e: Event) => changeSettingsVisibility(e)"
          />
          <div
            v-if="showSettings"
            class="absolute top-7 right-0 grid w-80 grid-cols-[auto_24px_1fr] items-center gap-2 rounded border-2 border-slate-400 bg-white p-2 text-sm font-normal"
            @click="
              (e) => {
                e.stopPropagation()
              }
            "
          >
            <div class="col-span-3 row-start-1 flex items-center gap-1">
              Calculator<SwitchComponent v-model="store().doSimulation" />Simulation
            </div>
            <input v-model="store().blessingMode" type="checkbox" />
            <img
              src="https://stardewvalleywiki.com/mediawiki/images/thumb/4/43/Blessing_Of_Waters.png/54px-Blessing_Of_Waters.png"
            />
            <span>Blessing of Waters</span>
          </div>
        </div>
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

      <FishDisplay
        v-for="f in fish"
        :key="f.Id"
        :fish="f"
        :time-per-catch="getTimePerCatch(f)"
        :chance-for-fish="chanceForFish"
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
import SwitchComponent from '../base/SwitchComponent.vue'
import { extractCalcFishId } from '@/fishcalc/lib/fishdata.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGears } from '@fortawesome/free-solid-svg-icons'

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
  if (extractCalcFishId(fish.Id) === undefined) {
    return time
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

const showSettings = ref(false)
function changeSettingsVisibility(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  showSettings.value = !showSettings.value
}
const chanceForFish = computed(() =>
  props.fish
    .filter((f) => extractCalcFishId(f.Id) !== undefined)
    .map((f) => f.finalChance)
    .reduce((a, b) => a + b, 0)
)
</script>
