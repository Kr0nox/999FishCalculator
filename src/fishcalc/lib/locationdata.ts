// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import locationData from '../data/Locations.json'

export function getFishFromLocationAndSeason(location: string, season: string) {
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
