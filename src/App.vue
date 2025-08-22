<template>
  <div
    class="grid md:h-screen min-h-screen w-screen grid-cols-1 md:grid-cols-[3fr_1fr] md:grid-rows-[1fr_auto] gap-x-5 gap-y-3 bg-slate-700 p-5 pb-2 md:overflow-hidden"
  >
    <SelectorContainer class="col-start-1 row-start-1 md:min-h-full w-full" />
    <div class="row-start-2 md:row-start-1 flex flex-col gap-5 md:max-h-full md:overflow-hidden">
      <FishContainer class="w-fill top col-start-2" :fish="store().results"></FishContainer>
      <ChestContainer class="w-fill bottom h-fit max-h-1/2" :fish="store().results" />
    </div>
    <div class="md:col-span-2 row-start-3 md:row-start-2 text-xs text-white">
      Writen by <a href="https://www.github.com/Kr0nox">Kronox</a> This tool is heavily inspired by
      <a href="https://brokencygnus.github.io/stardew-fishing-calc/home"
        >brokencygnus Fishing Calculator</a
      >. Many of the graphics used are owned by
      <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the
      <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from './store'
import FishContainer from './components/results/FishContainer.vue'
import SelectorContainer from './components/selectors/SelectorContainer.vue'
import ChestContainer from './components/results/ChestContainer.vue'
</script>

<style scoped>
@reference "./style.css";

a {
  @apply text-blue-400 underline;
}

a:visited {
  @apply text-purple-500;
}

@media (width >= 48rem) {
.top {
  flex: 1 1 auto;
}

.bottom {
  flex: 0 0 auto;

}
}
</style>
