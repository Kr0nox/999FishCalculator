<template>
  <PopUp @close="emit('close')"> </PopUp>
</template>

<script setup lang="ts">
import PopUp from '../base/PopUp.vue'

const emit = defineEmits(['close'])
</script>
