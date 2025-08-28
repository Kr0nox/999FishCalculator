<template>
  <ContainerComponent class="p-2!">
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <input id="rain" v-model="mainStore().raining" type="checkbox" name="rain" />
      <label for="rain">Raining</label>

      <input
        id="extendedFamily"
        v-model="mainStore().extendedFamily"
        type="checkbox"
        name="extendedFamily"
      />
      <label for="extendedFamily">Extended Family</label>

      <input id="troutDerby" v-model="mainStore().troutDerby" type="checkbox" name="troutDerby" />
      <label for="troutDerby">Trout Derby</label>

      <input id="squidFest" v-model="mainStore().squidFest" type="checkbox" name="squidFest" />
      <label for="squidFest">Squid Fest</label>

      <input id="pirate" v-model="mainStore().pirateProfession" type="checkbox" name="pirate" />
      <label for="pirate">Pirate Profession</label>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { mainStore } from '@/store'
import ContainerComponent from '../ContainerComponent.vue'
</script>
