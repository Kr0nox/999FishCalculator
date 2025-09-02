<template>
  <ContainerComponent class="w-full bg-slate-100 p-2!">
    <div class="flex items-center gap-2">
      <RouterLink :to="{ name: 'Main' }"
        ><ContainerComponent class="px-1! py-0!">
          <FontAwesomeIcon :icon="faArrowLeft" /> Back
        </ContainerComponent></RouterLink
      >
      <h1 class="text-2xl font-bold">Changelog</h1>
    </div>
    <main>
      <h2>2025/09/02</h2>
      <div>
        <ul>
          <li>Bugfix: Chest chance was constantly set to 50% for strategies</li>
          <li>Add label for time per chest and chests per hour</li>
          <li>
            Add more items to chest calculation: Golden Bobber, Stardrop Tea and Golden Animal
            Cracker
          </li>
          <li>Add selection for chest items</li>
          <li>Add Caldera as Ginger Island sublocation</li>
          <li>Add this changelog</li>
        </ul>
      </div>
      <h2>2025/08/31</h2>
      <div>
        <ul>
          <li>Add Sewer and Mutant Bug Layer</li>
        </ul>
      </div>
      <h2>2025/08/29</h2>
      <div>
        <ul>
          <li>Add type safety</li>
          <li>Improve performance by replacing recursiveMultiply with summerRecursiveMultiply</li>
          <li>
            Bugfix: The last percentage of a fish was taken for range calculations. This could lead
            to percentage sums over 100%.
          </li>
        </ul>
      </div>
      <h2>2025/08/23</h2>
      <div>Initial Release</div>
    </main>
  </ContainerComponent>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ContainerComponent from '@/components/ContainerComponent.vue'
</script>

<style scoped>
h2 {
  font-size: larger;
  font-weight: bold;
}

h2 + div {
  padding-left: 10px;
}

h2 {
  margin-top: 15px;
}
h2:first {
  margin-top: 0;
}

li {
  list-style-type: circle;
  list-style-position: inside;
}
</style>
