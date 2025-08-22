<template>
  <ContainerComponent>
    <div class="flex flex-col gap-2">
      <h1 class="flex items-center gap-2 text-xl font-bold" @click="expanded = !expanded">
        <FontAwesomeIcon class="h-4" :icon="expanded ? faChevronDown : faChevronRight" />
        <span>{{ title }}</span>
      </h1>
      <div v-if="expanded" class="flex-1">
        <slot />
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ContainerComponent from './ContainerComponent.vue'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const expanded = defineModel('expanded', {
  type: Boolean,
  default: false
})
</script>
