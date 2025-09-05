import type { Bait, Fish, Season, Tackle, Time, Location } from '@/model'
import { store } from '.'
import { minify, unminify } from './Minifier'

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

  challengeBaitFishAmount?: Record<string, number>
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
    },
    challengeBaitFishAmount: store().challengeBaitCatchAmount
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

  if (data.challengeBaitFishAmount) {
    store().challengeBaitCatchAmount = data.challengeBaitFishAmount
  }
}

export function save() {
  const data = fromStore()
  const text = minify(data)
  navigator.clipboard.writeText(text)
}

export function loadData(data: string) {
  let json: Data | undefined
  if (data.startsWith('{')) {
    json = JSON.parse(data) as Data
  } else {
    try {
      const url = new URL(data)
      data = url.hash
    } catch (e) {
      void e
    }
    if (data.startsWith('#')) {
      data = data.substring(1)
    }
    json = unminify(data)
  }
  return json
}

export function load(data: string) {
  toStore(loadData(data))
}

export function share() {
  const data = fromStore()
  const compressed = minify(data)
  const url = new URL(window.location.href)
  url.hash = compressed
  navigator.clipboard.writeText(url.toString())
}
