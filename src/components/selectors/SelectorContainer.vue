<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div
      class="grid grid-cols-[1fr_1fr_2fr] grid-rows-[auto_1fr] gap-3 md:max-h-full md:overflow-scroll"
    >
      <div class="col-start-1 row-start-1 flex flex-col gap-3">
        <SeasonSelector />
        <TackleSelector />
        <TacticSelector />
      </div>
      <div class="col-start-2 row-start-1 flex flex-col gap-3">
        <BaitSelector />
        <ModifierOptions />
        <SliderOptions />
      </div>
      <div class="col-span-2 col-start-1 row-start-2 flex flex-col gap-3"></div>

      <div class="col-start-3 row-span-2 row-start-1 flex flex-col gap-3">
        <LocationSelector />
        <TimeSelector />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import BaitSelector from './BaitSelector.vue'
import ContainerComponent from '../ContainerComponent.vue'
import LocationSelector from './LocationSelector.vue'
import ModifierOptions from './ModifierOptions.vue'
import SeasonSelector from './SeasonSelector.vue'
import SliderOptions from './SliderOptions.vue'
import TackleSelector from './TackleSelector.vue'
import TimeSelector from './TimeSelector.vue'
import TacticSelector from './TacticSelector.vue'
</script>
