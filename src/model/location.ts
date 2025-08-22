import type { Location } from '.'

export interface LocationOption {
  name: string
  subLocations: string[]
}

export const LocationOptions: LocationOption[] = [
  {
    name: 'Beach',
    subLocations: ['Default', 'West Pier']
  },
  {
    name: 'Submarine',
    subLocations: []
  },
  {
    name: 'Mountain Lake',
    subLocations: []
  },
  {
    name: 'Mines',
    subLocations: ['Floor 20', 'Floor 60', 'Floor 100']
  },
  {
    name: 'Cindersap Forest',
    subLocations: ['River', 'Pond', 'Waterfall']
  },
  {
    name: 'Secret Woods',
    subLocations: []
  },
  {
    name: 'Pelican Town',
    subLocations: []
  },
  {
    name: 'Desert',
    subLocations: []
  },
  {
    name: 'Witch Swamp',
    subLocations: []
  },
  {
    name: 'Ginger Island',
    subLocations: ['North', 'West (River)', 'West (Ocean)', 'South', 'Pirate Cove']
  }
]

interface CalcLocation {
  location: string
  subLocation: string
  bobberArea: string
  mineArea: string
}

export function getCalculatorLocation(l: Location): CalcLocation {
  let location = ''
  let subLocation = ''
  let bobberArea = ''
  let mineArea = ''
  if (l.location === 'Beach') {
    location = 'Beach'
    if (l.subLocation === 'West Pier') {
      bobberArea = 'SubmarinePier'
    }
  }
  if (l.location === 'Submarine') {
    location = 'Submarine'
  }
  if (l.location === 'Mountain Lake') {
    location = 'Mountain'
  }
  if (l.location === 'Mines') {
    l.location = 'UndergroundMine'
    if (l.subLocation === 'Floor 20') {
      mineArea = '20'
    } else if (l.subLocation === 'Floor 60') {
      mineArea = '60'
    } else if (l.subLocation === 'Floor 100') {
      mineArea = '100'
    }
  }
  if (l.location === 'Cindersap Forest') {
    location = 'Forest'
    if (l.subLocation === 'River') {
      subLocation = 'River'
    } else if (l.subLocation === 'Pond') {
      bobberArea = 'Lake'
    } else if (l.subLocation === 'Waterfall') {
      bobberArea = 'Waterfall'
    }
  }
  if (l.location === 'Secret Woods') {
    location = 'Woods'
  }
  if (l.location === 'Pelican Town') {
    location = 'Town'
  }
  if (l.location === 'Desert') {
    location = 'Desert'
  }
  if (l.location === 'Witch Swamp') {
    location = 'WitchSwamp'
  }
  if (l.location === 'Ginger Island') {
    if (l.subLocation === 'North') {
      location = 'IslandNorth'
    } else if (l.subLocation === 'West (River)') {
      location = 'IslandWest'
      subLocation = 'Freshwater'
    } else if (l.subLocation === 'West (Ocean)') {
      location = 'IslandWest'
      subLocation = 'Ocean'
    } else if (l.subLocation === 'South') {
      location = 'IslandSouth'
    } else if (l.subLocation === 'Pirate Cove') {
      location = 'IslandSouthEastCave'
    }
  }

  return {
    location,
    subLocation,
    bobberArea,
    mineArea
  }
}
