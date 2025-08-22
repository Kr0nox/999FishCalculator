import { Quality, type Tackle } from '@/model'

function applyQualityModifiers(
  quality: Quality,
  perfectCatch: boolean,
  qualityBobberCount: number
) {
  if (qualityBobberCount == 1 && !perfectCatch) {
    return buildMap(Quality.SILVER, Quality.GOLD, Quality.IRIDIUM)[quality]
  }
  if (qualityBobberCount == 2 && !perfectCatch) {
    return buildMap(Quality.GOLD, Quality.IRIDIUM, Quality.IRIDIUM)[quality]
  }
  if (qualityBobberCount == 0 && perfectCatch) {
    return buildMap(Quality.BASE, Quality.GOLD, Quality.IRIDIUM)[quality]
  }
  if (qualityBobberCount == 1 && perfectCatch) {
    return buildMap(Quality.GOLD, Quality.IRIDIUM, Quality.IRIDIUM)[quality]
  }
  if (qualityBobberCount == 2 && perfectCatch) {
    return buildMap(Quality.IRIDIUM, Quality.IRIDIUM, Quality.IRIDIUM)[quality]
  }

  return quality

  function buildMap(
    fromNormal: Quality,
    fromSilver: Quality,
    fromGold: Quality
  ): Record<Quality, Quality> {
    return {
      [Quality.BASE]: fromNormal,
      [Quality.SILVER]: fromSilver,
      [Quality.GOLD]: fromGold,
      [Quality.IRIDIUM]: Quality.IRIDIUM
    }
  }
}

function getQualityChances(depth: number, fishingLevel: number) {
  if (depth == 1) {
    if (fishingLevel <= 13) {
      return buildMap(1)
    } else if (fishingLevel == 14 || fishingLevel == 15) {
      return buildMap(0.67, 0.33)
    } else if (fishingLevel == 16 || fishingLevel == 17) {
      return buildMap(0.1, 0.9)
    } else if (fishingLevel == 18 || fishingLevel == 19) {
      return buildMap(0, 1)
    }
  }
  if (depth == 2) {
    if (fishingLevel == 0 || fishingLevel == 1) {
      return buildMap(0.73, 0.27)
    } else if (fishingLevel == 2 || fishingLevel == 3) {
      return buildMap(0.67, 0.33)
    } else if (fishingLevel == 4 || fishingLevel == 5) {
      return buildMap(0.56, 0.44)
    } else if (fishingLevel == 6 || fishingLevel == 7) {
      return buildMap(0.33, 0.67)
    } else if (fishingLevel >= 8 && fishingLevel <= 13) {
      return buildMap(0, 1)
    } else if (fishingLevel == 14 || fishingLevel == 15) {
      return buildMap(0, 0.67, 0.33)
    } else if (fishingLevel == 16 || fishingLevel == 17) {
      return buildMap(0, 0.1, 0.9)
    } else if (fishingLevel == 18 || fishingLevel == 19) {
      return buildMap(0, 0, 1)
    }
  }
  // depth 4 does not exist
  if (depth == 3 || depth == 4) {
    if (fishingLevel == 0 || fishingLevel == 1) {
      return buildMap(0.42, 0.57, 0.01)
    } else if (fishingLevel == 2 || fishingLevel == 3) {
      return buildMap(0.27, 0.71, 0.01)
    } else if (fishingLevel == 4 || fishingLevel == 5) {
      return buildMap(0.3, 0.95, 0.02)
    } else if (fishingLevel == 6 || fishingLevel == 7) {
      return buildMap(0, 0.98, 0.02)
    } else if (fishingLevel == 8 || fishingLevel == 9) {
      return buildMap(0, 0.95, 0.05)
    } else if (fishingLevel == 10 || fishingLevel == 11) {
      return buildMap(0, 0.1, 0.9)
    } else if (fishingLevel >= 12 && fishingLevel <= 19) {
      return buildMap(0, 0, 1)
    }
  }
  if (depth == 5) {
    if (fishingLevel == 0 || fishingLevel == 1) {
      return buildMap(0.2, 0.39, 0.41)
    } else if (fishingLevel == 2 || fishingLevel == 3) {
      return buildMap(0, 0.49, 0.51)
    } else if (fishingLevel == 4 || fishingLevel == 5) {
      return buildMap(0, 0.32, 0.68)
    } else if (fishingLevel >= 6 && fishingLevel <= 19) {
      return buildMap(0, 0, 1)
    }
  }

  return buildMap(1, 0, 0)

  function buildMap(
    fromNormal: number = 0,
    fromSilver: number = 0,
    fromGold: number = 0
  ): Record<Quality, number> {
    return {
      [Quality.BASE]: fromNormal,
      [Quality.SILVER]: fromSilver,
      [Quality.GOLD]: fromGold,
      [Quality.IRIDIUM]: 0
    }
  }
}

/*

export function getFishSizeFactor(depth: number, fishingLevel: number) {
  return {
    min: sizeFactor(90),
    max: sizeFactor(110)
  }

  function sizeFactor(r: number) {
    const v = depth/5 * (fishingLevel+2)/10 * r/100
    return Math.min(Math.max(v, 0), 1)
  }
}

export function getQualityChanceDistribution(min: number, max: number) {
  if (min == max) {
    return {
    [Quality.BASE]: min < 0.33 ? 1 : 0,
    [Quality.SILVER]: min >= 0.33 && min < 0.66 ? 1 : 0,
    [Quality.GOLD]: min >= 0.66 ? 1 : 0,
    [Quality.IRIDIUM]: 0
  }
  }
  const range = max - min
  return {
    [Quality.BASE]: calculateOverlap(0, 0.33) / range,
    [Quality.SILVER]: calculateOverlap(0.33, 0) / range,
    [Quality.GOLD]: calculateOverlap(0.33, 1) / range,
    [Quality.IRIDIUM]: 0
  }

  function calculateOverlap(low: number, high: number): number {
    const start = Math.max(min, low)
    const end = Math.min(max, high)
    return Math.max(0, end - start)
  }

}*/

export function getChanceForQuality(
  goal: Quality,
  depth: number,
  fishingLevel: number,
  tackles: Tackle[]
) {
  const qualityBobberCount = tackles.filter((t) => t == 'Quality Bobber').length
  const base = getQualityChances(depth, fishingLevel)
  const resultNonPerfect: Record<Quality, number> = {
    [Quality.BASE]: 0,
    [Quality.SILVER]: 0,
    [Quality.GOLD]: 0,
    [Quality.IRIDIUM]: 0
  }
  const resultPerfect: Record<Quality, number> = {
    [Quality.BASE]: 0,
    [Quality.SILVER]: 0,
    [Quality.GOLD]: 0,
    [Quality.IRIDIUM]: 0
  }
  for (const q of [Quality.BASE, Quality.SILVER, Quality.GOLD, Quality.IRIDIUM]) {
    resultNonPerfect[applyQualityModifiers(q, false, qualityBobberCount)] += base[q]
    resultPerfect[applyQualityModifiers(q, true, qualityBobberCount)] += base[q]
  }

  return {
    nonPerfect: resultNonPerfect[goal],
    perfect: resultPerfect[goal]
  }
}
