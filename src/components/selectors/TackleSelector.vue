<template>
  <ContainerComponent class=" p-2!">
    <div class="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-2">
      <div class="col-start-1 flex flex-col justify-between">
        <input 
          v-for="tackle in tackles"
          :key="tackle"
          v-model="store().tackles[0]"
          :value="tackle"
          :name="tackle+'1'"
          type="radio"
        />
      </div>
      <div class="col-start-2 flex flex-col justify-between">
        <input 
          v-for="tackle in tackles"
          :key="tackle"
          v-model="store().tackles[1]"
          :value="tackle"
          :name="tackle+'2'"
          type="radio"
        />
      </div>
      <div class="col-start-3 flex flex-col justify-between">
        <span
          v-for="tackle in tackles"
          :key="tackle"
          class="flex gap-2 items-center"
        >
          <img :src="TackleImages[tackle]" class="h-4" />
          {{ tackle }}
        </span>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Tackle } from '@/model';
import ContainerComponent from '../ContainerComponent.vue';
import { store } from '@/store';
import { TackleImages } from '@/model/images';


const tackles: Tackle[] = ['Dressed Spinner', 'Quality Bobber', 'Curiosity Lure', 'Treasure Hunter', 'Other']
</script>

<style scoped>
input {
  width: 1.2rem;
  height: 1.2rem;
  margin: auto;
  cursor: pointer;
}
</style>