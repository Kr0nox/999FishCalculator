import {
  getJellyChance,
  nonFishItems,
  rollFishPool,
  rollFishPoolWithTargetedBait,
  targetedBaitSingle
} from './lib/calculateChance.ts'
import { getFishParameters } from './lib/fishdata.ts'
import { getFishFromLocationAndSeason } from './lib/locationdata.ts'
import type {
  AppendedFish,
  BobberArea,
  CalcFish,
  CalcFishKey,
  CalcLocationKey,
  CalcSeason
} from './types.ts'

export interface CheckedItems {
  isCuriosityLureActive: boolean
  isExtendedFamilyActive: boolean
  isRaining: boolean
  isTroutDerbyActive: boolean
  isSquidFestActive: boolean
  isUsingTrainingRod: boolean
  isUsingTargetedBait: boolean
}
interface TimeLessConfiguration {
  targetedBaitName: string
  checkedItems: CheckedItems
  dailyLuck: number
  selectedSeason: CalcSeason
  selectedLocation: CalcLocationKey
  selectedSubArea: string
  selectedMineArea: string
  selectedBobberLocation: string
  fishingLevel: number
  waterDepth: number
  luckBuffs: number
}

interface InternalConfiguration extends TimeLessConfiguration {
  timeOfDay: number
}

export interface Configuration extends TimeLessConfiguration {
  startTime: number
  endTime: number
}

function getAppendedFishData(locationFishData: CalcFish[]): AppendedFish[] {
  const tempFishParamArray: AppendedFish[] = []
  for (const i in locationFishData) {
    const fish = locationFishData[i]
    if (nonFishItems.includes(fish.Id) || fish.Id.includes('(F)')) {
      const newFish = { ...fish } as AppendedFish
      switch (fish.Id) {
        case '(O)821':
          newFish.displayname = 'Fossilized Spine'
          break
        case '(O)825':
          newFish.displayname = 'Snake Skull'
          break
        case '(O)797':
          newFish.displayname = 'Pearl'
          break
        case '(F)2332':
          newFish.displayname = 'Gourmand Statue'
          break
        case '(F)2425':
          newFish.displayname = 'Wall Basket'
          break
      }
      tempFishParamArray.push(newFish)
      continue
    }
    if (!fish.Id || !fish.Id.match(/(\d+|Goby)/)) {
      if (fish.Id && fish.Id.match(/Jelly/)) {
        const newFish = { ...fish } as AppendedFish
        newFish.name = fish.Id.substring(3, fish.Id.length - 5) + ' Jelly'
        newFish.displayname = newFish.name
        newFish.weight = 0
        tempFishParamArray.push(newFish)
      }
      continue
    }
    const newParams = getFishParameters(fish.Id.match(/(\d+|Goby)/)![0] as CalcFishKey)
    const mergedParams = { ...fish, ...newParams } as AppendedFish
    // name required as is for targeted bait, separate the parameters so displayname can be anything you want without interfering with targeted bait calculation
    mergedParams.displayname = mergedParams.name
    tempFishParamArray.push(mergedParams)
  }
  return tempFishParamArray
}

function deepEqual(a?: BobberArea, b?: BobberArea) {
  if (!a || !b) return false
  return a.X == b.X && a.Y == b.Y && a.Width == b.Width && a.Height == b.Height
}

export function getFilteredFishData(c: InternalConfiguration, appendedFishData: AppendedFish[]) {
  const checkedItems = c.checkedItems
  const selectedSeason = c.selectedSeason
  const selectedSubArea = c.selectedSubArea
  const fishingLevel = c.fishingLevel
  const waterDepth = c.waterDepth
  const timeOfDay = c.timeOfDay
  const selectedBobberArea = c.selectedBobberLocation
  let tempFishParamArray = appendedFishData.slice()

  // filter sub area, skip, cause no sub area
  const correctSubArea = tempFishParamArray.filter(
    (fish) => selectedSubArea == null || !fish.FishAreaId || fish.FishAreaId === selectedSubArea
  )
  tempFishParamArray = correctSubArea

  // filter bobber position, skip cause no bobber area
  const bobberDictionary: Record<string, BobberArea> = {
    Waterfall: { X: 51, Y: 100, Width: 15, Height: 255 },
    SubmarinePier: { X: 0, Y: 32, Width: 12, Height: 255 }
  }
  const filterBobber = tempFishParamArray.filter(
    (fish) =>
      !fish.BobberPosition || deepEqual(bobberDictionary[selectedBobberArea], fish.BobberPosition)
  )
  tempFishParamArray = filterBobber

  // filter player position for now, flex tape
  const noPlayerPosition = tempFishParamArray.filter(
    (fish) =>
      fish.PlayerPosition === null ||
      (fish.Condition && fish.Condition.includes('LEGENDARY_FAMILY'))
  )
  tempFishParamArray = noPlayerPosition

  // also flex tape, filter PLAYER_HAS_MAIL for now
  const noPlayerMailCondition = tempFishParamArray.filter(
    (fish) => !fish.Condition || !fish.Condition.includes('PLAYER_HAS_MAIL')
  )
  tempFishParamArray = noPlayerMailCondition

  // filter extended family
  if (!checkedItems.isExtendedFamilyActive) {
    const noExtendedFamily = tempFishParamArray.filter(
      (fish) => !fish.Condition || !fish.Condition.includes('LEGENDARY_FAMILY')
    )
    tempFishParamArray = noExtendedFamily
  }

  // filter training rod
  if (checkedItems.isUsingTrainingRod && selectedSeason != 'MagicBait') {
    const setDifficultyCeiling = tempFishParamArray.filter(
      (fish) => !fish.difficulty || fish.difficulty < 50
    )
    tempFishParamArray = setDifficultyCeiling
  }

  // filter fishing level requirements
  const fishingHighEnough = tempFishParamArray.filter(
    (fish) =>
      (!fish.requiredLevel ||
        fish.IgnoreFishDataRequirements ||
        fish.requiredLevel <= fishingLevel) &&
      fish.MinFishingLevel <= fishingLevel
  )
  tempFishParamArray = fishingHighEnough

  // filter raining
  if (selectedSeason != 'MagicBait') {
    if (checkedItems.isRaining) {
      const raining = tempFishParamArray.filter(
        (fish) => !(fish.weather == 'sunny') || fish.IgnoreFishDataRequirements
      )
      tempFishParamArray = raining
    } else {
      const sunny = tempFishParamArray.filter(
        (fish) => !(fish.weather == 'rainy') || fish.IgnoreFishDataRequirements
      )
      tempFishParamArray = sunny
    }
  }

  // filter shore distances
  const distance = tempFishParamArray.filter(
    (fish) =>
      (fish.MaxDistanceFromShore <= -1 || waterDepth <= fish.MaxDistanceFromShore) &&
      waterDepth >= fish.MinDistanceFromShore
  )
  tempFishParamArray = distance

  // trout derby
  // must be after raining and before time
  if (checkedItems.isTroutDerbyActive) {
    const rainbowTrout = appendedFishData.filter(
      (fish) => fish.Condition && fish.Condition.includes('TroutDerby')
    )
    if (rainbowTrout[0]) rainbowTrout[0].displayname = 'Rainbow Trout (from event)'
    tempFishParamArray.concat(rainbowTrout)
  } else {
    const noTroutDerbyTrout = tempFishParamArray.filter(
      (fish) => !fish.Condition || (fish.Condition && !fish.Condition.includes('TroutDerby'))
    )
    tempFishParamArray = noTroutDerbyTrout
  }

  // squid fest
  if (checkedItems.isSquidFestActive) {
    const squid = appendedFishData.filter(
      (fish) => fish.Condition && fish.Condition.includes('SquidFest')
    )

    // squid time
    for (const i in squid) {
      const squidCondition = squid[i].Condition
      if (squidCondition && squidCondition.includes('TIME')) {
        const timeArray = squidCondition.split(' ')
        const timeIndex = timeArray.findIndex((e: string) => e == 'TIME')
        const newTime = [Number(timeArray[timeIndex + 1]), Number(timeArray[timeIndex + 2])]
        squid[i].time = newTime
        break
      } else {
        squid[i].time = [600, 600]
      }
    }
    for (const i in squid) {
      if (squid[i]) squid[i].displayname = 'Squid (from event)'
    }
    tempFishParamArray.concat(squid)
  } else {
    const noSquidFestSquid = tempFishParamArray.filter(
      (fish) => !fish.Condition || (fish.Condition && !fish.Condition.includes('SquidFest'))
    )
    tempFishParamArray = noSquidFestSquid
  }

  // filter times
  if (selectedSeason != 'MagicBait') {
    const timeFilter = tempFishParamArray.filter(
      (fish) =>
        !fish.time ||
        (fish.IgnoreFishDataRequirements &&
          (!fish.Condition || !fish.Condition.includes('TIME'))) ||
        // single window fish
        (fish.time[0] <= timeOfDay && fish.time[1] > timeOfDay) ||
        // double window fish
        (fish.time.length == 4 && fish.time[2] <= timeOfDay && fish.time[3] > timeOfDay)
    )
    tempFishParamArray = timeFilter
  }

  return tempFishParamArray
}

export interface CalculatorResults {
  Id: string
  displayname: string
  finalChance: number
}

export function getChance(
  filteredFishData: AppendedFish[],
  c: InternalConfiguration
): CalculatorResults[] {
  const checkedItems = c.checkedItems
  const luckBuffs = c.luckBuffs
  const selectedSeason = c.selectedSeason
  const targetedBaitName = c.targetedBaitName
  const selectedLocation = c.selectedLocation
  const selectedMineArea = c.selectedMineArea
  const waterDepth = c.waterDepth
  const fishingLevel = c.fishingLevel
  const dailyLuck = c.dailyLuck

  const jellyMode = 'longterm'

  let tempFishParamArray: CalculatorResults[] = []
  let tempTrashRate = 1

  for (const i in filteredFishData) {
    const fish = filteredFishData[i]
    if (fish.Id && !fish.Id.match(/Jelly/)) {
      fish['weight'] = calculateWeight(fish)
    }
  }

  // get jelly chance
  const jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
  if (jellyMode === 'longterm') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    jelly && (jelly.weight = getJellyChance(filteredFishData, luckBuffs))
  } else if (jellyMode === 'nextcatch') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    jelly && (jelly.weight = jelly.Chance + jelly.ChanceBoostPerLuckLevel * luckBuffs)
  } else if (jellyMode === 'goodseed') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    jelly && (jelly.weight = 1)
  } else if (jellyMode === 'badseed') {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    jelly && (jelly.weight = 0)
  }

  if (filteredFishData.length > 0) {
    // get chance
    if (checkedItems.isUsingTargetedBait && selectedSeason != 'MagicBait') {
      const nonTargetedFish = filteredFishData.filter(
        (fish) => !fish.name || fish.name != targetedBaitName
      )
      const targetedFish = filteredFishData.filter(
        (fish) => fish.name && fish.name == targetedBaitName
      )
      const targetedBait = targetedBaitSingle(nonTargetedFish, targetedFish)
      tempTrashRate = targetedBait.caseAChance
      //setTrashRate(tempTrashRate);

      for (let i = 0; i < nonTargetedFish.length; i++) {
        const fish = nonTargetedFish[i]
        const newFish = {
          Id: fish.Id,
          displayname: fish.displayname,
          finalChance: rollFishPoolWithTargetedBait(targetedBait, nonTargetedFish, i)
        }
        tempFishParamArray.push(newFish)
      }

      if (targetedFish.length > 1) {
        const fish = {
          Id: targetedFish[0].Id,
          displayname: targetedBaitName + ' (multiple entries)',
          finalChance: targetedBait.caseCChance
        }
        tempFishParamArray.push(fish)
      } else {
        for (const i in targetedFish) {
          const fish = targetedFish[i]
          const newFish = {
            Id: fish.Id,
            displayname: fish.displayname,
            finalChance: targetedBait.caseCChance
          }
          tempFishParamArray.push(newFish)
        }
      }
    } else {
      for (let i = 0; i < filteredFishData.length; i++) {
        const fish = filteredFishData[i]
        const newFish = {
          Id: fish.Id,
          displayname: fish.displayname,
          finalChance: rollFishPool(filteredFishData, i)
        }
        tempTrashRate -= newFish.finalChance
        tempFishParamArray.push(newFish)
      }
      tempTrashRate = Math.max(0, tempTrashRate)
      //setTrashRate(Math.max(0, tempTrashRate));
    }

    // handle OR fish (like submarine pier)
    const orFish: CalculatorResults[] = []
    for (const i in tempFishParamArray) {
      const fish = tempFishParamArray[i]
      if (fish.Id.includes('|')) {
        const orFishId = fish.Id.split('|')
        fish.finalChance /= orFishId.length
        for (const j in orFishId) {
          const newParams = getFishParameters(
            (orFishId[j].match(/(\d+|Goby)/)?.[0] ?? '') as CalcFishKey
          )
          if (!newParams) {
            throw 'Could not find fish parameters for ' + orFishId[j]
          }
          const mergedParams = { ...fish, ...newParams }
          mergedParams.Id = orFishId[j]
          mergedParams.displayname = mergedParams.name
          orFish.push(mergedParams)
        }
      } else {
        orFish.push(fish)
      }
    }
    tempFishParamArray = orFish

    // handle UndergroundMine
    if (selectedLocation == 'UndergroundMine') {
      let caveJellyChance = 0
      let floorFishChance = 0
      if (!checkedItems.isUsingTrainingRod) {
        let chanceMultiplier = 1
        chanceMultiplier += 0.4 * fishingLevel
        chanceMultiplier += 0.1 * waterDepth
        chanceMultiplier += checkedItems.isCuriosityLureActive ? 5 : 0
        const mineFish: { Id: string | null; displayname: string | null; finalChance: number } = {
          Id: null,
          displayname: null,
          finalChance: 0
        }
        switch (selectedMineArea) {
          case '20':
            chanceMultiplier +=
              checkedItems.isUsingTargetedBait && targetedBaitName == 'Stonefish' ? 10 : 0
            floorFishChance = 0.02 + 0.01 * chanceMultiplier
            mineFish['Id'] = '(O)158'
            mineFish['displayname'] = 'Stonefish'
            mineFish['finalChance'] = floorFishChance
            break
          case '60':
            chanceMultiplier +=
              checkedItems.isUsingTargetedBait && targetedBaitName == 'Ice Pip' ? 10 : 0
            floorFishChance = 0.015 + 0.009 * chanceMultiplier
            mineFish['Id'] = '(O)161'
            mineFish['displayname'] = 'Ice Pip'
            mineFish['finalChance'] = floorFishChance
            break
          case '100':
            chanceMultiplier +=
              checkedItems.isUsingTargetedBait && targetedBaitName == 'Lava Eel' ? 10 : 0
            floorFishChance = 0.01 + 0.008 * chanceMultiplier
            mineFish['Id'] = '(O)162'
            mineFish['displayname'] = 'Lava Eel'
            mineFish['finalChance'] = floorFishChance
            caveJellyChance = 0.05 + 0.05 * luckBuffs
            break
          default:
            throw 'unknown mine area: ' + selectedMineArea
        }
        if (selectedMineArea == '100') {
          const mineFishArray = []
          mineFishArray.push(mineFish)
          const caveJelly = {
            Id: '(O)CaveJelly',
            displayname: 'Cave Jelly',
            finalChance: caveJellyChance * (1 - floorFishChance)
          }
          mineFishArray.push(caveJelly)
          tempFishParamArray = mineFishArray as CalculatorResults[]
          tempTrashRate = 1 - floorFishChance - caveJellyChance
        } else {
          for (const i in tempFishParamArray) {
            tempFishParamArray[i]['finalChance'] *= 1 - floorFishChance
          }
          tempFishParamArray.push(mineFish as CalculatorResults)
          tempTrashRate = tempTrashRate * (1 - floorFishChance)
        }
      } else {
        tempFishParamArray = []
        tempTrashRate = 1
      }
    }

    if (tempTrashRate >= 0.00005) {
      tempFishParamArray.push({
        Id: 'trash',
        displayname: 'Trash',
        finalChance: tempTrashRate
      })
    }
    return tempFishParamArray
  } else {
    return []
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

export function getChances(configuration: Configuration) {
  const chances: Record<string, CalculatorResults[]> = {}

  const appendedFishData = getAppendedFishData(
    getFishFromLocationAndSeason(configuration.selectedLocation, configuration.selectedSeason)
  )
  let divisor = 0
  if (configuration.selectedSeason == 'MagicBait') {
    const c = { ...configuration, timeOfDay: 600 }
    const magicChances = getChance(getFilteredFishData(c, appendedFishData), c)
    for (const fish of magicChances) {
      if (!chances[fish.Id]) {
        chances[fish.Id] = []
      }
      chances[fish.Id].push(fish)
    }
    divisor = 1
  } else {
    const endTime =
      configuration.startTime == configuration.endTime
        ? configuration.startTime + 1
        : configuration.endTime
    for (let t = configuration.startTime; t < endTime; t += 100) {
      const c = { ...configuration, timeOfDay: t }
      const timeChances = getChance(getFilteredFishData(c, appendedFishData), c)
      for (const fish of timeChances) {
        if (!chances[fish.Id]) {
          chances[fish.Id] = []
        }
        chances[fish.Id].push(fish)
      }
      divisor++
    }
  }

  const finalChances: CalculatorResults[] = []
  for (const [id, fishChances] of Object.entries(chances)) {
    const totalChance = fishChances.reduce((sum, fish) => sum + fish.finalChance, 0)
    const averageChance = totalChance / divisor
    finalChances.push({
      Id: id,
      displayname: fishChances[0].displayname,
      finalChance: averageChance
    })
  }
  return finalChances
    .filter((f) => f.finalChance >= 0.00005)
    .sort((a, b) => b.finalChance - a.finalChance)
}
