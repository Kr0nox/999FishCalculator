import type { Bait, Fish, Season, Tackle, Time, Location } from '@/model'
import { mainStore } from '.'

export interface Data {
  location: Location
  season: Season
  startTime: Time
  endTime: Time
  bait: Bait
  tackles: Tackle[]

  fishingLevel: number
  luck: number
  depth: number
  raining: boolean
  squidFest: boolean
  troutDerby: boolean
  extendedFamily: boolean

  catchTime: number
  castingOverhead: number
  chestStrategy: ChestStrategy
  fishStrategy: FishStrategy
}

interface ChestStrategy {
  cancelNoChest: boolean
  cancelTime: number
}

interface FishStrategy {
  cancelOtherFish: boolean
  cancelTime: number
  prioritisedFish: Fish[]
}

function fromStore(): Data {
  return {
    location: mainStore().location,
    season: mainStore().season,
    startTime: mainStore().startTime,
    endTime: mainStore().endTime,
    bait: mainStore().bait,
    tackles: mainStore().tackles,

    fishingLevel: mainStore().fishingLevel,
    luck: mainStore().luck,
    depth: mainStore().depth,
    raining: mainStore().raining,
    squidFest: mainStore().squidFest,
    troutDerby: mainStore().troutDerby,
    extendedFamily: mainStore().extendedFamily,

    catchTime: mainStore().catchTime,
    castingOverhead: mainStore().castingOverhead,
    chestStrategy: {
      cancelNoChest: mainStore().cancelChests,
      cancelTime: mainStore().chestCancelTime
    },
    fishStrategy: {
      cancelOtherFish: mainStore().cancelOtherFish,
      cancelTime: mainStore().cancelOtherFishTime,
      prioritisedFish: mainStore().prioritisedFish
    }
  }
}

function toStore(data: Data): void {
  mainStore().location = data.location
  mainStore().season = data.season
  mainStore().startTime = data.startTime
  mainStore().endTime = data.endTime
  mainStore().bait = data.bait
  mainStore().tackles = data.tackles

  mainStore().fishingLevel = data.fishingLevel
  mainStore().luck = data.luck
  mainStore().depth = data.depth
  mainStore().raining = data.raining
  mainStore().squidFest = data.squidFest
  mainStore().troutDerby = data.troutDerby
  mainStore().extendedFamily = data.extendedFamily

  mainStore().catchTime = data.catchTime
  mainStore().castingOverhead = data.castingOverhead
  mainStore().chestCancelTime = data.chestStrategy.cancelTime
  mainStore().cancelChests = data.chestStrategy.cancelNoChest
  mainStore().cancelOtherFish = data.fishStrategy.cancelOtherFish
  mainStore().cancelOtherFishTime = data.fishStrategy.cancelTime
  mainStore().prioritisedFish = data.fishStrategy.prioritisedFish
}

export function save() {
  const data = fromStore()
  const json = JSON.stringify(data)
  navigator.clipboard.writeText(json)
}

export function load(data: string) {
  const json = JSON.parse(data)
  toStore(json)
}
