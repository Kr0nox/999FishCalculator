<template>
  <div class="flex items-center gap-x-2">
    <div class="flex h-8 w-12 items-center justify-center">
      <img :src="src" />
    </div>
    <span class="col-start-2 row-start-1 text-sm">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true
  }
})
</script>
