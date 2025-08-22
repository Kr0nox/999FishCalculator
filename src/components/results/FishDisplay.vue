<template>
  <div class="grid grid-cols-[auto_1fr_auto] grid-rows-2 gap-x-2 rounded bg-slate-200 px-2 py-1">
    <img :src="getFishImage(fish.displayname)" class="col-start-1 row-span-2 row-start-1" />
    <span class="col-start-2 row-start-1 font-bold">{{ fish.displayname }}</span>
    <span class="col-start-3 row-start-1 font-bold"
      >{{ (fish.finalChance * 100).toFixed(2) }}%</span
    >
    <span class="col-span-2 col-start-2 row-start-2 text-sm">
      {{ primaryInformationText
      }}{{ secondaryInformationText ? ` | ${secondaryInformationText}` : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResults } from '@/fishcalc'
import { getFishImage } from '@/model/images'
import { computed, type PropType } from 'vue'

type SecondaryInfo = { kind: 'perStack' } | { kind: 'forTime'; time: number }

const props = defineProps({
  fish: {
    type: Object as PropType<CalculatorResults>,
    required: true
  },
  timePerCatch: {
    type: Number,
    default: undefined
  },
  secondaryInformation: {
    type: Object as PropType<SecondaryInfo>,
    default: () => ({ kind: 'perStack' })
  }
})

const primaryInformationText = computed(() => {
  if (props.timePerCatch === undefined) {
    return 'Fish will not be caught'
  }
  return `${props.timePerCatch.toFixed(2)} s/Fish`
})

const secondaryInformationText = computed(() => {
  if (props.timePerCatch === undefined) {
    return undefined
  }
  if (props.secondaryInformation.kind == 'perStack') {
    const totalTime = props.timePerCatch * 999
    const timeInHours = (totalTime / 3600).toFixed(2)
    return `${timeInHours} h/Stack`
  }
  if (props.secondaryInformation.kind == 'forTime') {
    const catches = Math.round(props.secondaryInformation.time / props.timePerCatch)
    const hours = (props.secondaryInformation.time / 3600).toFixed(2)
    return `${catches} in ${hours} h`
  }
  return ''
})
</script>
