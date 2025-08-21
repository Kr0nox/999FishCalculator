<template>
<ContainerComponent class="bg-red-200 border-red-400! p-2!">
    <div class="flex gap-2 flex-col">
      <ContainerComponent
        v-for="bait in simpleBaitTypes"
        :key="bait.name"
        :class="store().bait.name == bait.name ? 'bg-red-400 border-red-600!' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().bait = bait"
      >
        <div class="flex items-center gap-2">
          <img :src="BaitImages[bait.name]" class="h-4" />
          {{ bait.name }}
        </div>
        
      </ContainerComponent>
      <ContainerComponent
        :class="store().bait.name == 'Targeted' ? 'bg-red-400 border-red-600!' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().bait = { name: 'Targeted', fish: '' }"
      >
      <div class="flex items-center gap-2">
        <img :src="targetedBaitImage" class="h-4" />
        <span>Targeted</span>
        <input 
          v-show="store().bait.name == 'Targeted'"
          ref="targetedTypeInput"
          v-model="(store().bait as TargetedBait).fish"
          class="bg-white border border-gray-300 rounded px-1 text-sm w-32"
          placeholder="Fish"
          @click="cancelEvent"
        />
      </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Bait, TargetedBait } from '@/model';
import ContainerComponent from '../ContainerComponent.vue';
import { store } from '@/store';
import { BaitImages, getFishImage } from '@/model/images';
import { computed, onMounted, useTemplateRef } from 'vue';
import autocomplete from 'autocompleter';
import { BaitableFish } from '@/model/Fish';

const simpleBaitTypes: Bait[] = [
  {name: 'Deluxe'},
  {name: 'Wild'},
  {name:'Magic'},
  {name: 'Challenge'},
  {name: 'Magnet'}
]

const targetedBaitImage = computed(() => {
  if (store().bait.name !== 'Targeted') {
    return BaitImages['Targeted']
  }
  return getFishImage((store().bait as TargetedBait).fish) ?? BaitImages['Targeted']
})

const targetedTypeInput = useTemplateRef('targetedTypeInput');

function cancelEvent(e: Event) {
  e.preventDefault();
  e.stopPropagation();
}

onMounted(() => {
  if (!targetedTypeInput.value) return;
  autocomplete({
    input: targetedTypeInput.value,
    fetch: (text, update) => {
      const filtered = BaitableFish.map(f => f.displayname).filter(fish => fish.toLowerCase().includes(text.toLowerCase())).map(fish => ({
        label: fish,
        image: getFishImage(fish) ?? BaitImages['Targeted']
      }));
      update(filtered);
    },
    onSelect: (item) => {
      if (store().bait.name === 'Targeted') {
        (store().bait as TargetedBait).fish = item.label ?? '';
      }
    },
    minLength: -1,
    showOnFocus: true,
    className: 'bg-white border border-gray-300 rounded',
  })
})
</script>

<style>
@reference "../../style.css";

.autocomplete .selected {
  @apply font-bold;
}

.autocomplete > div {
  @apply px-1
}

.autocomplete > div:hover {
  @apply bg-slate-200 rounded-sm;
}

.autocomplete {
  @apply max-h-10 overflow-y-auto;
}
</style>