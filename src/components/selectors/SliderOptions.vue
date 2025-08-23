<template>
  <ContainerComponent class="p-2!">
    <div class="flex flex-col gap-2">
      <SliderComponent
        v-model="depth"
        :min="0"
        :max="4"
        label="Water depth:"
        :display-function="sliderToLvl"
      />
      <SliderComponent v-model="store().fishingLevel" :min="0" :max="19" label="Fishing Level:" />
      <SliderComponent v-model="store().luck" :min="0" :max="13" label="Luck Buffs:" />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SliderComponent from '../base/SliderComponent.vue'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'

const depth = computed({
  get: () => lvlToSlider(store().depth),
  set: (i: number) => (store().depth = sliderToLvl(i))
})

function sliderToLvl(i: number) {
  if (i == 4) return 5
  return i
}

function lvlToSlider(i: number) {
  if (i == 5) return 4
  return i
}
</script>
