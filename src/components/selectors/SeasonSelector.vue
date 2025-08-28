<template>
  <ContainerComponent class="border-emerald-400! bg-emerald-200 p-2!">
    <div class="flex flex-col gap-2">
      <ContainerComponent
        v-for="season in seasons"
        :key="season"
        :class="
          mainStore().season == season ? 'border-emerald-600! bg-emerald-400' : 'bg-slate-100'
        "
        class="cursor-pointer"
        @click="mainStore().season = season"
      >
        <div class="flex items-center gap-2">
          <img :src="SeasonImages[season]" class="h-4" />
          {{ season }}
        </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue'
import type { Season } from '@/model'
import { SeasonImages } from '@/model/images'
import { mainStore } from '@/store'

const seasons: Season[] = ['Spring', 'Summer', 'Fall', 'Winter']
</script>
