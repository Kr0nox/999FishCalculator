<template>
  <ContainerComponent class="p-2!">
    <div class="flex flex-col gap-2">
      <SliderComponent v-model="store().depth" :min="0" :max="5" label="Water depth:" />
      <SliderComponent v-model="store().fishingLevel" :min="0" :max="19" label="Fishing Level:" />
      <SliderComponent v-model="store().luck" :min="0" :max="13" label="Luck Buffs:" />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import SliderComponent from '../base/SliderComponent.vue'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'
</script>
