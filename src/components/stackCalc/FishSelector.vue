<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <h1>Fish:<span class="float-right">Catch Goal</span></h1>
      <div
        v-for="(fish, index) in stackCalcStore().fishForLocation"
        :key="fish.Id"
        class="grid grid-cols-[auto_1fr_auto] items-center gap-2"
      >
        <img :src="getFishImage(fish.displayname)" class="h-8" />
        <span>{{ fish.displayname }}</span>
        <NumberInput
          :model-value="counts[index] ?? 0"
          @update:model-value="(v) => setCount(index, v)"
        />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Fish } from '@/model'
import { getFishImage } from '@/model/images'
import { ref, type Ref } from 'vue'
import NumberInput from '../base/NumberInput.vue'
import { stackCalcStore } from '@/store'
import ContainerComponent from '../ContainerComponent.vue'

const emit = defineEmits(['amountChanged'])

const counts: Ref<Record<number, number>> = ref({})

interface FishCount extends Fish {
  stillToCatch: number
}

function setCount(index: number, value: number) {
  counts.value[index] = value
  emit('amountChanged', getArray())
}

function getArray(): FishCount[] {
  return stackCalcStore().fishForLocation.map((f, i) => ({
    ...f,
    stillToCatch: counts.value[i] ?? 0
  }))
}
</script>
