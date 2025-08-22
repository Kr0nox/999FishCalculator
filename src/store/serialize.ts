import type { Bait, Fish, Season, Tackle, Time, Location } from '@/model'
import { store } from '.'

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
    location: store().location,
    season: store().season,
    startTime: store().startTime,
    endTime: store().endTime,
    bait: store().bait,
    tackles: store().tackles,

    fishingLevel: store().fishingLevel,
    luck: store().luck,
    depth: store().depth,
    raining: store().raining,
    squidFest: store().squidFest,
    troutDerby: store().troutDerby,
    extendedFamily: store().extendedFamily,

    catchTime: store().catchTime,
    castingOverhead: store().castingOverhead,
    chestStrategy: {
      cancelNoChest: store().cancelChests,
      cancelTime: store().chestCancelTime
    },
    fishStrategy: {
      cancelOtherFish: store().cancelOtherFish,
      cancelTime: store().cancelOtherFishTime,
      prioritisedFish: store().prioritisedFish
    }
  }
}

function toStore(data: Data): void {
  store().location = data.location
  store().season = data.season
  store().startTime = data.startTime
  store().endTime = data.endTime
  store().bait = data.bait
  store().tackles = data.tackles

  store().fishingLevel = data.fishingLevel
  store().luck = data.luck
  store().depth = data.depth
  store().raining = data.raining
  store().squidFest = data.squidFest
  store().troutDerby = data.troutDerby
  store().extendedFamily = data.extendedFamily

  store().catchTime = data.catchTime
  store().castingOverhead = data.castingOverhead
  store().chestCancelTime = data.chestStrategy.cancelTime
  store().cancelChests = data.chestStrategy.cancelNoChest
  store().cancelOtherFish = data.fishStrategy.cancelOtherFish
  store().cancelOtherFishTime = data.fishStrategy.cancelTime
  store().prioritisedFish = data.fishStrategy.prioritisedFish
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
