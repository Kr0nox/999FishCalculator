import fishData from '../data/Fish.json'
import type { CalcFishKey, FishParameters } from '../types'

export function getFishParameters(id: CalcFishKey): FishParameters | null {
  if (!fishData[id]) {
    return null
  }
  const fishArray = fishData[id].split('/')
  const fishJson = {
    name: fishArray[0],
    difficulty: Number(fishArray[1]),
    type: fishArray[2],
    minSize: fishArray[3],
    maxSize: fishArray[4],
    time: fishArray[5].split(' ').map(Number),
    season: fishArray[6],
    weather: fishArray[7],
    maxDepth: Number(fishArray[9]),
    baseRate: Number(fishArray[10]),
    depthMultiplier: Number(fishArray[11]),
    requiredLevel: Number(fishArray[12])
  }
  return fishJson
}

export function getFishIds(): CalcFishKey[] {
  return Object.keys(fishData) as CalcFishKey[]
}
