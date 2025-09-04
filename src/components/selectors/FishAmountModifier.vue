<template>
  <PopUp @close="emit('close')">
    <div class="flex max-h-full flex-col gap-2">
      <div class="class flex items-center gap-2">
        <span>Set goal amounts</span>
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
        <ContainerComponent class="bg-white p-0.5!" @click="store().resetFishAmounts()"
          >Reset</ContainerComponent
        >
      </div>
      <div class="flex flex-1 flex-wrap justify-between gap-2 overflow-y-auto">
        <div
          v-for="fish in displayedFish"
          :key="fish.Id"
          class="grid w-[300px] grid-cols-[auto_24px_1fr_40px_auto] items-center gap-2 rounded bg-slate-300 px-2 py-1"
        >
          <input
            type="checkbox"
            :checked="store().getFishAmounts(fish.Id).hasLimit"
            @input="
              (v) => {
                console.log('asda')
                store().setFishAmounts(fish.Id, {
                  hasLimit: (v.target! as unknown as { checked: boolean }).checked,
                  amount: store().getFishAmounts(fish.Id).amount
                })
              }
            "
          />
          <img :src="getFishImage(fish.displayname)" />
          <span class="flex items-center gap-2">{{ fish.displayname }} </span>
          <NumberInput
            :disabled="!store().getFishAmounts(fish.Id)"
            :model-value="store().getFishAmounts(fish.Id).amount"
            @update:model-value="
              (v) => store().setFishAmounts(fish.Id, { hasLimit: true, amount: v })
            "
          />
          <FontAwesomeIcon
            :icon="faArrowRotateRight"
            class="cursor-pointer text-sm"
            @click="store().setFishAmounts(fish.Id, { amount: 999, hasLimit: false })"
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'

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
</script>
