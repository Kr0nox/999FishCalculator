import type { CalcLocation } from '@/model/location'
import { TacticCalculator, type InputFish } from './StackTactic'

self.onmessage = function (e: MessageEvent<Message>) {
  const calculator = new TacticCalculator(e.data.fish, e.data.location)
  calculator.setProgressListener((report) => {
    self.postMessage(report)
  })
  calculator.buildAllConfigurations()
  calculator.calculateResultsForTactics()
}

export interface Message {
  fish: InputFish[]
  location: CalcLocation
}
