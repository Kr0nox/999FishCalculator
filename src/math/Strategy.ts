import type { CalculatorResults } from '@/fishcalc'
import { extractCalcFishId } from '@/fishcalc/lib/fishdata'
import { checkIdEquality } from '@/model/Fish'

abstract class Strategy {
  protected timePerCast!: number

  constructor(
    protected catchTime: number,
    protected timeToBite: number,
    protected catchOverhead: number,
    protected results: CalculatorResults[]
  ) {}
  /**
   * Calculates the time a single cast takes
   * @returns Average duration of a cast
   */
  abstract calculateTimePerCast(): number

  abstract calculateTimePerCatch(fish: CalculatorResults): number | undefined
}

class DefaultStrategy extends Strategy {
  constructor(
    catchTime: number,
    timeToBite: number,
    catchOverhead: number,
    results: CalculatorResults[]
  ) {
    super(catchTime, timeToBite, catchOverhead, results)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const fishChance = arrayChance(
      this.results.filter((f) => extractCalcFishId(f.Id) !== undefined)
    )
    const timePerCatch = fishChance * this.catchTime + this.timeToBite + this.catchOverhead
    return timePerCatch
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    return this.timePerCast / fish.finalChance
  }
}
class CancelOtherFishStrategy extends Strategy {
  constructor(
    private cancelTime: number,
    private prioritisedFish: CalculatorResults[],
    catchTime: number,
    timeToBite: number,
    catchOverhead: number,
    results: CalculatorResults[]
  ) {
    super(catchTime, timeToBite, catchOverhead, results)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timePerNonPriorityCatch = this.cancelTime + this.timeToBite + this.catchOverhead
    const timePerPriorityCatch = this.catchTime + this.timeToBite + this.catchOverhead
    const timeNonFishItems = this.timeToBite + this.catchOverhead
    const prioritisedFishChance = arrayChance(this.prioritisedFish)
    const nonFishChance = arrayChance(
      this.results.filter((f) => extractCalcFishId(f.Id) === undefined)
    )
    const nonPriorityFishChance = 1 - (prioritisedFishChance + nonFishChance)
    return (
      prioritisedFishChance * timePerPriorityCatch +
      nonPriorityFishChance * timePerNonPriorityCatch +
      nonFishChance * timeNonFishItems
    )
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    if (
      !this.prioritisedFish.find((f) => checkIdEquality(f.Id, fish.Id)) &&
      extractCalcFishId(fish.Id) !== undefined
    ) {
      return undefined
    }
    return this.timePerCast / fish.finalChance
  }
}

class CancelNoChestStrategy extends Strategy {
  constructor(
    private cancelTime: number,
    private chestChance: number,
    catchTime: number,
    timeToBite: number,
    catchOverhead: number,
    results: CalculatorResults[]
  ) {
    super(catchTime, timeToBite, catchOverhead, results)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timePerNoChest = this.cancelTime + this.timeToBite + this.catchOverhead
    const timePerChest = this.catchTime + this.timeToBite + this.catchOverhead
    const timePerNonFishItem = this.timeToBite + this.catchOverhead
    const fishChance = arrayChance(
      this.results.filter((f) => extractCalcFishId(f.Id) !== undefined)
    )
    const actualChestChance = fishChance * this.chestChance
    const nonFishChance = 1 - fishChance
    const cancelChance = 1 - (actualChestChance + nonFishChance)
    return (
      this.chestChance * timePerChest +
      nonFishChance * timePerNonFishItem +
      cancelChance * timePerNoChest
    )
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    if (extractCalcFishId(fish.Id) === undefined) {
      return this.timePerCast / fish.finalChance
    }
    return this.timePerCast / (fish.finalChance * this.chestChance)
  }
}

class CancelNoChestOtherFishStrategy extends Strategy {
  constructor(
    private fishCancelTime: number,
    private prioritisedFish: CalculatorResults[],
    private chestCancelTime: number,
    private chestChance: number,
    catchTime: number,
    timeToBite: number,
    catchOverhead: number,
    results: CalculatorResults[]
  ) {
    super(catchTime, timeToBite, catchOverhead, results)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const fishChance = arrayChance(
      this.results.filter((f) => extractCalcFishId(f.Id) !== undefined)
    )
    const nonFishChance = 1 - fishChance
    const priorityFishChance = arrayChance(this.prioritisedFish)
    const nonPriorityFishChance = 1 - (priorityFishChance + nonFishChance)

    const timeRightFishWithChest = this.catchTime + this.timeToBite + this.catchOverhead
    const timeRightFishNoChest = this.chestCancelTime + this.timeToBite + this.catchOverhead
    const timeWrongFishWithChest = this.fishCancelTime + this.timeToBite + this.catchOverhead
    const timeWrongFishNoChest =
      Math.min(this.fishCancelTime, this.chestCancelTime) + this.timeToBite + this.catchOverhead
    const timeNonFish = this.timeToBite + this.catchOverhead
    return (
      priorityFishChance * this.chestChance * timeRightFishWithChest +
      priorityFishChance * (1 - this.chestChance) * timeRightFishNoChest +
      nonPriorityFishChance * this.chestChance * timeWrongFishWithChest +
      nonPriorityFishChance * (1 - this.chestChance) * timeWrongFishNoChest +
      nonFishChance * timeNonFish
    )
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    if (extractCalcFishId(fish.Id) === undefined) {
      return this.timePerCast / fish.finalChance
    }
    if (!this.prioritisedFish.find((f) => checkIdEquality(f.Id, fish.Id))) {
      return undefined
    }
    return this.timePerCast / (fish.finalChance * this.chestChance)
  }
}

interface ChestStrategyInformation {
  cancelTime: number
  chestChance: number
}

interface FishStrategyInformation {
  cancelTime: number
  prioritisedFish: CalculatorResults[]
}

export function strategyFactory(
  catchTime: number,
  timeToBite: number,
  catchOverhead: number,
  result: CalculatorResults[],
  chest?: ChestStrategyInformation,
  fish?: FishStrategyInformation
): Strategy {
  if (fish && chest) {
    return new CancelNoChestOtherFishStrategy(
      fish.cancelTime,
      fish.prioritisedFish,
      chest.cancelTime,
      chest.chestChance,
      catchTime,
      timeToBite,
      catchOverhead,
      result
    )
  } else if (fish) {
    return new CancelOtherFishStrategy(
      fish.cancelTime,
      fish.prioritisedFish,
      catchTime,
      timeToBite,
      catchOverhead,
      result
    )
  } else if (chest) {
    return new CancelNoChestStrategy(
      chest.cancelTime,
      chest.chestChance,
      catchTime,
      timeToBite,
      catchOverhead,
      result
    )
  } else {
    return new DefaultStrategy(catchTime, timeToBite, catchOverhead, result)
  }
}

function arrayChance(fish: CalculatorResults[]) {
  return fish.map((f) => f.finalChance).reduce((a, b) => a + b, 0)
}
