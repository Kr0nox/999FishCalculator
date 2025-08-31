export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'

export interface Time {
  hour: number
  minute: number
}

export type Tackle =
  | 'Dressed Spinner'
  | 'Treasure Hunter'
  | 'Curiosity Lure'
  | 'Quality Bobber'
  | 'Other'

export interface Location {
  location: string
  subLocation?: string
}

interface BaseBait {
  name: 'Magnet' | 'Deluxe' | 'Wild' | 'Magic' | 'Challenge'
}
export interface TargetedBait {
  name: 'Targeted'
  fish: string
}

export type BaitNames = BaseBait['name'] | TargetedBait['name']

export type Bait = BaseBait | TargetedBait

export interface Fish {
  Id: string
  displayname: string
}

export enum Quality {
  BASE,
  SILVER,
  GOLD,
  IRIDIUM
}
