<template>
  <ContainerComponent class="border-orange-400! bg-orange-200 p-2!">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <ContainerComponent
        v-for="(location, index) in LocationOptions"
        :key="location.name"
        :class="
          store().location.location == location.name
            ? 'border-orange-600! bg-orange-400 md:col-span-2'
            : 'bg-slate-100'
        "
        :style="{
          'grid-column-start': getColumn(index),
          'grid-row-start': getRow(index)
        }"
        class="cursor-pointer"
        @click="selectLocation(location)"
      >
        <div class="flex flex-col gap-y-1">
          <span class="flex items-center gap-2">
            <img :src="LocationImages[location.name]" class="h-4" />
            {{ location.name }}
          </span>
          <div
            v-if="store().location.location == location.name && location.subLocations.length > 0"
            class="flex flex-col gap-y-2"
          >
            <ContainerComponent
              v-for="subLocation in location.subLocations"
              :key="subLocation"
              :class="
                store().location.subLocation == subLocation
                  ? 'border-orange-800! bg-orange-600'
                  : 'bg-slate-100'
              "
              class="cursor-pointer"
              @click="(e: Event) => setSubLocation(subLocation, e)"
            >
              <span>{{ subLocation }}</span>
            </ContainerComponent>
          </div>
        </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { LocationOptions, type LocationOption } from '@/model/location'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'
import { LocationImages } from '@/model/images'
import { computed } from 'vue'

function selectLocation(location: LocationOption) {
  if (location.name == store().location.location) return
  store().location.location = location.name
  store().location.subLocation = location.subLocations[0] || undefined
}

function setSubLocation(subLocation: string, e: Event) {
  e.preventDefault()
  e.stopPropagation()
  store().location.subLocation = subLocation
}

const selectedIndex = computed(() =>
  LocationOptions.findIndex((loc) => loc.name == store().location.location)
)
const selectedModulo = computed(() => selectedIndex.value % 2)

function getColumn(index: number) {
  if (index == selectedIndex.value) return 1
  if (index < selectedIndex.value) return (index % 2) + 1
  if (index == selectedIndex.value + 1 && selectedModulo.value == 1) return 2
  if (selectedModulo.value == 0) return ((index - 1) % 2) + 1
  return (index % 2) + 1
}

function getRow(index: number) {
  const defaultRow = Math.floor(index / 2) + 1
  if (index < selectedIndex.value) return defaultRow
  if (index == selectedIndex.value) {
    return selectedModulo.value == 0 ? defaultRow : defaultRow + 1
  }
  if (index == selectedIndex.value + 1 && selectedModulo.value == 1) return defaultRow - 1
  return defaultRow + (index % 2 == 0 ? 0 : 1)
}
</script>
