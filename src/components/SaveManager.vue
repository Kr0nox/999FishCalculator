<template>
  <ContainerComponent class="p-2!">
    <div class="grid grid-cols-2 gap-2">
      <ContainerComponent class="cursor-pointer px-1! py-0!" @click="save()"
        >Copy Configuration</ContainerComponent
      >
      <ContainerComponent class="cursor-pointer px-1! py-0!" @click="clickLoad()"
        >Load</ContainerComponent
      >
      <ContainerComponent class="col-span-2 cursor-pointer px-1! py-0!" @click="share()"
        >Share</ContainerComponent
      >
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { load, save, share } from '@/store/serialize'
import ContainerComponent from './ContainerComponent.vue'

function clickLoad() {
  const alert = window.prompt('Enter code')
  if (!alert) return
  load(alert)
}
</script>
http://localhost:5173/#N4IgNg9gxghgLgSwgOxALlJWiXpAIQFMYoALEAGhAGcBXAIwBlp4lU0QARQgMxlrBwQAXyrVi1XBwDKABwBOCZAHNKNODHlwAKggC2hdKFIRa89ADYqepbTiG0ABlEhCyACa6DRkCbPoAJgBWa1t7dCDnKnoYBCEMEGQYbw5uMFoAD0MXDSgAazBCanQAbS55IvF3AAI5JWRCcypOCuoq2tl6xpAAXSoeBGpSJWVGQgA3QjB0AEZHKnT89HmQd0JZOHI0EJB5WOQR9D4wcTEAR1oEdwAxIvjj05A4eVM4bnl6AE8jmBPCKkIGXsHkIN2SCDA3zQD3+IGwZC8DgAHFRYNRECoAPKTeSkYjuCKovHo6TPeCEZRQ0CwZBQKYAOQgAGFifdfo8aXSwIiIi4BkNSXt7JSfJyppjNo1roMtjDUTBaVMeWgAlQFEhFIgqtKhqUei4yL9CipCPhYnAdaQAIJ6UzIeKgGYAFgA7LNhMIgA
