<template>
  <div
    class="absolute top-0 right-0 bottom-0 left-0 z-40 flex items-center justify-center backdrop-blur-[2px]"
    @click="
      (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        emit('close')
      }
    "
  >
    <ContainerComponent
      class="blur-0 z-50 max-h-[90vh] w-[80vw] bg-slate-200 p-2! md:h-[60vh]"
      @click="
        (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
        }
      "
    >
      <div class="relative flex flex-col gap-2">
        <div class="flex gap-2">
          <label>Add fish:</label>
          <input ref="input" class="w-48 border border-slate-400 bg-white" />
          <ContainerComponent
            class="cursor-pointer px-1! py-0!"
            @click="store().prioritisedFish = []"
            >Remove All</ContainerComponent
          >
        </div>
        <div class="flex flex-col flex-wrap gap-2">
          <div
            v-for="fish in store().prioritisedFish"
            :key="fish.Id"
            class="flex w-64 items-center gap-3 rounded bg-slate-300 px-2 py-1"
          >
            <img :src="getFishImage(fish.displayname)" class="h-6" />
            <span class="flex-1">{{ fish.displayname }}</span>
            <FontAwesomeIcon class="cursor-pointer" :icon="faTrashAlt" @click="removeFish(fish)" />
          </div>
        </div>
        <div
          class="absolute -top-2 -right-2 cursor-pointer rounded-bl-full border-b-2 border-l-2 border-slate-400 p-1 pb-2 pl-2 hover:bg-slate-300"
          @click="emit('close')"
        >
          <FontAwesomeIcon class="h-5 w-5" :icon="faX" />
        </div>
      </div>
    </ContainerComponent>
  </div>
</template>
<script setup lang="ts">
import { BaitableFish } from '@/model/Fish'
import ContainerComponent from '../ContainerComponent.vue'
import { store } from '@/store'
import autocomplete from 'autocompleter'
import { computed, onMounted, useTemplateRef } from 'vue'
import { getFishImage } from '@/model/images'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons'
import type { Fish } from '@/model'

const emit = defineEmits(['close'])

const input = useTemplateRef('input')

const fishNames = computed(() => store().prioritisedFish.map((f) => f.displayname))
const remainingFish = computed(() =>
  BaitableFish.filter((f) => fishNames.value.indexOf(f.displayname) == -1)
)

function addFish(name: string) {
  const fish = BaitableFish.find((f) => f.displayname == name)
  if (!fish) return
  store().prioritisedFish.push(fish)
}

function removeFish(fish: Fish) {
  store().prioritisedFish = store().prioritisedFish.filter((f) => f.Id != fish.Id)
}

onMounted(() => {
  if (!input.value) return
  autocomplete({
    input: input.value,
    fetch: (text, update) => {
      const filtered = remainingFish.value
        .map((f) => f.displayname)
        .filter((fish) => fish.toLowerCase().includes(text.toLowerCase()))
        .map((fish) => ({
          label: fish
        }))
      update(filtered)
    },
    onSelect: (item) => {
      addFish(item.label ?? '')
    },
    minLength: -1,
    showOnFocus: true,
    className: 'bg-white border border-gray-300 rounded'
  })
})
</script>
