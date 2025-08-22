// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import locationData from '../data/Locations.json'

export const getFishFromLocationAndSeason = (location: string, season: string) => {
  const noBoss = locationData[location].Fish.filter((fish) => !fish.IsBossFish)

  const filterSeason = []
  for (const fish of noBoss) {
    const seasonCheck = !fish.Season || (fish.Season && fish.Season.toLowerCase() == season)
    const conditionCheck =
      !fish.Condition ||
      (fish.Condition && !fish.Condition.includes('SEASON')) ||
      (fish.Condition && fish.Condition.includes('LEGENDARY_FAMILY')) ||
      (fish.Condition && fish.Condition.includes(season))
    const magicCheck = fish.RequireMagicBait === false
    //console.log(fishName(fish.Id), fish.Season, fish.Condition, seasonCheck, conditionCheck, magicCheck)
    if (seasonCheck && conditionCheck && magicCheck) {
      filterSeason.push(fish)
    }
  }

  // console.log("all fish in season: ", filterSeason.map(i => fishName(i.Id)))
  const locationFishData = filterSeason
  return locationFishData
}
