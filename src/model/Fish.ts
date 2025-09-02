import { getFishIds, getFishParameters } from '@/fishcalc/lib/fishdata'
import type { Fish } from '.'

export const FishList: Fish[] = getFishIds().map((id) => ({
  Id: id,
  displayname: getFishParameters(id)?.name ?? 'Unknown Fish'
}))

export const BaitableFish: Fish[] = FishList.filter(
  (fish) =>
    ![
      'Crab',
      'Cockle',
      'Mussel',
      'Shrimp',
      'Snail',
      'Periwinkle',
      'Oyster',
      'Seaweed',
      'Green Algae',
      'White Algae',
      'Sea Jelly',
      'River Jelly',
      'Cave Jelly',
      'Trash',
      'Clam',
      'Crayfish',
      'Lobster'
    ].includes(fish.displayname)
)

export function checkIdEquality(id1: string, id2: string) {
  return getIdNumber(id1) == getIdNumber(id2)
}

export function getIdNumber(id: string): string {
  return id.startsWith('(') ? id.substring(3) : id
}
