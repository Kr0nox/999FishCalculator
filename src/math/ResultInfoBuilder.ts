import type { CalculatorResults } from '@/fishcalc'
import { extractCalcFishId } from '@/fishcalc/lib/fishdata'
import { store } from '@/store'
import { Strategy } from './Strategy'

export abstract class ResultInfoBuilder {
  constructor(protected results: CalculatorResults[]) {}

  abstract buildInfo(fish: CalculatorResults): string[]

  protected fishCountMultiplier(fish: CalculatorResults): number {
    if (store().bait.name == 'Challenge') {
      return store().getChallengeBaitCatchAmount(fish.Id)
    }
    if (store().bait.name == 'Wild') {
      const chanceForDouble = 0.25 + store().dailyLuck / 2.0
      const catchAmount = 1 * (1 - chanceForDouble) + 2 * chanceForDouble
      return catchAmount
    }
    return 1
  }
}

export class BlessingResultInfoBuilder extends ResultInfoBuilder {
  private fishChanceSum

  constructor(results: CalculatorResults[]) {
    super(results)
    this.fishChanceSum = results
      .filter((f) => extractCalcFishId(f.Id) !== undefined)
      .map((f) => f.finalChance)
      .reduce((a, b) => a + b, 0)
  }

  buildInfo(fish: CalculatorResults): string[] {
    if (extractCalcFishId(fish.Id) === undefined) {
      return ['Not effected by blessing']
    }
    const baseFishPerDay =
      (fish.finalChance / this.fishChanceSum) * this.fishCountMultiplier(fish) * 3

    return [
      `${baseFishPerDay.toFixed(2)} / blessing`,
      `${(999 / baseFishPerDay).toFixed(2)} blessings/stack`
    ]
  }
}

export class DefaultResultInfoBuilder extends ResultInfoBuilder {
  constructor(
    results: CalculatorResults[],
    protected strategy: Strategy
  ) {
    super(results)
  }

  buildInfo(fish: CalculatorResults): string[] {
    let time = this.strategy.calculateTimePerCatch(fish)
    if (time === undefined) {
      return ['Fish will not be caught']
    }

    if (extractCalcFishId(fish.Id) !== undefined) {
      time /= this.fishCountMultiplier(fish)
    }

    const totalTime = time * 999
    const timeInHours = (totalTime / 3600).toFixed(2)

    return [`${time.toFixed(2)} s/Fish`, `${timeInHours} h/Stack`]
  }
}
