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
      <h2>2026/07/23</h2>
      <div>
        <ul>
          <li>Blessing of the Waters Mode added</li>
          <li>
            The calculator now actually remembers the last fish entered for targeted bait (bug fix
            yippie)
          </li>
        </ul>
      </div>
      <h2>2026/06/07</h2>
      <div>
        <ul>
          <li>The calculator now remembers the last fish entered for targeted bait</li>
        </ul>
      </div>
      <h2>2026/06/01</h2>
      <div>
        <ul>
          <li>
            Added a simulation mode, that can often give more accurate results, especially with
            targeted bait
          </li>
          <li>
            Items that are not fish (jellies, trash, Fossilized Spine, ...) are now handled more
            accurately. This means: using challenge bait does not show their results as getting 3 of
            them, the minigame is no longer considered in the time for them.
            <i
              >This leads to lower time amounts for all fish across the board, depending on the
              amount of non fish, it might be a significant amount</i
            >
          </li>
          <li>
            Added some tooltips (more to come in the future) to explain what the different times
            mean
          </li>
          <li>
            Added a warning if your depth is larger than the maximum depth you can get in that
            location
          </li>
        </ul>
      </div>
      <h2>2025/11/07</h2>
      <div>
        Add daily luck
        <ul>
          <li>Add slider</li>
          <li>Make it influence chest chances</li>
          <li>Make it influence the average roe amount</li>
        </ul>
      </div>
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
          <li>
            Add resizable view under
            <RouterLink class="text-blue-700 underline" :to="{ name: 'Resizable' }"
              >/resize</RouterLink
            >
          </li>
          <li>Allow entering amount of fish for challenge bait</li>
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
