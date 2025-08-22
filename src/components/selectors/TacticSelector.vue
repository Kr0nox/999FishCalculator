<template>
  <ContainerComponent class="border-amber-300! bg-amber-100 p-2!">
    <div class="flex flex-col gap-2">
      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input id="cancelFish" v-model="store().cancelOtherFish" type="checkbox" />
            <label for="cancelFish">Cancel other fish</label>
          </div>
          <div class="flex items-center gap-2" :class="{'disabled': !store().cancelOtherFish}">
            Cancel after
            <NumberInput v-model="store().cancelOtherFishTime" :disabled="!store().cancelOtherFish" />
            seconds
          </div>
          <ContainerComponent class="bg-white py-0! text-center" :class="{'disabled': !store().cancelOtherFish}" @click="setShowSelector(true)">Configure Fish</ContainerComponent>
          <TargetedFishSelector v-if="showSelector" @close="showSelector = false" />
        </div>
      </ContainerComponent>

      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input id="cancelChests" v-model="store().cancelChests" type="checkbox" />
            <label for="cancelChests">Cancel no chest</label>
          </div>
          <div class="flex items-center gap-2" :class="{'disabled': !store().cancelChests}">
            Cancel after
            <NumberInput v-model="store().chestCancelTime" :disabled="!store().cancelChests" />
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
import { store } from '@/store'
import NumberInput from '../base/NumberInput.vue'
import ContainerComponent from '../ContainerComponent.vue'
import TargetedFishSelector from './TargetedFishSelector.vue';
import { ref } from 'vue';

const showSelector = ref(false)

function setShowSelector(value: boolean) {
  if (!store().cancelOtherFish) return
  showSelector.value = value
}
</script>

<style>
@reference "../../style.css";

.disabled, .disabled * {
  @apply text-slate-400!;
}

</style>
