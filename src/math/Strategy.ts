import type { CalculatorResults } from '@/fishcalc'
import { checkIdEquality } from '@/model/Fish'

abstract class Strategy {
  protected timePerCast!: number

  constructor(
    protected catchTime: number,
    protected timeToBite: number,
    protected catchOverhead: number
  ) {}
  /**
   * Calculates the time a single cast takes
   * @returns Average duration of a cast
   */
  abstract calculateTimePerCast(): number

  abstract calculateTimePerCatch(fish: CalculatorResults): number | undefined
}

class DefaultStrategy extends Strategy {
  constructor(catchTime: number, timeToBite: number, catchOverhead: number) {
    super(catchTime, timeToBite, catchOverhead)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timePerCatch = this.catchTime + this.timeToBite + this.catchOverhead
    return timePerCatch
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    return this.timePerCast / fish.finalChance
  }
}
class CancelOtherFishStrategy extends Strategy {
  private priorityChance: number

  constructor(
    private cancelTime: number,
    private prioritisedFish: CalculatorResults[],
    catchTime: number,
    timeToBite: number,
    catchOverhead: number
  ) {
    super(catchTime, timeToBite, catchOverhead)
    this.priorityChance = prioritisedFish.reduce((acc, fish) => acc + fish.finalChance, 0)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timePerNonPriorityCatch = this.cancelTime + this.timeToBite + this.catchOverhead
    const timePerPriorityCatch = this.catchTime + this.timeToBite + this.catchOverhead
    return (
      this.priorityChance * timePerPriorityCatch +
      (1 - this.priorityChance) * timePerNonPriorityCatch
    )
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    if (!this.prioritisedFish.find((f) => checkIdEquality(f.Id, fish.Id))) {
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
    catchOverhead: number
  ) {
    super(catchTime, timeToBite, catchOverhead)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timePerNoChest = this.cancelTime + this.timeToBite + this.catchOverhead
    const timePerChest = this.catchTime + this.timeToBite + this.catchOverhead
    return this.chestChance * timePerChest + (1 - this.chestChance) * timePerNoChest
  }

  calculateTimePerCatch(fish: CalculatorResults) {
    return this.timePerCast / (fish.finalChance * this.chestChance)
  }
}

class CancelNoChestOtherFishStrategy extends Strategy {
  private priorityChance: number

  constructor(
    private fishCancelTime: number,
    private prioritisedFish: CalculatorResults[],
    private chestCancelTime: number,
    private chestChance: number,
    catchTime: number,
    timeToBite: number,
    catchOverhead: number
  ) {
    super(catchTime, timeToBite, catchOverhead)
    this.priorityChance = prioritisedFish.reduce((acc, fish) => acc + fish.finalChance, 0)
    this.timePerCast = this.calculateTimePerCast()
  }

  calculateTimePerCast() {
    const timeRightFishWithChest = this.catchTime + this.timeToBite + this.catchOverhead
    const timeRightFishNoChest = this.chestCancelTime + this.timeToBite + this.catchOverhead
    const timeWrongFishWithChest = this.fishCancelTime + this.timeToBite + this.catchOverhead
    const timeWrongFishNoChest =
      Math.min(this.fishCancelTime, this.chestCancelTime) + this.timeToBite + this.catchOverhead
    return (
      this.priorityChance * this.chestChance * timeRightFishWithChest +
      this.priorityChance * (1 - this.chestChance) * timeRightFishNoChest +
      (1 - this.priorityChance) * this.chestChance * timeWrongFishWithChest +
      (1 - this.priorityChance) * (1 - this.chestChance) * timeWrongFishNoChest
    )
  }

  calculateTimePerCatch(fish: CalculatorResults) {
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
      catchOverhead
    )
  } else if (fish) {
    return new CancelOtherFishStrategy(
      fish.cancelTime,
      fish.prioritisedFish,
      catchTime,
      timeToBite,
      catchOverhead
    )
  } else if (chest) {
    return new CancelNoChestStrategy(
      chest.cancelTime,
      chest.chestChance,
      catchTime,
      timeToBite,
      catchOverhead
    )
  } else {
    return new DefaultStrategy(catchTime, timeToBite, catchOverhead)
  }
}
