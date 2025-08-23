<template>
  <span class="math box-border rounded bg-slate-50 px-1">
    <span
      v-for="(part, index) in parts"
      :key="index"
      :class="{
        'text-slate-700': part.type == 'Operator',
        'text-monokai-orange': part.type == 'Number',
        'text-monokai-green': part.type == 'Function'
      }"
      ><VariableRenderer v-if="part.type == 'Variable'" :variable="part.value" /><span v-else>{{
        part.value
      }}</span></span
    >
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VariableRenderer from './VariableRenderer.vue'

const props = defineProps({
  term: {
    type: String,
    required: true
  }
})

type Types = 'Variable' | 'Number' | 'Operator' | 'Function'
interface Symbol {
  type: Types
  value: string
}

const operators = '-+*/()=, '.split('')
const functions = ['min']

const parts = computed<Symbol[]>(() => {
  const split = props.term.split(RegExp(`([${operators.join('')}])`, 'g'))
  return split.map((p) => {
    let type: Types = 'Variable'
    if (operators.includes(p)) {
      type = 'Operator'
    } else if (/[0-9]+(.[0-9]+)?/.test(p)) {
      type = 'Number'
    } else if (functions.includes(p)) {
      type = 'Function'
    }

    return { type, value: p }
  })
})
</script>

<style scoped>
.math * {
  font-style: italic;
  font-family: 'Times New Roman', Times, serif;
}
</style>
