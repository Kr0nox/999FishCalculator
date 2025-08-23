<template>
  <span class="text-orange-700">
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

const split = computed(() => props.variable.split('_'))
const normal = computed(() => split.value[0])
const sub = computed(() => split.value[1])
</script>
