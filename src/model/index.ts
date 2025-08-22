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

export type Bait = BaseBait | TargetedBait

export interface Fish {
  Id: string
  displayname: string
}
