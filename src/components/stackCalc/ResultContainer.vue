<template>
  <ContainerComponent class="bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <ContainerComponent v-if="!progress" class="h-8" @click="emit('run')">Run</ContainerComponent>
      <ProgressBar
        v-else
        class="h-8"
        :percentage="progress.progress / progress.total"
        :text="progress.step"
        color="lime"
      />
      {{ progress }}
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue'
import type { PropType } from 'vue'
import type { ProgressReport } from '@/math/StackTactic'
import ProgressBar from './ProgressBar.vue'

defineProps({
  progress: {
    type: Object as PropType<ProgressReport>,
    required: false,
    default: undefined
  }
})

const emit = defineEmits(['run'])
</script>
