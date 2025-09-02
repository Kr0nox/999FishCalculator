<template>
  <ContainerComponent class="border-red-400! bg-red-200 p-2!">
    <div class="flex flex-col gap-2">
      <ContainerComponent
        v-for="bait in simpleBaitTypes"
        :key="bait.name"
        :class="store().bait.name == bait.name ? 'border-red-600! bg-red-400' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().bait = bait"
      >
        <div class="flex items-center gap-2">
          <img :src="BaitImages[bait.name]" class="h-4" />
          {{ bait.name }}
        </div>
      </ContainerComponent>
      <ContainerComponent
        :class="store().bait.name == 'Challenge' ? 'border-red-600! bg-red-400' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().bait = { name: 'Challenge' }"
      >
        <div class="flex items-center gap-2">
          <img :src="BaitImages['Challenge']" class="h-4" />
          <span class="flex-1">Challenge Bait</span>
          <FontAwesomeIcon
            v-if="store().bait.name == 'Challenge'"
            :icon="faGears"
            class="text-red-950"
            @click="showChallengeBaitModifier = true"
          />
        </div>
        <TargetedBaitModifier
          v-if="showChallengeBaitModifier"
          @close="showChallengeBaitModifier = false"
        />
      </ContainerComponent>
      <ContainerComponent
        :class="store().bait.name == 'Magnet' ? 'border-red-600! bg-red-400' : 'bg-slate-100'"
        class="cursor-pointer"
        @click="store().bait = { name: 'Magnet' }"
      >
        <div class="flex items-center gap-2">
          <img :src="BaitImages['Magnet']" class="h-4" />
          Magnet
        </div>
      </ContainerComponent>
      <ContainerComponent
        :class="store().bait.name == 'Targeted' ? 'border-red-600! bg-red-400' : 'bg-slate-100'"
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
            class="w-32 rounded border border-gray-300 bg-white px-1 text-sm"
            placeholder="Fish"
            @click="cancelEvent"
          />
        </div>
      </ContainerComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import type { Bait, TargetedBait } from '@/model'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'
import { BaitImages, getFishImage } from '@/model/images'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import autocomplete from 'autocompleter'
import { BaitableFish } from '@/model/Fish'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGears } from '@fortawesome/free-solid-svg-icons'
import TargetedBaitModifier from './ChallengeBaitModifier.vue'

const simpleBaitTypes: Bait[] = [{ name: 'Deluxe' }, { name: 'Wild' }, { name: 'Magic' }]

const targetedBaitImage = computed(() => {
  if (store().bait.name !== 'Targeted') {
    return BaitImages['Targeted']
  }
  return getFishImage((store().bait as TargetedBait).fish) ?? BaitImages['Targeted']
})

const targetedTypeInput = useTemplateRef('targetedTypeInput')

const showChallengeBaitModifier = ref(false)

function cancelEvent(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  if (!targetedTypeInput.value) return
  autocomplete({
    input: targetedTypeInput.value,
    fetch: (text, update) => {
      const filtered = BaitableFish.map((f) => f.displayname)
        .filter((fish) => fish.toLowerCase().includes(text.toLowerCase()))
        .map((fish) => ({
          label: fish,
          image: getFishImage(fish) ?? BaitImages['Targeted']
        }))
      update(filtered)
    },
    onSelect: (item) => {
      if (store().bait.name === 'Targeted') {
        ;(store().bait as TargetedBait).fish = item.label ?? ''
      }
    },
    minLength: -1,
    showOnFocus: true,
    className: 'bg-white border border-gray-300 rounded'
  })
})
</script>

<style>
@reference "../../style.css";

.autocomplete .selected {
  @apply font-bold;
}

.autocomplete > div {
  @apply px-1;
}

.autocomplete > div:hover {
  @apply rounded-sm bg-slate-200;
}

.autocomplete {
  @apply z-[60] max-h-10 overflow-y-auto;
}
</style>
