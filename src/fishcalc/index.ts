/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  getJellyChance,
  nonFishItems,
  rollFishPoolWithTargetedBait,
  targetedBaitSingle
} from './lib/calculateChance.ts'
import { getFishParameters } from './lib/fishdata.ts'
import { getFishFromLocationAndSeason } from './lib/locationdata.ts'

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
  selectedSeason: string
  selectedLocation: string
  selectedSubArea: string
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

function getAppendedFishData(locationFishData: any[]) {
  let tempFishParamArray: any[] = []
  for (let i in locationFishData) {
    let fish = locationFishData[i]
    if (nonFishItems.includes(fish.Id) || fish.Id.includes('(F)')) {
      switch (fish.Id) {
        case '(O)821':
          fish.displayname = 'Fossilized Spine'
          break
        case '(O)825':
          fish.displayname = 'Snake Skull'
          break
        case '(O)797':
          fish.displayname = 'Pearl'
          break
        case '(F)2332':
          fish.displayname = 'Gourmand Statue'
          break
        case '(F)2425':
          fish.displayname = 'Wall Basket'
          break
      }
      tempFishParamArray.push(fish)
      continue
    }
    if (!fish.Id || !fish.Id.match(/(\d+|Goby)/)) {
      if (fish.Id && fish.Id.match(/Jelly/)) {
        fish.name = fish.Id.substring(3, fish.Id.length - 5) + ' Jelly'
        fish.displayname = fish.name
        fish.weight = 0
        tempFishParamArray.push(fish)
      }
      continue
    }
    const newParams = getFishParameters(fish.Id.match(/(\d+|Goby)/)[0])
    const mergedParams = { ...fish, ...newParams }
    // name required as is for targeted bait, separate the parameters so displayname can be anything you want without interfering with targeted bait calculation
    mergedParams.displayname = mergedParams.name
    tempFishParamArray.push(mergedParams)
  }
  return tempFishParamArray
}

export function getFilteredFishData(c: InternalConfiguration) {
  const checkedItems = c.checkedItems
  const selectedSeason = c.selectedSeason
  const selectedLocation = c.selectedLocation
  const selectedSubArea = c.selectedSubArea
  const fishingLevel = c.fishingLevel
  const waterDepth = c.waterDepth
  const timeOfDay = c.timeOfDay
  const appendedFishData = getAppendedFishData(
    getFishFromLocationAndSeason(selectedLocation, selectedSeason)
  )
  let tempFishParamArray = appendedFishData.slice()

  // filter sub area, skip, cause no sub area
  let correctSubArea = tempFishParamArray.filter(
    (fish) => selectedSubArea == null || !fish.FishAreaId || fish.FishAreaId === selectedSubArea
  )
  tempFishParamArray = correctSubArea

  // filter bobber position, skip cause no bobber area
  /*let bobberDictionary = {
    Waterfall: { X: 51, Y: 100, Width: 15, Height: 255 },
    SubmarinePier: { X: 0, Y: 32, Width: 12, Height: 255 },
  };*/
  let filterBobber = tempFishParamArray.filter(
    (fish) => !fish.BobberPosition /*||
      _.isEqual(bobberDictionary[selectedBobberArea], fish.BobberPosition)*/
  )
  tempFishParamArray = filterBobber

  // filter player position for now, flex tape
  let noPlayerPosition = tempFishParamArray.filter(
    (fish) =>
      fish.PlayerPosition === null ||
      (fish.Condition && fish.Condition.includes('LEGENDARY_FAMILY'))
  )
  tempFishParamArray = noPlayerPosition

  // also flex tape, filter PLAYER_HAS_MAIL for now
  let noPlayerMailCondition = tempFishParamArray.filter(
    (fish) => !fish.Condition || !fish.Condition.includes('PLAYER_HAS_MAIL')
  )
  tempFishParamArray = noPlayerMailCondition

  // filter extended family
  if (!checkedItems.isExtendedFamilyActive) {
    let noExtendedFamily = tempFishParamArray.filter(
      (fish) => !fish.Condition || !fish.Condition.includes('LEGENDARY_FAMILY')
    )
    tempFishParamArray = noExtendedFamily
  }

  // filter training rod
  if (checkedItems.isUsingTrainingRod && selectedSeason != 'MagicBait') {
    let setDifficultyCeiling = tempFishParamArray.filter(
      (fish) => !fish.difficulty || fish.difficulty < 50
    )
    tempFishParamArray = setDifficultyCeiling
  }

  // filter fishing level requirements
  let fishingHighEnough = tempFishParamArray.filter(
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
      let raining = tempFishParamArray.filter(
        (fish) => !(fish.weather == 'sunny') || fish.IgnoreFishDataRequirements
      )
      tempFishParamArray = raining
    } else {
      let sunny = tempFishParamArray.filter(
        (fish) => !(fish.weather == 'rainy') || fish.IgnoreFishDataRequirements
      )
      tempFishParamArray = sunny
    }
  }

  // filter shore distances
  let distance = tempFishParamArray.filter(
    (fish) =>
      (fish.MaxDistanceFromShore <= -1 || waterDepth <= fish.MaxDistanceFromShore) &&
      waterDepth >= fish.MinDistanceFromShore
  )
  tempFishParamArray = distance

  // trout derby
  // must be after raining and before time
  if (checkedItems.isTroutDerbyActive) {
    let rainbowTrout = appendedFishData.filter(
      (fish) => fish.Condition && fish.Condition.includes('TroutDerby')
    )
    if (rainbowTrout[0]) rainbowTrout[0].displayname = 'Rainbow Trout (from event)'
    tempFishParamArray.concat(rainbowTrout)
  } else {
    let noTroutDerbyTrout = tempFishParamArray.filter(
      (fish) => !fish.Condition || (fish.Condition && !fish.Condition.includes('TroutDerby'))
    )
    tempFishParamArray = noTroutDerbyTrout
  }

  // squid fest
  if (checkedItems.isSquidFestActive) {
    let squid = appendedFishData.filter(
      (fish) => fish.Condition && fish.Condition.includes('SquidFest')
    )

    // squid time
    for (let i in squid) {
      let squidCondition = squid[i].Condition
      if (squidCondition.includes('TIME')) {
        let timeArray = squidCondition.split(' ')
        let timeIndex = timeArray.findIndex((e: any) => e == 'TIME')
        let newTime = [timeArray[timeIndex + 1], timeArray[timeIndex + 2]]
        squid[i].time = newTime
        break
      } else {
        squid[i].time = ['0600', '0600']
      }
    }
    for (let i in squid) {
      if (squid[i]) squid[i].displayname = 'Squid (from event)'
    }
    tempFishParamArray.concat(squid)
  } else {
    let noSquidFestSquid = tempFishParamArray.filter(
      (fish) => !fish.Condition || (fish.Condition && !fish.Condition.includes('SquidFest'))
    )
    tempFishParamArray = noSquidFestSquid
  }

  // filter times
  if (selectedSeason != 'MagicBait') {
    let timeFilter = tempFishParamArray.filter(
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

export function getChance(filteredFishData: any[], c: InternalConfiguration): CalculatorResults[] {
  const checkedItems = c.checkedItems
  const luckBuffs = c.luckBuffs
  const selectedSeason = c.selectedSeason
  const targetedBaitName = c.targetedBaitName
  const selectedLocation = c.selectedLocation
  const waterDepth = c.waterDepth
  const fishingLevel = c.fishingLevel
  const dailyLuck = c.dailyLuck
  let tempFishParamArray: CalculatorResults[] = []
  let tempTrashRate = 1

  for (let i in filteredFishData) {
    let fish = filteredFishData[i]
    if (fish.Id && !fish.Id.match(/Jelly/)) {
      fish['weight'] = calculateWeight(fish)
    }
  }

  // get jelly chance
  let jelly = filteredFishData.find((jelly) => jelly.Id && jelly.Id.match(/Jelly/))
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  jelly && (jelly.weight = getJellyChance(filteredFishData, luckBuffs))

  if (filteredFishData.length > 0) {
    // get chance
    if (checkedItems.isUsingTargetedBait && selectedSeason != 'MagicBait') {
      let nonTargetedFish = filteredFishData.filter(
        (fish) => !fish.name || fish.name != targetedBaitName
      )
      let targetedFish = filteredFishData.filter(
        (fish) => fish.name && fish.name == targetedBaitName
      )
      let targetedBait = targetedBaitSingle(nonTargetedFish, targetedFish)
      tempTrashRate = targetedBait.caseAChance
      //setTrashRate(tempTrashRate);

      for (let i in nonTargetedFish) {
        let fish = nonTargetedFish[i]
        fish.finalChance = rollFishPoolWithTargetedBait(targetedBait, nonTargetedFish, i)
        tempFishParamArray.push(fish)
      }

      if (targetedFish.length > 1) {
        let fish = {
          Id: targetedFish[0].Id,
          displayname: targetedBaitName + ' (multiple entries)',
          finalChance: targetedBait.caseCChance
        }
        tempFishParamArray.push(fish)
      } else {
        for (let i in targetedFish) {
          let fish = targetedFish[i]
          fish.finalChance = targetedBait.caseCChance
          tempFishParamArray.push(fish)
        }
      }
    }

    // handle OR fish (like submarine pier)
    let orFish: CalculatorResults[] = []
    for (let i in tempFishParamArray) {
      let fish = tempFishParamArray[i]
      if (fish.Id.includes('|')) {
        let orFishId = fish.Id.split('|')
        fish.finalChance /= orFishId.length
        for (let j in orFishId) {
          const newParams = getFishParameters(
            // @ts-expect-error idk man.
            orFishId[j].match(/(\d+|Goby)/)[0]
          )
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
      /*let caveJellyChance = 0;
        let floorFishChance = 0;
        if (!checkedItems.isUsingTrainingRod) {
          let chanceMultiplier = 1;
          chanceMultiplier += 0.4 * fishingLevel;
          chanceMultiplier += 0.1 * waterDepth;
          chanceMultiplier += checkedItems.isCuriosityLureActive ? 5 : 0;
          let mineFish = {
            Id: null,
            displayname: null,
            finalChance: 0,
          };
          switch (selectedMineArea) {
            case "20":
              chanceMultiplier +=
                checkedItems.isUsingTargetedBait &&
                targetedBaitName == "Stonefish"
                  ? 10
                  : 0;
              console.log(fishingLevel, chanceMultiplier);
              floorFishChance = 0.02 + 0.01 * chanceMultiplier;
              mineFish["Id"] = "(O)158";
              mineFish["displayname"] = "Stonefish";
              mineFish["finalChance"] = floorFishChance;
              break;
            case "60":
              chanceMultiplier +=
                checkedItems.isUsingTargetedBait &&
                targetedBaitName == "Ice Pip"
                  ? 10
                  : 0;
              floorFishChance = 0.015 + 0.009 * chanceMultiplier;
              mineFish["Id"] = "(O)161";
              mineFish["displayname"] = "Ice Pip";
              mineFish["finalChance"] = floorFishChance;
              break;
            case "100":
              chanceMultiplier +=
                checkedItems.isUsingTargetedBait &&
                targetedBaitName == "Lava Eel"
                  ? 10
                  : 0;
              floorFishChance = 0.01 + 0.008 * chanceMultiplier;
              mineFish["Id"] = "(O)162";
              mineFish["displayname"] = "Lava Eel";
              mineFish["finalChance"] = floorFishChance;
              caveJellyChance = 0.05 + 0.05 * luckBuffs;
              break;
          }
          if (selectedMineArea == "100") {
            let mineFishArray = [];
            mineFishArray.push(mineFish);
            let caveJelly = {
              Id: "(O)CaveJelly",
              displayname: "Cave Jelly",
              finalChance: caveJellyChance * (1 - floorFishChance),
            };
            mineFishArray.push(caveJelly);
            tempFishParamArray = mineFishArray;
            setTrashRate(1 - floorFishChance - caveJellyChance);
          } else {
            for (let i in tempFishParamArray) {
              tempFishParamArray[i]["finalChance"] *= 1 - floorFishChance;
            }
            tempFishParamArray.push(mineFish);
            setTrashRate(tempTrashRate * (1 - floorFishChance));
          }
        } else {
          tempFishParamArray = [];
          setTrashRate(1);
        }*/
    }

    tempFishParamArray.push({
      Id: 'trash',
      displayname: 'Trash',
      finalChance: tempTrashRate
    })
    tempFishParamArray.sort((a, b) => b.finalChance - a.finalChance)
    return tempFishParamArray
  } else {
    return []
  }

  function calculateWeight(fish: any) {
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
  const endTime =
    configuration.startTime == configuration.endTime
      ? configuration.startTime + 1
      : configuration.endTime
  let d = 0
  for (let t = configuration.startTime; t < endTime; t += 10) {
    const c = { ...configuration, timeOfDay: t }
    const timeChances = getChance(getFilteredFishData(c), c)
    for (const fish of timeChances) {
      if (!chances[fish.Id]) {
        chances[fish.Id] = []
      }
      chances[fish.Id].push(fish)
    }
    d++
  }
  const finalChances: CalculatorResults[] = []
  for (const [id, fishChances] of Object.entries(chances)) {
    const totalChance = fishChances.reduce((sum, fish) => sum + fish.finalChance, 0)
    const averageChance = totalChance / d
    finalChances.push({
      Id: id,
      displayname: fishChances[0].displayname,
      finalChance: averageChance
    })
  }
  finalChances.sort((a, b) => b.finalChance - a.finalChance)
  return finalChances
}
