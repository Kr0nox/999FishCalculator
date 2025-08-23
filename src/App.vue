<template>
  <div
    class="grid min-h-screen w-screen gap-y-3 bg-slate-700 p-5 pb-2 md:h-screen md:grid-rows-[1fr_auto] md:overflow-hidden"
  >
    <router-view class="min-h-full w-full" />
    <div class="row-start-3 text-xs text-white md:row-start-2">
      Writen by
      <a href="https://www.github.com/Kr0nox"><FontAwesomeIcon :icon="faGithub" /> Kronox</a>,
      <a href="https://github.com/Kr0nox/999FishCalculator"
        ><FontAwesomeIcon :icon="faGithub" /> Source Code</a
      >. This tool is heavily inspired by
      <a href="https://brokencygnus.github.io/stardew-fishing-calc/home"
        >brokencygnus Fishing Calculator</a
      >. Many of the graphics used are owned by
      <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the
      <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>.
      <RouterLink :to="{ name: 'Math' }">The math behind this</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>

<style scoped>
@reference "./style.css";

a {
  @apply text-blue-400 underline;
}

a:visited {
  @apply text-purple-500;
}
</style>
