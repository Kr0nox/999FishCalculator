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
      <div class="relative">
        <slot />
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
import ContainerComponent from '../ContainerComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['close'])
</script>
