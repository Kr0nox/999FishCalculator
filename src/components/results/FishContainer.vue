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
            <div>
              <div class="px-1 text-xs">Additional info:</div>
              <select
                v-model="resultInfoType"
                class="rounded-md border border-slate-950 bg-slate-200 px-1"
              >
                <option value="default">Default</option>
                <option value="blessing">Blessing of Waters</option>
                <option value="targeted">Targeted Bait Mode</option>
              </select>
            </div>
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
        :info-text="resultInfoBuilder.buildInfo(f)"
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGears } from '@fortawesome/free-solid-svg-icons'
import {
  BlessingResultInfoBuilder,
  DefaultResultInfoBuilder,
  ResultInfoBuilder,
  TargetedBaitAwareInfoBuilder
} from '@/math/ResultInfoBuilder.ts'

const props = defineProps({
  fish: {
    type: Array<CalculatorResults>,
    required: true
  }
})

const iridiumChance = computed(() =>
  getChanceForQuality(Quality.IRIDIUM, store().depth, store().fishingLevel, store().tackles)
)

const showSettings = ref(false)
function changeSettingsVisibility(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  showSettings.value = !showSettings.value
}

const resultInfoType = ref<'default' | 'blessing' | 'targeted'>('default')

const resultInfoBuilder = computed<ResultInfoBuilder>(() => {
  switch (resultInfoType.value) {
    case 'blessing':
      return new BlessingResultInfoBuilder(props.fish)
    case 'targeted': {
      let baitType: string | undefined
      const bait = store().bait
      if (bait.name === 'Targeted') {
        baitType = bait.fish
      }
      return new TargetedBaitAwareInfoBuilder(
        props.fish,
        store().strategy,
        baitType,
        store().preservingEnchant
      )
    }
    case 'default':
    default:
      return new DefaultResultInfoBuilder(props.fish, store().strategy)
  }
})
</script>
