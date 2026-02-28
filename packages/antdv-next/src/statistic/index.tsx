import type { App } from 'vue'
import Statistic from './Statistic'
import Timer from './Timer'

export type { InternalStatisticProps as StatisticProps } from './Statistic'
export type { InternalStatisticTimerProps as StatisticTimerProps } from './Timer'
export const StatisticTimer = Timer

;(Statistic as any).install = (app: App) => {
  app.component(Statistic.name, Statistic)
  app.component(StatisticTimer.name, StatisticTimer)
}

;(Statistic as any).Timer = Timer

export default Statistic as typeof Statistic & {
  Timer: typeof Timer
}
