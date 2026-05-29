import { getFilteredFishData, type CalculatorResults, type InternalConfiguration } from './index'
import type { AppendedFish } from './types'

interface CountedFish extends CalculatorResults {
  weight: number
  count: number
  Precedence: number
}

export function simulate(
  fish: AppendedFish[],
  configuration: InternalConfiguration,
  simCount = 10000
): CalculatorResults[] {
  const checkedItems = configuration.checkedItems
  const luckBuffs = configuration.luckBuffs
  const selectedSeason = configuration.selectedSeason
  const targetedBaitName = configuration.targetedBaitName
  // const selectedLocation = configuration.selectedLocation
  // const selectedMineArea = configuration.selectedMineArea
  const waterDepth = configuration.waterDepth
  const fishingLevel = configuration.fishingLevel
  const dailyLuck = configuration.dailyLuck

  const filteredFishData = getFilteredFishData(configuration, fish)

  for (const i in filteredFishData) {
    const fish = filteredFishData[i]
    if (fish.Id && !fish.Id.match(/Jelly/)) {
      fish['weight'] = calculateWeight(fish)
    }
  }

  // get jelly chance
  const jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
  if (jelly) {
    jelly.weight = jelly.Chance + jelly.ChanceBoostPerLuckLevel * luckBuffs
  }

  const countedFish: CountedFish[] = filteredFishData.map((f) => ({
    ...f,
    count: 0,
    finalChance: 0
  }))

  const trash: CountedFish = {
    Id: 'trash',
    displayname: 'Trash',
    weight: -1,
    count: 0,
    finalChance: 0,
    Precedence: -1
  }
  for (let i = 0; i < simCount; i++) {
    const r = run()
    if (r) {
      r.count++
    }
  }
  countedFish.push(trash)

  for (const fish of countedFish) {
    fish.finalChance = fish.count / simCount
  }
  return countedFish

  function run(): CountedFish | undefined {
    sort(countedFish)
    if (targetedBaitName && checkedItems.isUsingTargetedBait && selectedSeason != 'MagicBait') {
      return runTargeted()
    } else {
      return runNonTargeted()
    }
  }

  function runNonTargeted(): CountedFish | undefined {
    for (const fish of countedFish) {
      const roll = Math.random()
      if ((fish.weight || 0) > roll) {
        return fish
      }
    }
  }

  function runTargeted(): CountedFish | undefined {
    let firstCaughtFish: CountedFish | null = null
    let tries = 0
    for (let i = 0; i < 2; i++) {
      for (const fish of countedFish) {
        const roll = Math.random()
        if ((fish.weight || 0) > roll) {
          if (tries >= 2) {
            return fish
          }
          if (fish.displayname === targetedBaitName) {
            return fish
          }
          if (!firstCaughtFish) {
            firstCaughtFish = fish
          }

          tries++
        }
      }
    }
  }

  function sort<T extends { Precedence: number }>(a: T[]) {
    return a.sort((a, b) => {
      if (a.Precedence == b.Precedence) return Math.random() - 0.5
      return a.Precedence - b.Precedence
    })
  }

  function calculateWeight(fish: AppendedFish) {
    let chanceFromFishData = 0
    if (!fish.IgnoreFishDataRequirements && fish.baseRate) {
      chanceFromFishData = fish.baseRate
      chanceFromFishData *= 1 - Math.max(0, fish.maxDepth - waterDepth) * fish.depthMultiplier
      chanceFromFishData += 0.02 * fishingLevel
      if (checkedItems.isUsingTrainingRod && selectedSeason != 'MagicBait') {
        chanceFromFishData *= 1.1
      }
      chanceFromFishData = Math.min(chanceFromFishData, 0.9)
      if (checkedItems.isCuriosityLureActive && chanceFromFishData < 0.25) {
        if (fish.CuriosityLureBuff > -1) {
          chanceFromFishData += fish.CuriosityLureBuff
        } else {
          chanceFromFishData = 0.68 * chanceFromFishData + 0.085
        }
      }
      if (
        targetedBaitName == fish.name &&
        checkedItems.isUsingTargetedBait &&
        selectedSeason != 'MagicBait'
      ) {
        chanceFromFishData *= 1.66
      }
      if (fish.ApplyDailyLuck) {
        chanceFromFishData += dailyLuck
      }
    } else {
      chanceFromFishData = 1
    }

    let chanceFromLocationData = fish.Chance
    if (checkedItems.isCuriosityLureActive) {
      if (fish.CuriosityLureBuff > 0) {
        chanceFromLocationData += fish.CuriosityLureBuff
      }
    }
    if (
      targetedBaitName === fish.name &&
      checkedItems.isUsingTargetedBait &&
      selectedSeason != 'MagicBait'
    ) {
      chanceFromLocationData *= fish.SpecificBaitMultiplier
      chanceFromLocationData += fish.SpecificBaitBuff
    }
    if (fish.ApplyDailyLuck) {
      chanceFromLocationData += dailyLuck
    }

    chanceFromFishData = Math.min(1, Math.max(0, chanceFromFishData))
    chanceFromLocationData = Math.min(1, Math.max(0, chanceFromLocationData))
    return chanceFromFishData * chanceFromLocationData
  }
}
