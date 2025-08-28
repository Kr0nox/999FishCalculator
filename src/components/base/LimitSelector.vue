<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <LocationSelector />
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import LocationSelector from '../selectors/LocationSelector.vue'
</script>
