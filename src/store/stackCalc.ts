import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Fish, Location } from '@/model'
import { getFishFromLocationAndSeason } from '@/fishcalc/lib/locationdata'
import { getCalculatorLocation } from '@/model/location'
import { getNameById } from '@/model/Fish'

export const stackCalcStore = defineStore('stackCalc', () => {
  const location = ref<Location>({ location: 'Beach', subLocation: 'Default' })

  const fishCalcLocation = computed(() => getCalculatorLocation(location.value))

  const fishForLocation = computed<Fish[]>(() =>
    getFishFromLocationAndSeason(fishCalcLocation.value.location, 'MagicBait').map((f) => ({
      Id: f.Id,
      displayname: getNameById(f.Id)
    }))
  )

  return { location, fishForLocation }
})
