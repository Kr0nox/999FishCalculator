<template>
  <span class="text-monokai-blue">
    {{ normal }}<sub v-if="sub">{{ sub }}</sub>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variable: {
    type: String,
    required: true
  }
})

const _split = computed(() => props.variable.split('_'))
const split = computed(() => [_split.value[0], _split.value.slice(1).join('_')])
const normal = computed(() => split.value[0])
const sub = computed(() => split.value[1])
</script>
