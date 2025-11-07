<template>
  <div>
    <SliderComponent
      v-model="store().dailyLuck"
      :min="-0.1"
      :max="0.1"
      :step="0.01"
      label="Daily Luck:"
    />
    <div class="flex justify-between">
      <img src="../../assets/LuckWorst.png" class="h-4" />
      <img src="../../assets/LuckNeutral.png" class="h-4" />
      <img src="../../assets/LuckBest.png" class="h-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from '@/store'
import SliderComponent from '../base/SliderComponent.vue'
</script>
