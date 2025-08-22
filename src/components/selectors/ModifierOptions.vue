<template>
  <ContainerComponent class="p-2!">
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <input id="rain" v-model="store().raining" type="checkbox" name="rain" />
      <label for="rain">Raining</label>

      <input
        id="extendedFamily"
        v-model="store().extendedFamily"
        type="checkbox"
        name="extendedFamily"
      />
      <label for="extendedFamily">Extended Family</label>

      <input id="troutDerby" v-model="store().troutDerby" type="checkbox" name="troutDerby" />
      <label for="troutDerby">Trout Derby</label>

      <input id="squidFest" v-model="store().squidFest" type="checkbox" name="squidFest" />
      <label for="squidFest">Squid Fest</label>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { store } from '@/store'
import ContainerComponent from '../ContainerComponent.vue'
</script>
