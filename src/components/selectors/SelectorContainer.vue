<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div
      class="grid grid-cols-1 gap-3 md:max-h-full md:grid-cols-[1fr_1fr_2fr] md:grid-rows-[auto_1fr] md:overflow-scroll"
    >
      <div class="col-start-1 row-start-1 flex flex-col gap-3">
        <SeasonSelector />
        <TackleSelector />
        <TacticSelector />

        <SaveManager />
      </div>
      <div class="flex flex-col gap-3 md:col-start-2 md:row-start-1">
        <BaitSelector />
        <ModifierOptions />
        <SliderOptions />
      </div>
      <div class="flex flex-col gap-3 md:col-span-2 md:col-start-1 md:row-start-2"></div>

      <div class="flex flex-col gap-3 md:col-start-3 md:row-span-2 md:row-start-1">
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
import SaveManager from '../SaveManager.vue'
</script>
