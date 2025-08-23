<template>
  <ContainerComponent class="w-full bg-slate-100 p-2!">
    <div class="flex flex-col gap-2 md:max-h-full md:overflow-auto">
      <div class="flex items-center gap-2">
        <RouterLink :to="{ name: 'Main' }"
          ><ContainerComponent class="px-1! py-0!">
            <FontAwesomeIcon :icon="faArrowLeft" /> Back
          </ContainerComponent></RouterLink
        >
        <h1 class="text-2xl font-bold">Math Explained</h1>
      </div>
      <main>
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
            - <i>Deluxe Bait</i>: 67% (Multiplier: <MathRenderer term="m_bait=0.33" />) <br />
            - <i>Wild Bait</i> and <i>Challenge Bait</i>: 62.5% (Multiplier:
            <MathRenderer term="m_bait=0.375" />)
            <br />
            - <i>Magic Bait</i>, <i>Targeted Bait</i> and <i>Magnet</i>: 50% (Multiplier:
            <MathRenderer term="m_bait=0.5" />) <br /><br />

            In the end we have: <br />
            <MathRenderer term="TTB_min=0.6 * 0.75 * m_bait" /> <br />
            <MathRenderer term="TTB_max=(0.6 - 10*#DS - 0.25*lvl) * 0.75 * m_bait" /> <br />
            The actual bite time is uniformly distributed in this range, so the average bite time is
            determined by the arithmetic mean: <MathRenderer term="TTB=(TTB_min + TTB_max) / 2" />
            <a href="https://stardewvalleywiki.com/Fishing#Fish_Bite_Time"><sup>[Wiki]</sup></a>
            <br />
            Code:
            <a
              class="link"
              href="https://github.com/Kr0nox/999FishCalculator/blob/main/src/math/BiteTime.ts"
              ><FontAwesomeIcon :icon="faGithub" />BiteTime.ts</a
            >
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
            to get a chance at a given time. We call this <MathRenderer term="P_fish(fish,time)" />
            <br />
            In single time mode this number is the chance displayed. <br />
            Time can be a number between 600 (6 AM) and 2600 (2 AM). Every 100 a new hour begins. As
            fish chances change on the full hour, we only need to get chances at the full hour, not
            every minute in the range. <br />
            We then sum up the chances at every full hour in the range and divide this by the amount
            of hours in the range, to get <MathRenderer term="P_fish(fish,start,end)" />. <br />
            For simplicity we annotate the probability with <MathRenderer term="P_fish" /> and have
            the times and fish type implicitly. <br />

            Code:
            <a
              class="link"
              href="https://github.com/Kr0nox/999FishCalculator/blob/main/src/fishcalc/index.ts#L494-L542"
              ><FontAwesomeIcon :icon="faGithub" />function getChance</a
            >
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
            modifiers. <br />
            Code:
            <a
              class="link"
              href="https://github.com/Kr0nox/999FishCalculator/blob/main/src/math/Quality.ts"
              ><FontAwesomeIcon :icon="faGithub" />Quality.ts</a
            >
          </p>

          <h2>Chests</h2>
          <p>
            We have a base chance of <MathRenderer term="P_chest=0.15" />. <br />
            The special charm increases this by 1.25%, to <MathRenderer term="P_chest=0.1625" />.
            <br />
            Each treasure tackle adds another 5%. <br />
            Each level of luck added by foods/drinks gives us 0.5% extra. Daily luck has an effect
            of up to 5% in each direction. If we fish on enough different days, this number should
            amortize towards 0% and thus is not included in our calculations. <br />
            This gives us <MathRenderer term="P_chest=0.1625 + #TH*0.05 + luck * 0.005" />
            <br /><br />

            Using the Pirate Profession could add another 15%. Lets annotate the bonus with
            <MathRenderer term="B_pirate" /> which is 0.15 when using the Pirate Profession and 0
            when not. <br />
            Using <i>Magnets</i> could add another 15%. Lets annotate the bonus with
            <MathRenderer term="B_magnet" /> which is 0.15 when using the Pirate Profession and 0
            when not. <br />
            This gives us
            <MathRenderer term="P_chest=0.1625 + #TH*0.05 + luck * 0.005 + B_pirate + B_magnet" />
            <a href="https://stardewvalleywiki.com/Fishing#Treasure_Chests"><sup>[Wiki]</sup></a>
            <br />

            Code:
            <a
              class="link"
              href="https://github.com/Kr0nox/999FishCalculator/blob/main/src/math/ChestChance.ts"
              ><FontAwesomeIcon :icon="faGithub" />ChestChance.ts</a
            >
          </p>
          <h3>Time per Chest and Roe</h3>
          <p>
            This is dependent on the used strategy. See
            <a class="link" href="#strategies">Strategies</a> for more.
          </p>

          <h2>Strategies</h2>
          <p>
            For the result we first calculate the average time per cast
            <MathRenderer term="T" /> for the relevant method. <br />
            From this we can then calculate how long we need till we caught the fish at least once
            and how likely we hook it with a chest. <br />
            We differentiate into four different cases/methods: <br />
            - Catching every fish, regardless whether it has a chest or is a desired type <br />
            - Canceling when there is no chest after <MathRenderer term="T_chancelChest" /> seconds
            <br />
            - Canceling when the fish is not a desired one after
            <MathRenderer term="T_chancelFish" /> seconds <br />
            - Canceling when the fish is not a desired one, or if it is, if there is no chest some
            time <br />
            Code:
            <a
              class="link"
              href="https://github.com/Kr0nox/999FishCalculator/blob/main/src/math/Strategy.ts"
              ><FontAwesomeIcon :icon="faGithub" />Strategy.ts</a
            >
          </p>
          <h3>No Canceling</h3>
          <p>
            Every catch process takes the same time, so <MathRenderer term="T=T_catch+TTB+T_cast" />
          </p>
          <h3>Canceling when no chest</h3>
          <p>
            Lets divide these into two parts: When there is a chest and when there is no chest.
            <br />
            If there is a chest, we do the normal catch process, so
            <MathRenderer term="T_withChest=T_catch+TTB+T_cast" /> <br />
            If there is no chest, we cancel after the given time, so
            <MathRenderer term="T_noChest=T_cancelChest+TTB+T_cast" /> <br />
            Applying the chances for each, we result in
            <MathRenderer term="T=P_chest*T_withChest+(1-P_chest)*T_noChest" />.
          </p>
          <h3>Canceling when wrong fish</h3>
          <p>
            Lets first annotate the sum of probabilities for all the fish we want to catch with
            <MathRenderer term="P_desired" />. <br />
            Lets divide these into two parts: When we hook a desired fish and when its another fish.
            <br />
            If we hook a desired fish, we do the normal catch process, so
            <MathRenderer term="T_withDesired=T_catch+TTB+T_cast" /> <br />
            If we hook another fish, we cancel after the given time, so
            <MathRenderer term="T_notDesired=T_cancelFish+TTB+T_cast" /> <br />
            Applying the chances for each, we result in
            <MathRenderer term="T=P_desired*T_withDesired+(1-P_desired)*T_notDesired" />.
          </p>
          <h3>Canceling on both cases</h3>
          <p>
            Lets first annotate the sum of probabilities for all the fish we want to catch with
            <MathRenderer term="P_desired" /> again. <br />
            Here we divide into four options: The combinations of having a desired fish or another
            one and having a chest or not. <br />
            Case desired with chest: Full catch, so
            <MathRenderer term="T_withBoth=T_catch+TTB+T_cast" /> <br />
            Case desired without chest: Cancel after chest time limit:
            <MathRenderer term="T_noChest=T_cancelChest+TTB+T_cast" /> <br />
            Case other fish with chest: Cancel after the fish time limit:
            <MathRenderer term="T_notDesired=T_cancelFish+TTB+T_cast" /> <br />
            Case other fish and no chest: Cancel after the shorter time limit is reached:
            <MathRenderer term="T_withoutBoth=min(T_cancelFish,T_cancelChest)+TTB+T_cast" /> <br />
            This leaves us with the result:
            <MathRenderer
              term="
              P_desired*P_chest*T_withBoth +
              P_desired*(1-P_chest)*T_noChest +
              (1-P_desired)*P_chest*T_notDesired +
              (1-P_desired)*(1-P_chest)*T_withoutBoth
              "
            />
          </p>
          <h3>Time per Fish</h3>
          <p>
            For a fish, with <MathRenderer term="P_fish" /> we now want to find out how often we
            catch it. This is given with the seconds per catch of this fish
            <MathRenderer term="T_fish" />. <br />
            This time will vary per Strategy: <br />
            No canceling: <MathRenderer term="T_fish=T/P_fish" /> <br />
            Canceling no chest: <MathRenderer term="T_fish=T/(P_fish*P_chest)" /> <br />
            Canceling other fish: If the fish is it not desired, it will never be caught. If it is
            desired: <MathRenderer term="T_fish/P_fish" /> <br />
            Canceling both cases: If the fish is it not desired, it will never be caught. If it is
            desired: <MathRenderer term="T_fish/(P_fish*P_chest)" /> <br /><br />
            Due to bait the actual number of fish may vary: <br />
            When using <i>Challenge Bait</i> we divide this time by 3:
            <MathRenderer term="T_fishBait=T_fish/3" /> <br />
            When using <i>Wild Bait</i> we divide this by 1.25:
            <MathRenderer term="T_fishBait=T_fish/1.25" /> <br />
            Otherwise <MathRenderer term="T_fishBait=T_fish" /> <br />
            The time per stack is 999 times the bait time:
            <MathRenderer term="T_fishStack=T_fishBait*999" />
          </p>
          <h3>Time per Chest and Roe</h3>
          <p>
            We do not calculate the general time per chest or roe, but the chance we get a chest or
            some roe, with a specific fish. The time for a chest to be caught with a specific fish
            <MathRenderer term="T_chestOnFish" />, depends on whether we cancel on no chest. <br />
            If we cancel: <MathRenderer term="T_chestOnFish=T_fish" /> <br />
            If we do not cancel: <MathRenderer term="T_chestOnFish=T_fish/P_chest" /> <br /><br />

            Since roe always has a 25% chance of appearing, regardless of depth or normal or golden
            chest, we just multiply the chest time with 4 to get the time per roe chest:
            <MathRenderer term="T_chestWithRoe=T_chestOnFish*4" /> <br />
            Each chest has 1 to 6 roe, with an average of 3.5. This means the time for a single roe
            of a fish type is: <MathRenderer term="T_roeOfFish=T_chestWithRoe/3.5" /> <br />
            The time for a stack of roe is 999 times the roe time:
            <MathRenderer term="T_roeStack=T_roeOfFish*999" />
          </p>
        </div>
      </main>
      <RouterLink :to="{ name: 'Main' }"
        ><ContainerComponent class="w-fit px-1! py-0!">
          <FontAwesomeIcon :icon="faArrowLeft" /> Back
        </ContainerComponent></RouterLink
      >
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '@/components/ContainerComponent.vue'
import MathRenderer from '@/components/math/MathRenderer.vue'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
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
  font-size: larger;
  font-weight: bold;
}

h3 {
  font-size: large;
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
