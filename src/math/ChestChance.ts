import type { Bait, Tackle } from '@/model'

export function getChestChance(
  tackles: Tackle[],
  bait: Bait,
  dailyLuck: number,
  luckBuffs: number,
  pirateProfession: boolean
) {
  let chance = 0.15
  if (pirateProfession) {
    chance += 0.15
  }
  chance += dailyLuck / 2
  chance += 0.0125 // special charm
  chance += tackles.filter((t) => t == 'Treasure Hunter').length * 0.05
  chance += luckBuffs * 0.005
  if (bait.name === 'Magnet') {
    chance += 0.15
  }
  return chance
}

export function roeAmount(dailyLuck: number) {
  if (dailyLuck + 0.1 + 0.025 < 0) {
    return 1.5
  }

  // the chance for one to be added the amount and it to be doubled is the same
  const rollChance = 0.1 + dailyLuck + 0.025
  const notRollChance = 1 - rollChance
  /*
    1: 1,NotAdd,NotDouble
    2: 1,NotAdd,Double; 1,Add,NotDouble; 2,NotAdd,NotDouble
    3: 2,Add,NotDouble
    4: 1,Add,Double; 2,NotAdd,Double
    6: 2,Add,Double
   */
  const amount =
    0.5 *
    (1 * (notRollChance * notRollChance) +
      2 * (2 * notRollChance * rollChance + notRollChance * notRollChance) +
      3 * (rollChance * notRollChance) +
      4 * (rollChance * rollChance + notRollChance * rollChance) +
      6 * (rollChance * rollChance))
  return amount
}
