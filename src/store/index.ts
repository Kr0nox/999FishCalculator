import { getChances, type CheckedItems, type Configuration } from '@/fishcalc'
import { getTimeToBite } from '@/math/BiteTime'
import { getChestChance } from '@/math/ChestChance'
import { strategyFactory } from '@/math/Strategy'
import type { Tackle, Bait, Location, Season, Time, Fish } from '@/model'
import { checkIdEquality } from '@/model/Fish'
import { getCalculatorLocation } from '@/model/location'
import { timeToNumber } from '@/model/time'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const store = defineStore('store', () => {
  const location = ref<Location>({ location: 'Beach', subLocation: 'Default' })
  const season = ref<Season>('Spring')
  const startTime = ref<Time>({ hour: 6, minute: 0 })
  const endTime = ref<Time>({ hour: 25, minute: 50 })
  const bait = ref<Bait>({ name: 'Deluxe' })
  const tackles = ref<Tackle[]>(['Dressed Spinner', 'Dressed Spinner'])

  const fishingLevel = ref(10)
  const luck = ref(0)
  const depth = ref(5)
  const raining = ref(false)
  const squidFest = ref(false)
  const troutDerby = ref(false)
  const extendedFamily = ref(false)
  const pirateProfession = ref(true)

  const checkedItems = computed<CheckedItems>(() => ({
    isCuriosityLureActive: tackles.value.includes('Curiosity Lure'),
    isExtendedFamilyActive: extendedFamily.value,
    isRaining: raining.value,
    isTroutDerbyActive: troutDerby.value,
    isSquidFestActive: squidFest.value,
    isUsingTargetedBait: bait.value.name === 'Targeted',
    isUsingTrainingRod: false
  }))
  const calculatorLocation = computed(() => getCalculatorLocation(location.value))
  const calculatorConfiguration = computed<Configuration>(() => ({
    targetedBaitName: bait.value.name === 'Targeted' ? bait.value.fish : '',
    checkedItems: checkedItems.value,
    dailyLuck: 0,
    selectedSeason: bait.value.name == 'Magic' ? 'MagicBait' : season.value.toLowerCase(),
    selectedLocation: calculatorLocation.value.location,
    selectedSubArea: calculatorLocation.value.subLocation,
    selectedMineArea: calculatorLocation.value.mineArea,
    selectedBobberLocation: calculatorLocation.value.bobberArea,
    fishingLevel: fishingLevel.value,
    waterDepth: depth.value,
    luckBuffs: luck.value,
    startTime: timeToNumber(startTime.value),
    endTime: timeToNumber(endTime.value)
  }))

  const timeToBite = computed(() => getTimeToBite(tackles.value, fishingLevel.value, bait.value))
  const castingOverhead = ref(5)
  const catchTime = ref(8)

  const chestChance = computed(() =>
    getChestChance(tackles.value, bait.value, luck.value, pirateProfession.value)
  )

  const cancelChests = ref(false)
  const chestCancelTime = ref(5)
  const cancelOtherFish = ref(false)
  const cancelOtherFishTime = ref(2)
  const prioritisedFish = ref<Fish[]>([])

  const results = computed(() => getChances(calculatorConfiguration.value))

  const prioritisedChanceFish = computed(() =>
    prioritisedFish.value.map(
      (f) => results.value.find((r) => checkIdEquality(f.Id, r.Id)) ?? { ...f, finalChance: 0 }
    )
  )

  const strategy = computed(() =>
    strategyFactory(
      catchTime.value,
      timeToBite.value,
      castingOverhead.value,
      cancelChests.value ? { cancelTime: chestCancelTime.value, chestChance: 0.5 } : undefined,
      cancelOtherFish.value
        ? {
            cancelTime: cancelOtherFishTime.value,
            prioritisedFish: prioritisedChanceFish.value
          }
        : undefined
    )
  )

  return {
    results,
    prioritisedFish,
    chestChance,
    strategy,
    cancelChests,
    chestCancelTime,
    cancelOtherFish,
    cancelOtherFishTime,
    location,
    season,
    startTime,
    endTime,
    bait,
    tackles,
    fishingLevel,
    luck,
    pirateProfession,
    depth,
    raining,
    squidFest,
    troutDerby,
    extendedFamily,
    calculatorConfiguration,
    timeToBite,
    castingOverhead,
    catchTime
  }
})
