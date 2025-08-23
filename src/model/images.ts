import type { Season, Tackle } from '.'

export const SeasonImages: Record<Season, string> = {
  Spring: 'https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png',
  Summer: 'https://stardewvalleywiki.com/mediawiki/images/d/d9/Sweet_Pea.png',
  Fall: 'https://stardewvalleywiki.com/mediawiki/images/3/31/Hazelnut.png',
  Winter: 'https://stardewvalleywiki.com/mediawiki/images/3/3f/Snow_Yam.png'
}

export const TackleImages: Record<Tackle, string> = {
  'Curiosity Lure': 'https://stardewvalleywiki.com/mediawiki/images/2/26/Curiosity_Lure.png',
  'Dressed Spinner': 'https://stardewvalleywiki.com/mediawiki/images/e/e8/Dressed_Spinner.png',
  'Quality Bobber': 'https://stardewvalleywiki.com/mediawiki/images/0/01/Quality_Bobber.png',
  'Treasure Hunter': 'https://stardewvalleywiki.com/mediawiki/images/7/79/Treasure_Hunter.png',
  Other: 'https://stardewvalleywiki.com/mediawiki/images/3/33/Sonar_Bobber.png'
}

export const BaitImages = {
  Deluxe: 'https://stardewvalleywiki.com/mediawiki/images/4/43/Deluxe_Bait.png',
  Wild: 'https://stardewvalleywiki.com/mediawiki/images/d/da/Wild_Bait.png',
  Magic: 'https://stardewvalleywiki.com/mediawiki/images/5/58/Magic_Bait.png',
  Magnet: 'https://stardewvalleywiki.com/mediawiki/images/8/8c/Magnet.png',
  Targeted: 'https://stardewvalleywiki.com/mediawiki/images/9/9b/Pink_Bait.png',
  Challenge: 'https://stardewvalleywiki.com/mediawiki/images/9/96/Challenge_Bait.png'
}

export const LocationImages: Record<string, string> = {
  Beach: 'https://stardewvalleywiki.com/mediawiki/images/e/ed/Clam.png',
  Submarine: 'https://stardewvalleywiki.com/mediawiki/images/c/c0/Anchor.png',
  'Mountain Lake': 'https://stardewvalleywiki.com/mediawiki/images/d/d4/Stone.png',
  Mines: 'https://stardewvalleywiki.com/mediawiki/images/b/b7/Pickaxe.png',
  'Cindersap Forest': 'https://stardewvalleywiki.com/mediawiki/images/9/90/Pine_Cone.png',
  'Secret Woods': 'https://stardewvalleywiki.com/mediawiki/images/e/ed/Hardwood.png',
  'Pelican Town': 'https://stardewvalleywiki.com/mediawiki/images/9/94/Gate.png',
  Desert: 'https://stardewvalleywiki.com/mediawiki/images/3/32/Cactus_Fruit.png',
  'Witch Swamp': 'https://stardewvalleywiki.com/mediawiki/images/f/f3/Void_Mayonnaise.png',
  'Ginger Island': 'https://stardewvalleywiki.com/mediawiki/images/8/85/Ginger.png'
}

const FishImages: Record<string, string> = {
  Pufferfish: 'https://stardewvalleywiki.com/mediawiki/images/b/ba/Pufferfish.png',
  Anchovy: 'https://stardewvalleywiki.com/mediawiki/images/7/79/Anchovy.png',
  Tuna: 'https://stardewvalleywiki.com/mediawiki/images/c/c5/Tuna.png',
  Sardine: 'https://stardewvalleywiki.com/mediawiki/images/0/04/Sardine.png',
  Bream: 'https://stardewvalleywiki.com/mediawiki/images/8/82/Bream.png',
  'Largemouth Bass': 'https://stardewvalleywiki.com/mediawiki/images/1/11/Largemouth_Bass.png',
  'Smallmouth Bass': 'https://stardewvalleywiki.com/mediawiki/images/a/a5/Smallmouth_Bass.png',
  'Rainbow Trout': 'https://stardewvalleywiki.com/mediawiki/images/1/14/Rainbow_Trout.png',
  Salmon: 'https://stardewvalleywiki.com/mediawiki/images/e/e0/Salmon.png',
  Walleye: 'https://stardewvalleywiki.com/mediawiki/images/0/05/Walleye.png',
  Perch: 'https://stardewvalleywiki.com/mediawiki/images/4/43/Perch.png',
  Carp: 'https://stardewvalleywiki.com/mediawiki/images/a/a8/Carp.png',
  Catfish: 'https://stardewvalleywiki.com/mediawiki/images/9/99/Catfish.png',
  Pike: 'https://stardewvalleywiki.com/mediawiki/images/3/31/Pike.png',
  Sunfish: 'https://stardewvalleywiki.com/mediawiki/images/5/56/Sunfish.png',
  'Red Mullet': 'https://stardewvalleywiki.com/mediawiki/images/f/f2/Red_Mullet.png',
  Herring: 'https://stardewvalleywiki.com/mediawiki/images/f/f1/Herring.png',
  Eel: 'https://stardewvalleywiki.com/mediawiki/images/9/91/Eel.png',
  Octopus: 'https://stardewvalleywiki.com/mediawiki/images/5/5a/Octopus.png',
  'Red Snapper': 'https://stardewvalleywiki.com/mediawiki/images/d/d3/Red_Snapper.png',
  Squid: 'https://stardewvalleywiki.com/mediawiki/images/8/81/Squid.png',
  'Sea Cucumber': 'https://stardewvalleywiki.com/mediawiki/images/a/a9/Sea_Cucumber.png',
  'Super Cucumber': 'https://stardewvalleywiki.com/mediawiki/images/d/d5/Super_Cucumber.png',
  Ghostfish: 'https://stardewvalleywiki.com/mediawiki/images/7/72/Ghostfish.png',
  Stonefish: 'https://stardewvalleywiki.com/mediawiki/images/0/03/Stonefish.png',
  'Ice Pip': 'https://stardewvalleywiki.com/mediawiki/images/6/63/Ice_Pip.png',
  'Lava Eel': 'https://stardewvalleywiki.com/mediawiki/images/1/12/Lava_Eel.png',
  Sandfish: 'https://stardewvalleywiki.com/mediawiki/images/b/bb/Sandfish.png',
  'Scorpion Carp': 'https://stardewvalleywiki.com/mediawiki/images/7/76/Scorpion_Carp.png',
  Flounder: 'https://stardewvalleywiki.com/mediawiki/images/8/85/Flounder.png',
  'Midnight Carp': 'https://stardewvalleywiki.com/mediawiki/images/3/33/Midnight_Carp.png',
  Sturgeon: 'https://stardewvalleywiki.com/mediawiki/images/4/42/Sturgeon.png',
  'Tiger Trout': 'https://stardewvalleywiki.com/mediawiki/images/0/01/Tiger_Trout.png',
  Bullhead: 'https://stardewvalleywiki.com/mediawiki/images/d/db/Bullhead.png',
  Tilapia: 'https://stardewvalleywiki.com/mediawiki/images/7/73/Tilapia.png',
  Chub: 'https://stardewvalleywiki.com/mediawiki/images/b/bd/Chub.png',
  Dorado: 'https://stardewvalleywiki.com/mediawiki/images/1/18/Dorado.png',
  Albacore: 'https://stardewvalleywiki.com/mediawiki/images/e/e1/Albacore.png',
  Shad: 'https://stardewvalleywiki.com/mediawiki/images/e/ef/Shad.png',
  Lingcod: 'https://stardewvalleywiki.com/mediawiki/images/8/87/Lingcod.png',
  Halibut: 'https://stardewvalleywiki.com/mediawiki/images/0/02/Halibut.png',
  Woodskip: 'https://stardewvalleywiki.com/mediawiki/images/9/97/Woodskip.png',
  'Void Salmon': 'https://stardewvalleywiki.com/mediawiki/images/a/ad/Void_Salmon.png',
  Slimejack: 'https://stardewvalleywiki.com/mediawiki/images/3/34/Slimejack.png',
  Stingray: 'https://stardewvalleywiki.com/mediawiki/images/3/3a/Stingray.png',
  Lionfish: 'https://stardewvalleywiki.com/mediawiki/images/b/bb/Lionfish.png',
  'Blue Discus': 'https://stardewvalleywiki.com/mediawiki/images/e/ee/Blue_Discus.png',
  Goby: 'https://stardewvalleywiki.com/mediawiki/images/6/67/Goby.png',
  'Midnight Squid': 'https://stardewvalleywiki.com/mediawiki/images/8/83/Midnight_Squid.png',
  'Spook Fish': 'https://stardewvalleywiki.com/mediawiki/images/8/8c/Spook_Fish.png',
  Blobfish: 'https://stardewvalleywiki.com/mediawiki/images/7/7f/Blobfish.png',
  Crimsonfish: 'https://stardewvalleywiki.com/mediawiki/images/d/dc/Crimsonfish.png',
  Angler: 'https://stardewvalleywiki.com/mediawiki/images/b/bf/Angler.png',
  Legend: 'https://stardewvalleywiki.com/mediawiki/images/1/10/Legend.png',
  Glacierfish: 'https://stardewvalleywiki.com/mediawiki/images/f/fd/Glacierfish.png',
  'Mutant Carp': 'https://stardewvalleywiki.com/mediawiki/images/c/cb/Mutant_Carp.png',
  'Son of Crimsonfish':
    'https://stardewvalleywiki.com/mediawiki/images/1/12/Son_of_Crimsonfish.png',
  'Ms. Angler': 'https://stardewvalleywiki.com/mediawiki/images/b/bb/Ms._Angler.png',
  'Legend II': 'https://stardewvalleywiki.com/mediawiki/images/7/7a/Legend_II.png',
  'Glacierfish Jr.': 'https://stardewvalleywiki.com/mediawiki/images/d/db/Glacierfish_Jr..png',
  'Radioactive Carp': 'https://stardewvalleywiki.com/mediawiki/images/5/57/Radioactive_Carp.png',
  Lobster: 'https://stardewvalleywiki.com/mediawiki/images/9/9f/Lobster.png',
  Clam: 'https://stardewvalleywiki.com/mediawiki/images/e/ed/Clam.png',
  Crayfish: 'https://stardewvalleywiki.com/mediawiki/images/5/53/Crayfish.png',
  Crab: 'https://stardewvalleywiki.com/mediawiki/images/6/63/Crab.png',
  Cockle: 'https://stardewvalleywiki.com/mediawiki/images/a/ad/Cockle.png',
  Mussel: 'https://stardewvalleywiki.com/mediawiki/images/a/aa/Mussel.png',
  Shrimp: 'https://stardewvalleywiki.com/mediawiki/images/9/91/Shrimp.png',
  Snail: 'https://stardewvalleywiki.com/mediawiki/images/d/d2/Snail.png',
  Periwinkle: 'https://stardewvalleywiki.com/mediawiki/images/1/1d/Periwinkle.png',
  Oyster: 'https://stardewvalleywiki.com/mediawiki/images/5/54/Oyster.png',
  Seaweed: 'https://stardewvalleywiki.com/mediawiki/images/1/13/Seaweed.png',
  'Green Algae': 'https://stardewvalleywiki.com/mediawiki/images/6/6d/Green_Algae.png',
  'White Algae': 'https://stardewvalleywiki.com/mediawiki/images/f/f7/White_Algae.png',
  'Sea Jelly': 'https://stardewvalleywiki.com/mediawiki/images/d/d5/Sea_Jelly.png',
  'River Jelly': 'https://stardewvalleywiki.com/mediawiki/images/8/80/River_Jelly.png',
  'Cave Jelly': 'https://stardewvalleywiki.com/mediawiki/images/0/0a/Cave_Jelly.png',
  Trash: 'https://stardewvalleywiki.com/mediawiki/images/7/7c/Trash_%28item%29.png',
  Pearl: 'https://stardewvalleywiki.com/mediawiki/images/7/73/Pearl.png',
  'Wall Basket': 'https://stardewvalleywiki.com/mediawiki/images/c/c3/Wall_Basket.png',
  'Fossilized Spine': 'https://stardewvalleywiki.com/mediawiki/images/5/5c/Fossilized_Spine.png',
  'Gourmand Statue': 'https://stardewvalleywiki.com/mediawiki/images/d/d6/Gourmand_Statue.png'
}

export function getFishImage(name: string): string | undefined {
  if (name.includes('(')) {
    const actualName = name.substring(0, name.indexOf('(') - 1)
    return FishImages[actualName]
  }
  return FishImages[name]
}
