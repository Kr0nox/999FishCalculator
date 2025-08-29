<template>
  <div class="grid gap-5 md:grid-cols-[1fr_1fr_1fr]">
    <FishSelector />
    <LimitSelector />
    <ResultContainer :progress="lastReport" @run="run()" />
  </div>
</template>

<script setup lang="ts">
import FishSelector from '@/components/stackCalc/FishSelector.vue'
import LimitSelector from '@/components/stackCalc/LimitSelector.vue'
import ResultContainer from '@/components/stackCalc/ResultContainer.vue'
import { type ProgressReport } from '@/math/StackTactic'
import { getCalculatorLocation } from '@/model/location'
import { stackCalcStore } from '@/store'
import { ref } from 'vue'
import WorkerConstructor from '../math/worker.ts?worker'

const lastReport = ref<ProgressReport | undefined>(undefined)
let worker: Worker | undefined

function run() {
  worker = new WorkerConstructor()

  worker.onmessage = (e: MessageEvent<ProgressReport>) => {
    lastReport.value = e.data
  }
  worker.postMessage({
    fish: stackCalcStore().fishForLocation.map((f) => ({
      ...f,
      canCatchPerfect: false,
      toCatch: 999
    })),
    location: getCalculatorLocation(stackCalcStore().location)
  })
}
</script>
