<template>
  <ContainerComponent class="border-orange-400! bg-orange-200 p-2!">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
      <ContainerComponent
        v-for="location in LocationOptions"
        :key="location.name"
        :class="
          model.location == location.name
            ? 'col-start-1 border-orange-600! bg-orange-400 md:col-span-2'
            : 'bg-slate-100'
        "
        class="cursor-pointer"
        @click="selectLocation(location)"
      >
        <div class="flex flex-col gap-y-1">
          <span class="flex items-center gap-2">
            <img :src="LocationImages[location.name]" class="h-4" />
            {{ location.name }}
          </span>
          <div v-if="model.location == location.name" class="flex flex-col gap-y-2">
            <ContainerComponent
              v-for="subLocation in location.subLocations"
              :key="subLocation"
              :class="
                model.subLocation == subLocation
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
import { LocationImages } from '@/model/images'
import type { Location } from '@/model'

const model = defineModel<Location>({
  default: {
    location: 'Beach'
  }
})

function selectLocation(location: LocationOption) {
  if (location.name == model.value.location) return
  model.value.location = location.name
  model.value.subLocation = location.subLocations[0] || undefined
}

function setSubLocation(subLocation: string, e: Event) {
  e.preventDefault()
  e.stopPropagation()
  model.value.subLocation = subLocation
}
</script>
