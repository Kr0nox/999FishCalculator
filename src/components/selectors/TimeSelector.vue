<template>
  <ContainerComponent class="p-2!">
    <div class="time-root flex flex-col gap-2" :class="{ 'disabled text-slate-400': disabled }">
      <div class="flex items-end gap-2">
        <span @click="useRange = false">Single point in time</span>
        <label class="switch mb-0.5">
          <input v-model="useRange" type="checkbox" :disabled="disabled" />
          <span class="slider round"></span>
        </label>
        <span @click="useRange = true">Time range</span>
      </div>

      <div v-if="useRange" class="double-slider relative flex flex-col gap-2">
        <div class="w-full">
          <span class="text-start">{{ timeToString(numberToTime(startTime)) }}</span>
          <span class="float-end">{{ timeToString(numberToTime(endTime)) }}</span>
        </div>
        <input
          v-model="startTime"
          type="range"
          min="600"
          max="2599"
          :disabled="disabled"
          @input="handleStartInput()"
        />
        <input
          v-model="endTime"
          type="range"
          min="600"
          max="2599"
          :disabled="disabled"
          @input="handleEndInput()"
        />
        <div ref="bar" class="h-1.5 min-h-1.5 w-full rounded-full border border-gray-400"></div>
      </div>

      <div v-else class="flex flex-col gap-2">
        <span>{{ timeToString(numberToTime(startTime)) }}</span>
        <input
          v-model="startTime"
          type="range"
          min="600"
          max="2599"
          :disabled="disabled"
          @input="handleSingleInput()"
        />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue'
import { numberToTime, timeToNumber, timeToString } from '@/model/time'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { mainStore } from '@/store'

const disabled = computed(() => mainStore().bait.name == 'Magic')
const useRange = ref(true)

const startTime = ref(timeToNumber(mainStore().startTime))
const endTime = ref(timeToNumber(mainStore().endTime))
function handleStartInput() {
  if (startTime.value > endTime.value) {
    //startTime.value = endTime.value
  }
  mainStore().startTime = numberToTime(startTime.value)
  fill()
}
function handleEndInput() {
  if (endTime.value < startTime.value) {
    //endTime.value = startTime.value
  }
  mainStore().endTime = numberToTime(endTime.value)
  fill()
}

const fillBar = useTemplateRef('bar')
function fill() {
  const percent1 = ((startTime.value - 600) / (2599 - 600)) * 100
  const percent2 = ((endTime.value - 600) / (2599 - 600)) * 100
  if (fillBar.value) {
    fillBar.value.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , var(--color) ${percent1}% , var(--color) ${percent2}%, #dadae5 ${percent2}%)`
  }
}

function handleSingleInput() {
  mainStore().startTime = numberToTime(startTime.value)
  mainStore().endTime = numberToTime(startTime.value)
  endTime.value = startTime.value
}

onMounted(() => {
  fill()
})

watch(useRange, () => {
  if (useRange.value) {
    nextTick(fill)
  }
})
</script>

<style scoped>
.time-root {
  --color: #3264fe;
}

.time-root.disabled {
  --color: #7a8cc0;
}

.double-slider input[type='range'] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  outline: none;
  position: absolute;
  margin: auto;
  top: 32px;
  bottom: 0;
  background-color: transparent;
  pointer-events: none;
}
.double-slider input[type='range']::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 5px;
}
.double-slider input[type='range']::-moz-range-track {
  -moz-appearance: none;
  height: 5px;
}
.double-slider input[type='range']::-ms-track {
  appearance: none;
  height: 5px;
}
.double-slider input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  background-color: var(--color);
  cursor: pointer;
  margin-top: -9px;
  pointer-events: auto;
  border-radius: 50%;
}
.double-slider input[type='range']::-moz-range-thumb {
  appearance: none;
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--color);
  pointer-events: auto;
  border: none;
}
.double-slider input[type='range']::-ms-thumb {
  appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--color);
  pointer-events: auto;
}

.double-slider input[type='range']:active::-webkit-slider-thumb {
  background-color: #ffffff;
  border: 1px solid var(--color);
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.2s;
  transition: 0.42;
}

.slider:before {
  position: absolute;
  content: '';
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

input:checked + .slider {
  background-color: var(--color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
