import locationData from './data/Locations.json'
import fishData from './data/Fish.json'

export type CalcLocationKey = keyof typeof locationData
export type CalcSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'MagicBait'

export type CalcFishKey = keyof typeof fishData

type FishKeys =
  | 'Chance'
  | 'Season'
  | 'FishAreaId'
  | 'BobberPosition'
  | 'PlayerPosition'
  | 'MinFishingLevel'
  | 'MinDistanceFromShore'
  | 'MaxDistanceFromShore'
  | 'ApplyDailyLuck'
  | 'CuriosityLureBuff'
  | 'SpecificBaitBuff'
  | 'SpecificBaitMultiplier'
  | 'CatchLimit'
  | 'CanUseTrainingRod'
  | 'IsBossFish'
  | 'SetFlagOnCatch'
  | 'RequireMagicBait'
  | 'Precedence'
  | 'IgnoreFishDataRequirements'
  | 'CanBeInherited'
  | 'ChanceModifiers'
  | 'ChanceModifierMode'
  | 'ChanceBoostPerLuckLevel'
  | 'UseFishCaughtSeededRandom'
  | 'Condition'
  | 'Id'
  | 'ItemId'
  | 'RandomItemId'
  | 'MaxItems'
  | 'MinStack'
  | 'MaxStack'
  | 'Quality'
  | 'ObjectInternalName'
  | 'ObjectDisplayName'
  | 'ToolUpgradeLevel'
  | 'IsRecipe'
  | 'StackModifiers'
  | 'StackModifierMode'
  | 'QualityModifiers'
  | 'QualityModifierMode'
  | 'ModData'
  | 'PerItemCondition'

export type CalcFish = Partial<Record<FishKeys, unknown>> & { Id: string } & {
  BobberPosition?: BobberArea | null
  Condition?: string | null
  MinFishingLevel: number
  MinDistanceFromShore: number
  MaxDistanceFromShore: number
  Chance: number
  ChanceBoostPerLuckLevel: number
  CuriosityLureBuff: number
  SpecificBaitMultiplier: number
  SpecificBaitBuff: number
  Precedence: number
}

export type BobberArea = { X: number; Y: number; Width: number; Height: number }

export interface FishParameters {
  name: string
  difficulty: number
  type: string
  minSize: string
  maxSize: string
  time: string[]
  season: string
  weather: string
  maxDepth: number
  baseRate: number
  depthMultiplier: number
  requiredLevel: number
}

export type AppendedFish = (FishParameters | { [K in keyof FishParameters]?: never }) &
  CalcFish & { displayname: string; weight: number; name: string }
