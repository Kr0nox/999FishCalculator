<template>
  <ContainerComponent class="p-2!">
    <div class="grid grid-cols-2 gap-2">
      <ContainerComponent class="cursor-pointer px-1! py-0!" @click="save()"
        >Copy Configuration</ContainerComponent
      >
      <ContainerComponent class="cursor-pointer px-1! py-0!" @click="clickLoad()"
        >Load</ContainerComponent
      >
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { load, save } from '@/store/serialize'
import ContainerComponent from './ContainerComponent.vue'

function clickLoad() {
  const alert = window.prompt('Enter code')
  if (!alert) return
  load(alert)
}
</script>
