<template>
  <ContainerComponent>
    <div class="flex flex-col gap-2 md:max-h-full">
      <h1
        class="flex cursor-pointer items-center gap-2 text-xl font-bold"
        @click="expanded = !expanded"
      >
        <FontAwesomeIcon class="h-4" :icon="expanded ? faChevronDown : faChevronRight" />
        <div v-if="props.title" class="flex-1">{{ title }}</div>
        <div v-if="$slots.title" class="flex-1"><slot name="title" /></div>
      </h1>
      <div v-if="expanded" class="flex flex-1 md:overflow-hidden">
        <slot />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ContainerComponent from './ContainerComponent.vue'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  title: {
    type: String,
    default: undefined,
    required: false
  }
})

const expanded = defineModel('expanded', {
  type: Boolean,
  default: false
})
</script>
