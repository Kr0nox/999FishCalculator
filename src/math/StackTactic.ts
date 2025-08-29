import {
  getChances,
  type CalculatorResults,
  type CheckedItems,
  type Configuration
} from '@/fishcalc'
import type { CalcLocationKey, CalcSeason } from '@/fishcalc/types'
import type { Fish } from '@/model'
import { type CalcLocation } from '@/model/location'

interface Range {
  /** inclusiv */
  min: number
  /** inclusiv */
  max: number
  step: number
}

export interface InputFish extends Fish {
  toCatch: number
  canCatchPerfect: boolean
}

interface TacticFishResult extends Configuration {
  results: CalculatorResults[]
}

export class TacticCalculator {
  public allConfigurations: Configuration[] = []
  public allResults: TacticFishResult[] = []
  private progressListener: ((report: ProgressReport) => void) | null = null

  constructor(
    private fish: InputFish[],
    private location: CalcLocation,
    private fishingLevel: Range = { min: 10, max: 15, step: 1 },
    private depth: Range = { min: 0, max: 5, step: 1 },
    private luckBuffs: Range = { min: 0, max: 4, step: 1 },
    private startTime: Range = { min: 600, max: 600, step: 100 },
    private endTime: Range = { min: 2599, max: 2599, step: 100 }
  ) {}

  public setProgressListener(listener: (report: ProgressReport) => void) {
    this.progressListener = listener
  }

  private sendProgress(report: ProgressReport) {
    if (this.progressListener) {
      this.progressListener(report)
    }
  }

  public buildAllConfigurations(): Configuration[] {
    this.sendProgress({ step: 'Building Base Configurations', progress: 0, total: 5 })
    const simpleConfigurations = this.buildSimpleConfigurations(false)
    const rangeConfigurations = this.buildRangeConfigurations()
    const magiBaitConfigurations = this.buildSimpleConfigurations(true)
    const baitConfigurations = this.fish.flatMap((f) =>
      this.getBaitConfigurations(f, simpleConfigurations)
    )
    const baseConfigs = [...simpleConfigurations, ...baitConfigurations, ...magiBaitConfigurations]
    const allConfigs: Configuration[] = []
    this.sendProgress({
      step: 'Building Configurations',
      progress: 0,
      total: rangeConfigurations.length * baseConfigs.length
    })
    const total = rangeConfigurations.length * baseConfigs.length
    for (const base of baseConfigs) {
      for (const range of rangeConfigurations) {
        allConfigs.push({
          ...base,
          ...range
        })
      }
      if (this.progressListener) {
        this.progressListener({
          step: 'Building Configurations',
          progress: allConfigs.length,
          total
        })
      }
    }

    this.allConfigurations = allConfigs
    return allConfigs
  }

  public calculateResultsForTactics(): TacticFishResult[] {
    this.sendProgress({
      step: 'Calculating Results for Tactics',
      progress: 0,
      total: this.allConfigurations.length
    })
    const total = this.allConfigurations.length
    let progress = 0
    const result: TacticFishResult[] = []
    for (const config of this.allConfigurations) {
      result.push({ ...config, results: getChances(config) })
      progress++
      if (progress % 100 === 0) {
        this.sendProgress({ step: 'Calculating Results for Tactics', progress, total })
      }
    }
    this.sendProgress({ step: 'Calculating Results for Tactics', progress: total, total })
    return result
  }

  private buildRangeConfigurations(): RangeConfiguration[] {
    const configs: RangeConfiguration[] = []
    for (
      let fl = this.fishingLevel.min;
      fl <= this.fishingLevel.max;
      fl += this.fishingLevel.step
    ) {
      for (let wd = this.depth.min; wd <= this.depth.max; wd += this.depth.step) {
        for (let lb = this.luckBuffs.min; lb <= this.luckBuffs.max; lb += this.luckBuffs.step) {
          for (let st = this.startTime.min; st <= this.startTime.max; st += this.startTime.step) {
            for (
              let et = Math.max(st + 100, this.endTime.min);
              et <= this.endTime.max;
              et += this.endTime.step
            ) {
              configs.push({
                fishingLevel: fl,
                waterDepth: wd,
                luckBuffs: lb,
                startTime: st,
                endTime: et
              })
            }
          }
        }
      }
    }
    return configs
  }

  private getBaitConfigurations(
    fish: InputFish,
    simpleConfigurations: NonRangeConfiguration[]
  ): NonRangeConfiguration[] {
    const configs: NonRangeConfiguration[] = []
    for (const simpleConfig of simpleConfigurations) {
      configs.push({
        ...simpleConfig,
        targetedBaitName: fish.displayname,
        checkedItems: {
          ...simpleConfig.checkedItems,
          isUsingTargetedBait: true
        }
      })
    }
    return configs
  }

  private buildSimpleConfigurations(magicBait: boolean): NonRangeConfiguration[] {
    const _seasons: CalcSeason[] = magicBait ? ['MagicBait'] : seasons
    const simpleConfigs: NonRangeConfiguration[] = []
    for (const raining of bools) {
      for (const curiosityLure of bools) {
        for (const season of _seasons) {
          simpleConfigs.push({
            targetedBaitName: '',
            checkedItems: {
              isCuriosityLureActive: curiosityLure,
              isExtendedFamilyActive: false,
              isRaining: raining,
              isTroutDerbyActive: false,
              isSquidFestActive: false,
              isUsingTrainingRod: false,
              isUsingTargetedBait: false
            },
            dailyLuck: 0,
            selectedSeason: season,
            selectedLocation: this.location.location,
            selectedSubArea: this.location.subLocation,
            selectedMineArea: this.location.mineArea,
            selectedBobberLocation: this.location.bobberArea
          })
        }

        // events
        if (this.location.location === 'Forest' && this.location.subLocation === 'River') {
          simpleConfigs.push({
            targetedBaitName: '',
            checkedItems: {
              isCuriosityLureActive: curiosityLure,
              isExtendedFamilyActive: false,
              isRaining: raining,
              isTroutDerbyActive: true,
              isSquidFestActive: false,
              isUsingTrainingRod: false,
              isUsingTargetedBait: false
            },
            dailyLuck: 0,
            selectedSeason: magicBait ? 'MagicBait' : 'summer',
            selectedLocation: this.location.location,
            selectedSubArea: this.location.subLocation,
            selectedMineArea: this.location.mineArea,
            selectedBobberLocation: this.location.bobberArea
          })
        }
        if (this.location.location === 'Beach') {
          simpleConfigs.push({
            targetedBaitName: '',
            checkedItems: {
              isCuriosityLureActive: curiosityLure,
              isExtendedFamilyActive: false,
              isRaining: raining,
              isTroutDerbyActive: true,
              isSquidFestActive: false,
              isUsingTrainingRod: false,
              isUsingTargetedBait: false
            },
            dailyLuck: 0,
            selectedSeason: magicBait ? 'MagicBait' : 'winter',
            selectedLocation: this.location.location,
            selectedSubArea: this.location.subLocation,
            selectedMineArea: this.location.mineArea,
            selectedBobberLocation: this.location.bobberArea
          })
        }
      }
    }
    return simpleConfigs
  }
}

const seasons: CalcSeason[] = ['spring', 'summer', 'fall', 'winter']
const bools = [true, false]

interface NonRangeConfiguration extends Partial<Configuration> {
  targetedBaitName: string
  checkedItems: CheckedItems
  dailyLuck: number
  selectedSeason: CalcSeason
  selectedLocation: CalcLocationKey
  selectedSubArea: string
  selectedMineArea: string
  selectedBobberLocation: string
}

interface RangeConfiguration extends Partial<Configuration> {
  fishingLevel: number
  waterDepth: number
  luckBuffs: number
  startTime: number
  endTime: number
}

export interface ProgressReport {
  step: string
  progress: number
  total: number
}
