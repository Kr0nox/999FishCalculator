import type { Bait, Tackle } from "@/model"

export function getChestChance(tackles: Tackle[], bait: Bait, luckBuffs: number) {
  let chance = 15 + 15 // base + pirate
  chance += 1.25 // special charm
  chance += tackles.filter(t => t == 'Treasure Hunter').length * 5
  chance += luckBuffs * 0.5
  if (bait.name === 'Magnet') {
    chance += 15
  }
  return chance / 100
}