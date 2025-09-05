import type { Location, Season, Tackle } from '@/model'
import type { Data } from './serialize'
import { numberToTime, timeToNumber } from '@/model/time'
import { findFish, getFishParameters } from '@/fishcalc/lib/fishdata'
import type { CalcFishKey } from '@/fishcalc/types'

type Limiter = { type: 'length'; length: number } | { type: 'symbol'; symbol: string }
type KeyType = keyof Data
abstract class Minifier<K extends KeyType> {
  constructor(
    protected key: K,
    protected _limiter: Limiter
  ) {}

  public minify(data: Data): string {
    return this._minify(data[this.key])
  }
  protected abstract _minify(value: Data[K]): string

  public unminify(value: string, data: Data): void {
    data[this.key] = this._unminify(value)
  }
  protected abstract _unminify(value: string): Data[K]

  public get limiter() {
    return this._limiter
  }
}

type BooleanKeys = {
  [K in keyof Data]-?: [NonNullable<Data[K]>] extends [boolean] ? K : never
}[keyof Data]
export class BooleanMinifier<K extends BooleanKeys> extends Minifier<K> {
  constructor(key: K) {
    super(key, { type: 'length', length: 1 })
  }

  protected _minify(value: Data[K]): string {
    return value ? '1' : '0'
  }
  protected _unminify(value: string): Data[K] {
    return value === '1'
  }
}
type NumberKeys = {
  [K in keyof Data]-?: [NonNullable<Data[K]>] extends [number] ? K : never
}[keyof Data]
export class NumberMinifier<K extends NumberKeys> extends Minifier<K> {
  constructor(key: K) {
    super(key, { type: 'symbol', symbol: '.' })
  }

  protected _minify(value: Data[K]): string {
    return value.toString()
  }
  protected _unminify(value: string): Data[K] {
    return parseFloat(value) as Data[K]
  }
}

export class SeasonMinifier extends Minifier<'season'> {
  constructor() {
    super('season', { type: 'length', length: 1 })
  }

  private seasons: Season[] = ['Spring', 'Summer', 'Fall', 'Winter']
  protected _minify(value: Data['season']): string {
    return this.seasons.indexOf(value).toString()
  }
  protected _unminify(value: string): Data['season'] {
    const index = parseInt(value)
    return this.seasons[index] || 'Spring'
  }
}

export class TimeMinifier<K extends 'startTime' | 'endTime'> extends Minifier<K> {
  constructor(key: K) {
    super(key, { type: 'length', length: 4 })
  }

  protected _minify(value: Data['startTime'] | Data['endTime']): string {
    const v = timeToNumber(value)
    return v.toString().padStart(4, '0')
  }
  protected _unminify(value: string): Data['startTime'] | Data['endTime'] {
    const v = parseInt(value)
    return numberToTime(v)
  }
}

export class BaitMinifier extends Minifier<'bait'> {
  constructor() {
    super('bait', { type: 'symbol', symbol: '.' })
  }

  protected _minify(value: Data['bait']): string {
    if (value.name === 'Deluxe') return 'D'
    if (value.name === 'Magnet') return 'm'
    if (value.name === 'Magic') return 'M'
    if (value.name === 'Wild') return 'W'
    if (value.name === 'Challenge') return 'C'
    if (value.name === 'Targeted') {
      const fishId = findFish(value.fish) ?? '???'
      return `T${fishId}`
    }
    throw new Error(`Unknown bait type: ${value}`)
  }

  protected _unminify(value: string): Data['bait'] {
    if (value === 'D') return { name: 'Deluxe' }
    if (value === 'm') return { name: 'Magnet' }
    if (value === 'M') return { name: 'Magic' }
    if (value === 'W') return { name: 'Wild' }
    if (value === 'C') return { name: 'Challenge' }
    if (value.startsWith('T')) {
      const fishId = value.slice(1)
      const fish = getFishParameters(fishId as CalcFishKey)?.name || ''
      return { name: 'Targeted', fish: fish }
    }
    throw new Error(`Unknown bait type: ${value}`)
  }
}

export class TackleMinifier extends Minifier<'tackles'> {
  constructor() {
    super('tackles', { type: 'length', length: 2 })
  }

  private tackleMap: Record<Tackle, string> = {
    'Dressed Spinner': 'D',
    'Treasure Hunter': 'T',
    'Curiosity Lure': 'C',
    'Quality Bobber': 'Q',
    Other: 'O'
  }
  private reverseTackleMap: Record<string, Tackle> = Object.fromEntries(
    Object.entries(this.tackleMap).map(([k, v]) => [v, k])
  ) as Record<string, Tackle>

  protected _minify(value: Data['tackles']): string {
    return value
      .map((t) => this.tackleMap[t] || 'O')
      .join('')
      .padEnd(2, 'O')
  }

  protected _unminify(value: string): Data['tackles'] {
    return value.split('').map((c) => this.reverseTackleMap[c] || 'Other')
  }
}

export class ChestStrategyMinifier extends Minifier<'chestStrategy'> {
  constructor() {
    super('chestStrategy', { type: 'symbol', symbol: '.' })
  }

  protected _minify(value: Data['chestStrategy']): string {
    const cancelNoChest = value.cancelNoChest ? '1' : '0'
    const cancelTime = value.cancelTime.toString().padStart(2, '0')
    return `${cancelNoChest}${cancelTime}`
  }

  protected _unminify(value: string): Data['chestStrategy'] {
    const cancelNoChest = value[0] === '1'
    const cancelTime = parseInt(value.slice(1, 3)) || 0
    return { cancelNoChest, cancelTime }
  }
}

export class FishStrategyMinifier extends Minifier<'fishStrategy'> {
  constructor() {
    super('fishStrategy', { type: 'symbol', symbol: '.' })
  }
  protected _minify(value: Data['fishStrategy']): string {
    const cancelOtherFish = value.cancelOtherFish ? '1' : '0'
    const cancelTime = value.cancelTime.toString()
    const prioritisedFish = value.prioritisedFish
      .map((f) => {
        const id = f.Id || '???'
        return id
      })
      .join('')
    return `${cancelOtherFish}${cancelTime}|${prioritisedFish}`
  }

  protected _unminify(value: string): Data['fishStrategy'] {
    const [mainPart, fishPart] = value.split('|')
    const cancelOtherFish = mainPart[0] === '1'
    const cancelTime = parseInt(mainPart.slice(1)) || 0
    const prioritisedFish: string[] = []
    for (let i = 0; i < fishPart.length; i += 3) {
      prioritisedFish.push(fishPart.slice(i, i + 3))
    }
    const actualFish = prioritisedFish.map((f) => {
      const p = getFishParameters(f as CalcFishKey)!
      return { Id: f, displayname: p.name }
    })
    return {
      cancelOtherFish,
      cancelTime,
      prioritisedFish: actualFish
    }
  }
}

export class LocationMinifier extends Minifier<'location'> {
  constructor() {
    super('location', { type: 'length', length: 2 })
  }

  protected _minify(value: Data['location']): string {
    let location = '_'
    let subLocation = '_'
    if (value.location == 'Beach') {
      location = 'B'
      subLocation = value.subLocation === 'West Pier' ? 'W' : '_'
    }
    if (value.location == 'Submarine') {
      location = 'S'
    }
    if (value.location == 'Mountain Lake') {
      location = 'M'
    }
    if (value.location == 'Mines') {
      location = 'U'
      const depth = value.subLocation!.split(' ')[1]
      subLocation = depth[0] // 20, 60, 100 -> 2, 6, 1
    }
    if (value.location == 'Cindersap Forest') {
      location = 'F'
      if (value.subLocation == 'River') subLocation = 'R'
      else if (value.subLocation == 'Pond') subLocation = 'P'
      else if (value.subLocation == 'Waterfall') subLocation = 'W'
    }
    if (value.location == 'Secret Woods') {
      location = 'W'
    }
    if (value.location == 'Pelican Town') {
      location = 'P'
    }
    if (value.location == 'Sewers') {
      location = 's'
      if (value.subLocation == 'Mutant Bug Lair') subLocation = 'B'
    }
    if (value.location == 'Desert') {
      location = 'D'
    }
    if (value.location == 'Witch Swamp') {
      location = 'w'
    }
    if (value.location == 'Ginger Island') {
      location = 'G'
      if (value.subLocation == 'North') subLocation = 'N'
      if (value.subLocation == 'West (River)') subLocation = 'R'
      if (value.subLocation == 'West (Ocean)') subLocation = 'W'
      if (value.subLocation == 'South') subLocation = 'S'
      if (value.subLocation == 'Pirate Cove') subLocation = 'P'
      if (value.subLocation == 'Caldera') subLocation = 'C'
    }
    return location + subLocation
  }

  protected _unminify(value: string): Location {
    const location = value[0]
    const subLocation = value[1]
    if (location === 'B') {
      return {
        location: 'Beach',
        subLocation: subLocation === 'W' ? 'West Pier' : 'Default'
      }
    }
    if (location === 'S') {
      return { location: 'Submarine' }
    }
    if (location === 'M') {
      return { location: 'Mountain Lake' }
    }
    if (location === 'U') {
      let level = ''
      if (subLocation === '2') level = 'Floor 20'
      else if (subLocation === '6') level = 'Floor 60'
      else if (subLocation === '1') level = 'Floor 100'
      return {
        location: 'Mines',
        subLocation: level
      }
    }
    if (location === 'F') {
      let subLoc = ''
      if (subLocation === 'R') subLoc = 'River'
      else if (subLocation === 'P') subLoc = 'Pond'
      else if (subLocation === 'W') subLoc = 'Waterfall'
      return {
        location: 'Cindersap Forest',
        subLocation: subLoc
      }
    }
    if (location === 'W') {
      return { location: 'Secret Woods' }
    }
    if (location === 'P') {
      return { location: 'Pelican Town' }
    }
    if (location === 's') {
      return {
        location: 'Sewers',
        subLocation: subLocation === 'B' ? 'Mutant Bug Lair' : 'Default'
      }
    }
    if (location === 'D') {
      return { location: 'Desert' }
    }
    if (location === 'w') {
      return { location: 'Witch Swamp' }
    }
    if (location == 'G') {
      let subLoc = ''
      if (subLocation === 'N') subLoc = 'North'
      else if (subLocation === 'R') subLoc = 'West (River)'
      else if (subLocation === 'W') subLoc = 'West (Ocean)'
      else if (subLocation === 'S') subLoc = 'South'
      else if (subLocation === 'P') subLoc = 'Pirate Cove'
      else if (subLocation === 'C') subLoc = 'Caldera'
      return {
        location: 'Ginger Island',
        subLocation: subLoc
      }
    }
    throw new Error('Unknown location code: ' + value)
  }
}

export class ChallangeBaitFishAmountMinifier extends Minifier<'challengeBaitFishAmount'> {
  constructor() {
    super('challengeBaitFishAmount', { type: 'symbol', symbol: '.' })
  }

  protected _minify(value: Data['challengeBaitFishAmount']): string {
    if (!value) return ''
    return Object.entries(value)
      .map(([fish, amount]) => {
        return `${fish}${amount}`
      })
      .join('|')
  }

  protected _unminify(value: string): Record<string, number> | undefined {
    const result: Record<string, number> = {}
    const entries = value.split('|')
    for (const entry of entries) {
      const fishId = entry.slice(0, 3)
      const amount = parseInt(entry.slice(3)) || 0
      if (fishId && amount) {
        result[fishId] = amount
      }
    }
    return result
  }
}

const minifiers: { [K in keyof Data]-?: Minifier<K> } = {
  location: new LocationMinifier(),
  season: new SeasonMinifier(),
  startTime: new TimeMinifier('startTime'),
  endTime: new TimeMinifier('endTime'),
  bait: new BaitMinifier(),
  tackles: new TackleMinifier(),

  fishingLevel: new NumberMinifier('fishingLevel'),
  luck: new NumberMinifier('luck'),
  depth: new NumberMinifier('depth'),
  raining: new BooleanMinifier('raining'),
  squidFest: new BooleanMinifier('squidFest'),
  troutDerby: new BooleanMinifier('troutDerby'),
  extendedFamily: new BooleanMinifier('extendedFamily'),

  catchTime: new NumberMinifier('catchTime'),
  castingOverhead: new NumberMinifier('castingOverhead'),
  chestStrategy: new ChestStrategyMinifier(),
  fishStrategy: new FishStrategyMinifier(),

  challengeBaitFishAmount: new ChallangeBaitFishAmountMinifier()
}

const keyOrder: KeyType[] = [
  'location',
  'season',
  'startTime',
  'endTime',
  'bait',
  'tackles',

  'fishingLevel',
  'luck',
  'depth',
  'raining',
  'squidFest',
  'troutDerby',
  'extendedFamily',

  'catchTime',
  'castingOverhead',
  'chestStrategy',
  'fishStrategy',

  'challengeBaitFishAmount'
]

export function minify(data: Data): string {
  let result = ''
  for (const key of keyOrder) {
    const minifier = minifiers[key]
    let part = minifier.minify(data)
    if (minifier.limiter.type === 'symbol') {
      part += minifier.limiter.symbol
    }
    result += part
  }
  return result
}

export function unminify(value: string): Data {
  const data = {} as Data
  let index = 0
  for (const key of keyOrder) {
    const minifier = minifiers[key]
    const limiter = minifier.limiter
    let part = ''
    if (limiter.type === 'length') {
      part = value.slice(index, index + limiter.length)
      index += limiter.length
    } else if (limiter.type === 'symbol') {
      const nextIndex = value.indexOf(limiter.symbol, index)
      if (nextIndex === -1) {
        part = value.slice(index, value.length - 1)
        index = value.length
      } else {
        part = value.slice(index, nextIndex)
        index = nextIndex + 1
      }
    }
    minifier.unminify(part, data)
  }
  return data
}
