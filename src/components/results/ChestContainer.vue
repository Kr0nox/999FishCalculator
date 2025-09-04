<template>
  <ExpandableContainer class="overflow-visible! bg-slate-100">
    <template #title>
      <div class="flex w-full gap-2">
        <span class="flex-1">Chests</span>
        <div class="relative">
          <FontAwesomeIcon
            :icon="faGears"
            class="cursor-pointer text-base font-normal text-slate-600"
            @click="(e: Event) => changeShowItemSelector(e)"
          />
          <div
            v-if="showItemSelector"
            class="absolute right-0 bottom-7 grid w-80 grid-cols-[auto_24px_1fr] items-center gap-2 rounded border-2 border-slate-400 bg-white p-2 text-sm font-normal"
            @click="
              (e) => {
                e.stopPropagation()
              }
            "
          >
            <input v-model="showRoe" type="checkbox" />
            <img
              src="https://stardewvalleywiki.com/mediawiki/images/thumb/5/56/Roe.png/24px-Roe.png"
            />
            <span>Roe</span>

            <input v-model="showBobber" type="checkbox" />
            <img
              src="https://stardewvalleywiki.com/mediawiki/images/thumb/7/70/Golden_Bobber.png/24px-Golden_Bobber.png"
            />
            <span>Golden Bobber</span>

            <input v-model="showTea" type="checkbox" />
            <img
              src="https://stardewvalleywiki.com/mediawiki/images/thumb/6/6c/Stardrop_Tea.png/24px-Stardrop_Tea.png"
            />
            <span>Stardrop Tea</span>

            <input v-model="showCracker" type="checkbox" />
            <img
              src="https://stardewvalleywiki.com/mediawiki/images/thumb/c/c2/Golden_Animal_Cracker.png/24px-Golden_Animal_Cracker.png"
            />
            <span>Golden Animal Cracker</span>
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col gap-2 md:max-h-full md:flex-1 md:overflow-auto">
        <div>Chest chance: {{ (store().chestChance * 100).toFixed(2) }}%</div>
        <div>
          Time per chest: {{ averageTimePerChest.toFixed(2) }} s/chest |
          {{ chestsPerHour.toFixed(2) }} chests/h
        </div>
        <div v-if="showRoe" class="flex flex-col gap-2">
          <RoeDisplay
            v-for="f in baitFish"
            :key="f.Id"
            :fish="f"
            :time-per-catch="getTimePerCatch(f)"
          />
        </div>
        <ChestItemDisplay
          v-if="showBobber"
          src="https://stardewvalleywiki.com/mediawiki/images/thumb/7/70/Golden_Bobber.png/24px-Golden_Bobber.png"
        >
          {{ averageTimePerChest.toFixed(2) }} s/chestWithBobber |
          {{ getStackHourTime(averageTimePerChest).toFixed(2) }} h/stack
        </ChestItemDisplay>

        <ChestItemDisplay
          v-if="showTea"
          src="https://stardewvalleywiki.com/mediawiki/images/thumb/6/6c/Stardrop_Tea.png/24px-Stardrop_Tea.png"
        >
          {{ timePerTea.toFixed(2) }} s/chestWithTea |
          {{ getStackHourTime(timePerTea).toFixed(2) }} h/stack
        </ChestItemDisplay>

        <ChestItemDisplay
          v-if="showCracker"
          src="https://stardewvalleywiki.com/mediawiki/images/thumb/c/c2/Golden_Animal_Cracker.png/24px-Golden_Animal_Cracker.png"
        >
          {{ timePerCracker.toFixed(2) }} s/chestWithCracker |
          {{ getStackHourTime(timePerCracker).toFixed(2) }} h/stack
        </ChestItemDisplay>
      </div>
    </template>
  </ExpandableContainer>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import ExpandableContainer from '../ExpandableContainer.vue'
import { store } from '@/store'
import RoeDisplay from './RoeDisplay.vue'
import { BaitableFish } from '@/model/Fish'
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGears } from '@fortawesome/free-solid-svg-icons'
import ChestItemDisplay from './ChestItemDisplay.vue'

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

const baitableFishChance = computed(() => baitFish.value.reduce((a, b) => a + b.finalChance, 0))

const averageTimePerChest = computed(() => {
  const timePerCast = store().strategy.calculateTimePerCast()
  return timePerCast / (store().chestChance * baitableFishChance.value)
})
const chestsPerHour = computed(() => (1 / averageTimePerChest.value) * 3600)

const showItemSelector = ref(false)

function changeShowItemSelector(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  showItemSelector.value = !showItemSelector.value
}

const showRoe = ref(true)
const showBobber = ref(false)
const showTea = ref(false)
const showCracker = ref(false)

function getStackHourTime(t: number) {
  return (t * 999) / 3600
}

function getChances(normalChance: number, goldenChance: number) {
  const timePerNormalChest = averageTimePerChest.value / normalChance
  const timePerGoldenChest = averageTimePerChest.value / goldenChance
  if (normalChance == 0) {
    return 4 * timePerGoldenChest
  }
  return 0.75 * timePerNormalChest + 0.25 * timePerGoldenChest
}

const timePerTea = computed(() => getChances(0, 0.07))
const timePerCracker = computed(() => getChances(0.07, 0.09))
</script>
