<template>
  <div
    class="grid h-screen min-h-screen w-screen grid-cols-[3fr_1fr] grid-rows-[1fr_auto] gap-x-5 gap-y-3 bg-slate-700 p-5 pb-2 md:overflow-hidden"
  >
    <SelectorContainer class="col-start-1 row-start-1 min-h-full w-full" />
    <div class="flex flex-col gap-5  md:max-h-full md:overflow-hidden">
      <FishContainer class="w-fill col-start-2 top" :fish="results"></FishContainer>
      <ChestContainer class="w-fill h-fit max-h-1/2 bottom" :fish="results" />
    </div>
    <div class="text-white text-xs col-span-2 row-start-2">
      Writen by <a href="https://www.github.com/Kr0nox">Kronox</a> This tool is heavily inspired by <a href="https://brokencygnus.github.io/stardew-fishing-calc/home">brokencygnus Fishing Calculator</a>. Many of the graphics used are owned by <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getChances } from './fishcalc'
import { store } from './store'
import FishContainer from './components/results/FishContainer.vue'
import SelectorContainer from './components/selectors/SelectorContainer.vue'
import ChestContainer from './components/results/ChestContainer.vue'

const results = computed(() => getChances(store().calculatorConfiguration))
</script>

<style scoped>
@reference "./style.css";

a {
  @apply underline text-blue-400;
}

a:visited {
  @apply text-purple-500;
}

.top {
  flex: 1 1 auto;
}

.bottom {
  flex: 0 0 auto;
}
</style>