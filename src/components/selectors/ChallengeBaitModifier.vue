<template>
  <PopUp @close="emit('close')">
    <div class="flex max-h-full flex-col gap-2">
      <div class="class flex items-center gap-2">
        <span>Fish per Targeted Bait</span>
        <input
          v-model="searchText"
          type="text"
          placeholder="Type to search..."
          class="w-48 border border-slate-400 bg-white"
        />
        <input
          id="onlyCurrentLocationAndSeason"
          v-model="onlyCurrentLocationAndSeasonBox"
          type="checkbox"
          name="onlyCurrentLocationAndSeason"
        />
        <label for="onlyCurrentLocationAndSeason">Only show fish for location and season</label>
        <ContainerComponent class="bg-white p-0.5!" @click="store().saveChallengeBaitCatchAmounts()"
          >Save settings to disk</ContainerComponent
        >
      </div>
      <div class="flex flex-1 flex-wrap justify-between gap-2 overflow-y-auto">
        <div
          v-for="fish in displayedFish"
          :key="fish.Id"
          class="grid w-[300px] grid-cols-[24px_1fr_32px] items-center gap-2 rounded bg-slate-300 px-2 py-1"
        >
          <img :src="getFishImage(fish.displayname)" />
          <span class="flex items-center gap-2"
            >{{ fish.displayname }}
            <span class="text-sm text-slate-600">{{ getDifficulty(fish.Id) }}</span></span
          >
          <NumberInput
            :model-value="store().getChallengeBaitCatchAmount(fish.Id)"
            @update:model-value="(v) => store().setChallengeBaitCatchAmount(fish.Id, v)"
          />
        </div>
      </div>
    </div>
  </PopUp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PopUp from '../base/PopUp.vue'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'
import { getFishFromLocationAndSeason } from '@/fishcalc/lib/locationdata'
import { BaitableFish, checkIdEquality } from '@/model/Fish'
import type { Fish } from '@/model'
import { getFishImage } from '@/model/images'
import NumberInput from '../base/NumberInput.vue'
import { getFishParameters } from '@/fishcalc/lib/fishdata'
import type { CalcFishKey } from '@/fishcalc/types'

const emit = defineEmits(['close'])

const searchText = ref('')
const onlyCurrentLocationAndSeasonBox = ref(false)
const displayedFish = computed(() => {
  const allFish = onlyCurrentLocationAndSeasonBox.value
    ? _getFishFromLocationAndSeason()
    : BaitableFish
  const uniqueFish = allFish.filter(
    (fish, index, self) => index === self.findIndex((f) => checkIdEquality(f.Id, fish.Id))
  )
  return uniqueFish
    .filter((f) => f.displayname.toLowerCase().includes(searchText.value.toLowerCase()))
    .sort((a, b) => a.displayname.localeCompare(b.displayname))
})
function _getFishFromLocationAndSeason() {
  const fish = getFishFromLocationAndSeason(
    store().calculatorConfiguration.selectedLocation,
    store().calculatorConfiguration.selectedSeason
  )
  return fish
    .map((f) => BaitableFish.find((bf) => checkIdEquality(f.Id, bf.Id)))
    .filter((f) => f) as Fish[]
}

function getDifficulty(id: string) {
  const info = getFishParameters(id as CalcFishKey)
  if (!info) return ''
  return `(${info.difficulty} ${info.type})`
}
</script>
