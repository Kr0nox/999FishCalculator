<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="grid grid-cols-[1fr_1fr_2fr] grid-rows-[auto_1fr] gap-3 md:overflow-scroll md:max-h-full">
      <div class="flex flex-col gap-3 col-start-1 row-start-1">
        <SeasonSelector />
        <TackleSelector />
        <TacticSelector />
      </div>
      <div class="flex flex-col gap-3 col-start-2 row-start-1">
        <BaitSelector />
        <ModifierOptions />
        <SliderOptions />
      </div>
      <div class="flex flex-col gap-3 col-start-1 col-span-2 row-start-2">
        
      </div>

      <div class="flex flex-col gap-3 col-start-3 row-span-2 row-start-1">
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
