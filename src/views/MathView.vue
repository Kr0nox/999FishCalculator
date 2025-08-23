<template>
  <ContainerComponent class="w-full bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:min-h-full md:overflow-auto">
      <div class="flex items-center gap-2">
        <RouterLink :to="{ name: 'Main' }"
          ><ContainerComponent class="px-1! py-0!">
            <FontAwesomeIcon :icon="faArrowLeft" /> Back
          </ContainerComponent></RouterLink
        >
        <h1 class="text-2xl font-bold">Math Explained</h1>
      </div>
      <main class="">
        <div class="dynamic rounded bg-slate-200 p-2">
          <h2 class="font-bold">Contents</h2>
          <div class="flex flex-col">
            <a
              v-for="heading of headings"
              :key="heading.innerText"
              :href="'#' + heading.id"
              :style="{ 'margin-left': (getHeadingNumber(heading.tagName) - 2) * 6 + 'px' }"
              >{{ heading.innerText }}</a
            >
          </div>
        </div>
        <div id="text">
          <h2>Base Variables</h2>
          <p>Here we introduce some general variables that we use in calculations.</p>
          <h3>Tackles</h3>
          <p>
            For the tackles we are interested in the amount of tackles equiped. For the calculations
            where the math is easily explainable, we are interested in <i>Dressed Spinners</i>,
            <i>Quality Bobbers</i> and <i>Treasure Hunters</i>. <br />
            We notate the amount of <i>Dressed Spinners</i> with <MathRenderer term="#DS" />. <br />
            We notate the amount of <i>Quality Bobbers</i> with <MathRenderer term="#QB" />. <br />
            We notate the amount of <i>Treasure Hunters</i> with <MathRenderer term="#TH" />.
          </p>
          <h3>Others</h3>
          <p>
            Other variables include: <br />
            The water depth: <MathRenderer term="d" /> <br />
            The fishing level including buffs: <MathRenderer term="lvl" /> <br />
            The amount of luck buffs from food and drinks: <MathRenderer term="luck" /> <br />
            The time the player spends inside the fishing mini game, called <i>Catch Time</i>:
            <MathRenderer term="T_catch" /> <br />
            The overhead from casting the line and the real in animation, called <i>Cast Time</i>:
            <MathRenderer term="T_cast" />
          </p>

          <h2>Fish</h2>
          <h3>Time to Bite</h3>
          <p>
            We start with a base, <MathRenderer term="TTB_min=0.6" /> and
            <MathRenderer term="TTB_max=0.5" /> <br />
            Each Fishing Level decreases the maximum time by <MathRenderer term="0.25" /> seconds.
            <br />
            Each <i>Dressed Spinner</i> decreases the maximum bite time by
            <MathRenderer term="10" /> seconds. <br />
            We expect to always hook a fish on the first try, so we can decrease them by 25% (which
            means multiply them with <MathRenderer term="0.75" />). <br />
            This leaves us with <MathRenderer term="TTB_min=0.6 * 0.75" /> and
            <MathRenderer term="TTB_max=(0.6 - 10*#DS - 0.25*lvl) * 0.75" />. Where the minimum bite
            time can not be less than 0.5. <br /><br />

            Bait reduces both bite times. Here is a list of our supported bait types and their
            effective reduction and multiplier <MathRenderer term="m_bait" /> <br />
            - Deluxe Bait: 67% (Multiplier: <MathRenderer term="m_bait=0.33" />) <br />
            - Wild Bait and Challenge Bait: 62.5% (Multiplier: <MathRenderer term="m_bait=0.375" />)
            <br />
            - Magic Bait, Targeted Bait Magnets: 50% (Multiplier:
            <MathRenderer term="m_bait=0.5" />) <br /><br />

            In the end we have: <br />
            <MathRenderer term="TTB_min=0.6 * 0.75 * m_bait" /> <br />
            <MathRenderer term="TTB_max=(0.6 - 10*#DS - 0.25*lvl) * 0.75 * m_bait" /> <br />
            The actual bite time is uniformly distributed in this range, so the average bite time is
            determined by the arithmetic mean: <MathRenderer term="TTB=(TTB_min + TTB_max) / 2" />
            <a href="https://stardewvalleywiki.com/Fishing#Fish_Bite_Time"><sup>[Wiki]</sup></a>
          </p>
          <h3>Time per Cast</h3>
          <p>
            This is dependent on the used strategy. See
            <a class="link" href="#strategies">Strategies</a> for more.
          </p>
          <h3>Fish chances</h3>
          <p>
            We use the same algorithms as
            <a class="link" href="https://brokencygnus.github.io/stardew-fishing-calc/home"
              >brokencygnus calculator</a
            >
            to get a chance at a given time. We call this <MathRenderer term="P(fish,time)" />
            <br />
            In single time mode this number is the chance displayed. <br />
            Time can be a number between 600 (6 AM) and 2600 (2 AM). Every 100 a new hour begins. As
            fish chances change on the full hour, we only need to get chances at the full hour, not
            every minute in the range. <br />
            We then sum up the chances at every full hour in the range and divide this by the amount
            of hours in the range, to get <MathRenderer term="P(fish,start,end)" />.
          </p>
          <h3>Quality</h3>
          <p>
            For the base quality we apply this
            <a class="link" href="https://stardewvalleywiki.com/Fishing#Fish_Size_.26_Quality"
              >table</a
            >
            from the wiki. <br />
            We then apply the modifiers from a perfect catch and <i>Quality Bobbers</i>. <br />
            We sum up the probabilities of all base chances that get elevated to iridium using the
            modifiers.
          </p>

          <h2>Chests</h2>
          <p>To be written, for now see <a href="sqroe.kronox.dev">here</a></p>
          <h2>Strategies</h2>
          <p>To be written, for now see <a href="sqroe.kronox.dev">here</a></p>
        </div>
      </main>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '@/components/ContainerComponent.vue'
import MathRenderer from '@/components/math/MathRenderer.vue'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, ref } from 'vue'

const headings = ref<HTMLElement[]>([])

function getHeadingNumber(tag: string) {
  return Number(tag.substring(1))
}

onMounted(() => {
  const container = document.getElementById('text')!
  const elements = container.querySelectorAll('h2, h3, h4, h5, h6')
  headings.value = Array.from(elements) as HTMLElement[]
  const titleNumbers = [0]
  let lastHeadingNumber = 2
  for (const heading of headings.value) {
    const headingNumber = getHeadingNumber(heading.tagName)
    if (headingNumber == lastHeadingNumber) {
      titleNumbers[titleNumbers.length - 1]++
    } else if (headingNumber > lastHeadingNumber) {
      for (let i = headingNumber; i > lastHeadingNumber; i--) {
        titleNumbers.push(1)
      }
    } else {
      for (let i = headingNumber; i < lastHeadingNumber; i++) {
        titleNumbers.pop()
      }
      titleNumbers[titleNumbers.length - 1]++
    }

    const title = heading.innerText
    heading.innerText = `${titleNumbers.join('.')} ${title}`
    heading.id = title.toLowerCase().replace(/ /g, '-')
    lastHeadingNumber = headingNumber
  }
})
</script>

<style scoped>
@reference "../style.css";

.dynamic {
  float: right;
  margin: 0 0 1rem 1rem;
  shape-outside: inset(0);
  clip-path: inset(0);
}

h2 {
  font-size: large;
  font-weight: bold;
}

h3 {
  font-size: larger;
  padding-left: 5px;
}

h2 + p {
  padding-left: 10px;
}

h3 + p {
  padding-left: 15px;
}

a.link {
  @apply text-blue-700 underline visited:text-purple-700;
}
a sup {
  @apply text-blue-700 visited:text-purple-700;
}
</style>
