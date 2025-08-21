<template>
  <ContainerComponent class=" p-2!">
    <div class="flex flex-col gap-2 relative">
      <div class="w-full">
        <span class="text-start">{{ timeToString(numberToTime(startTime)) }}</span> 
        <span class="float-end">{{ timeToString(numberToTime(endTime)) }}</span>
      </div>
      <input 
        v-model="startTime"
        type="range"
        min="600"
        max="2600"
        @input="handleStartInput()"
      />
      <input 
        v-model="endTime"
        type="range"
        min="600"
        max="2600"
        @input="handleEndInput()"
      />
      <div ref="bar" class="w-full h-1.5 min-h-1.5 rounded-full border border-gray-400"></div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import { numberToTime, timeToNumber, timeToString } from '@/model/time';
import { onMounted, ref, useTemplateRef } from 'vue';
import { store } from '@/store';


const startTime = ref(timeToNumber(store().startTime))
const endTime = ref(timeToNumber(store().endTime))
function handleStartInput() {
  if (startTime.value > endTime.value) {
    //startTime.value = endTime.value
  }
  store().startTime = numberToTime(startTime.value)
  fill()
}
function handleEndInput() {
  if (endTime.value < startTime.value) {
    //endTime.value = startTime.value
  }
  store().endTime = numberToTime(endTime.value)
  fill()
}

const fillBar = useTemplateRef('bar')
function fill() {
  const percent1 = (startTime.value - 600) / (2600 - 600) * 100
  const percent2 = (endTime.value - 600) / (2600 - 600) * 100
  if (fillBar.value) {
    fillBar.value.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
  }
}

onMounted(() => {
  fill()
})
</script>

<style scoped>
input[type="range"] {
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
input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 5px;
}
input[type="range"]::-moz-range-track {
  -moz-appearance: none;
  height: 5px;
}
input[type="range"]::-ms-track {
  appearance: none;
  height: 5px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  background-color: #3264fe;
  cursor: pointer;
  margin-top: -9px;
  pointer-events: auto;
  border-radius: 50%;
}
input[type="range"]::-moz-range-thumb {
  appearance: none;
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: #3264fe;
  pointer-events: auto;
  border: none;
}
input[type="range"]::-ms-thumb {
  appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: #3264fe;
  pointer-events: auto;
}

input[type="range"]:active::-webkit-slider-thumb {
  background-color: #ffffff;
  border: 1px solid #3264fe;
}
</style>