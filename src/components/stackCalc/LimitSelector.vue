<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <LocationSelector v-model="stackCalcStore().location" />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { stackCalcStore } from '@/store'
import LocationSelector from '../selectors/LocationSelector.vue'
import ContainerComponent from '../ContainerComponent.vue'
</script>
