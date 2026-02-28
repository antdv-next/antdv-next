import type { App } from 'vue'
import type { InternalStatisticProps } from './Statistic'
import type { InternalStatisticTimerProps } from './Timer'
import Statistic from './Statistic'
import Timer from './Timer'

export type StatisticProps = InternalStatisticProps
export type StatisticTimerProps = InternalStatisticTimerProps
export const StatisticTimer = Timer

;(Statistic as any).install = (app: App) => {
  app.component(Statistic.name, Statistic)
  app.component(StatisticTimer.name, StatisticTimer)
}

;(Statistic as any).Timer = Timer

export default Statistic as typeof Statistic & {
  Timer: typeof Timer
}
