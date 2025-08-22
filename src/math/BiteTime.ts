import type { Bait, Tackle } from '@/model'

function getBiteTimeMultiplier(bait: Bait): number {
  /**
   * Then, using Bait, Magnet, Magic Bait, or any type of Targeted Bait decreases both the minimum and maximum amount of time it takes for a fish to bite by 50%. Wild Bait and Challenge Bait further decreases this by another 25%, for a total of a 62.5% decrease compared to no bait. Deluxe Bait decreases both the minimum and maximum amount of time it takes for a fish to bite by 67% compared to no bait.
   */
  if (bait.name == 'Deluxe') {
    return 0.33
  }
  let multiplier = 1
  if (
    bait.name == 'Magnet' ||
    bait.name == 'Magic' ||
    bait.name == 'Targeted' ||
    bait.name == 'Wild' ||
    bait.name == 'Challenge'
  ) {
    multiplier *= 0.5
  }
  if (bait.name == 'Wild' || bait.name == 'Challenge') {
    multiplier *= 0.75
  }

  return multiplier
}

export function getTimeToBite(tackles: Tackle[], fishingLevel: number, bait: Bait): number {
  let min = 0.6
  let max = 30
  max -= tackles.filter((t) => t == 'Dressed Spinner').length * 10
  max -= fishingLevel * 0.25
  const multiplier = getBiteTimeMultiplier(bait)
  max *= multiplier
  min *= multiplier
  max *= 0.75 // first bite is always faster
  min *= 0.75 // first bite is always faster
  min = Math.max(min, 0.5) // minimum time to bite is 0.5 seconds
  return (max + min) / 2
}
