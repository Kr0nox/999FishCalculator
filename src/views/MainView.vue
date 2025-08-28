<template>
  <div class="grid gap-5 md:grid-cols-[3fr_1fr]">
    <SelectorContainer class="col-start-1 row-start-1 w-full md:min-h-full" />
    <div
      class="row-start-2 flex flex-col gap-5 md:row-start-1 md:h-full md:max-h-full md:overflow-hidden"
    >
      <FishContainer class="w-fill top col-start-2" :fish="mainStore().results"></FishContainer>
      <ChestContainer class="w-fill bottom h-fit max-h-1/2" :fish="mainStore().results" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mainStore } from '../store'
import FishContainer from '../components/results/FishContainer.vue'
import SelectorContainer from '../components/selectors/SelectorContainer.vue'
import ChestContainer from '../components/results/ChestContainer.vue'
</script>

<style scoped>
@media (width >= 48rem) {
  .top {
    flex: 1 1 auto;
  }

  .bottom {
    flex: 0 0 auto;
  }
}
</style>
