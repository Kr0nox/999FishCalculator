import locationData from '../data/Locations.json'
import type { CalcFish, CalcLocationKey, CalcSeason } from '../types'

export function getFishFromLocationAndSeason(
  location: CalcLocationKey,
  season: CalcSeason
): CalcFish[] {
  const noBoss = locationData[location].Fish.filter((fish) => !fish.IsBossFish)

  let filterSeason = []
  if (season != 'MagicBait') {
    filterSeason = noBoss.filter(
      (fish) =>
        (!fish.Season || (fish.Season && fish.Season.toLowerCase() == season)) &&
        (!fish.Condition ||
          (fish.Condition && !fish.Condition.includes('SEASON')) ||
          (fish.Condition && fish.Condition.includes('LEGENDARY_FAMILY')) ||
          (fish.Condition && fish.Condition.includes(season))) &&
        fish.RequireMagicBait === false
    )
  } else {
    filterSeason = noBoss
  }
  const locationFishData = filterSeason
  return locationFishData
}
