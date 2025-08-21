<template>
  <ContainerComponent class="p-2! bg-amber-100 border-amber-300!">
    <div class="flex flex-col gap-2">
      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <input 
              id="cancelFish"
              v-model="store().cancelOtherFish"
              type="checkbox"
            />
            <label for="cancelFish">Cancel other fish</label>
          </div>
          <div class="flex gap-2 items-center">
            Cancel after
            <NumberInput v-model="store().cancelOtherFishTime" />
            seconds
          </div>
          <ContainerComponent class="py-0! bg-white">Configure Fish</ContainerComponent>
        </div>
      </ContainerComponent>

      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <input id="cancelChests" v-model="store().cancelChests" type="checkbox" />
            <label for="cancelChests">Cancel no chest</label>
          </div>
          <div class="flex gap-2 items-center">
            Cancel after
            <NumberInput v-model="store().chestCancelTime" />
            seconds
          </div>
        </div>
      </ContainerComponent>

      <div class="grid grid-cols-[auto_auto_1fr] gap-2">
        <label>Catch Time:</label>
        <NumberInput v-model="store().catchTime" />
        <span>seconds</span>
        <label>Cast Time:</label>
        <NumberInput v-model="store().castingOverhead" />
        <span>seconds</span>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { store } from '@/store';
import NumberInput from '../base/NumberInput.vue';
import ContainerComponent from '../ContainerComponent.vue';
</script>