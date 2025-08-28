<template>
  <div
    class="grid min-h-screen w-screen gap-y-3 bg-slate-700 p-5 pb-2 md:h-screen md:grid-rows-[1fr_auto] md:overflow-hidden"
  >
    <router-view class="min-h-full w-full" />
    <footer class="row-start-3 text-xs text-white md:row-start-2">
      Writen by
      <a href="https://www.github.com/Kr0nox"><FontAwesomeIcon :icon="faGithub" />Kronox</a>,
      <a href="https://github.com/Kr0nox/999FishCalculator"
        ><FontAwesomeIcon :icon="faGithub" />Source Code</a
      >. This tool is heavily inspired by
      <a href="https://brokencygnus.github.io/stardew-fishing-calc/home"
        >brokencygnus Fishing Calculator</a
      >. Many of the graphics used are owned by
      <a href="https://stardewvalleywiki.com/ConcernedApe">ConcernedApe</a> and imported from the
      <a href="https://stardewvalleywiki.com">Stardew Valley Wiki</a>.
    </footer>
    <header class="absolute top-0 right-0">
      <nav
        :class="{
          'rounded border border-slate-400 bg-white': showNav
        }"
        class="p-1"
      >
        <FontAwesomeIcon
          :icon="faBars"
          class="float-end cursor-pointer"
          :class="showNav ? 'text-black' : 'text-white'"
          @click="showNav = !showNav"
        />
        <div v-if="showNav" class="flex flex-col">
          <RouterLink v-for="route in router.getRoutes()" :key="route.name" :to="route">{{
            route.name
          }}</RouterLink>
        </div>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'
import { router } from './router'
const showNav = ref(false)
router.beforeEach(() => {
  showNav.value = false
})
</script>

<style scoped>
@reference "./style.css";

a {
  @apply text-blue-300 underline;
}

a:visited {
  @apply text-purple-300;
}

nav a {
  @apply text-black no-underline;
}
nav a:visited {
  @apply text-black;
}
</style>
