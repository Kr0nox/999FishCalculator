<template>
  <ContainerComponent class="bg-emerald-200 border-emerald-400! p-2!">
    <div class="flex gap-2 flex-col">
      <ContainerComponent
        v-for="season in seasons"
        :key="season"
        :class="store().season == season ? 'bg-emerald-400 border-emerald-600!' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().season = season"
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
import { store } from '@/store'


const seasons: Season[] = ['Spring', 'Summer', 'Fall', 'Winter']
</script>
