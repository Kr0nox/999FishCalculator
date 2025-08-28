<template>
  <div class="grid gap-5 md:grid-cols-[1fr_1fr_1fr]">
    <FishSelector />
    <LimitSelector />
  </div>
</template>

<script setup lang="ts">
import FishSelector from '@/components/stackCalc/FishSelector.vue'
import LimitSelector from '@/components/stackCalc/LimitSelector.vue'
</script>
