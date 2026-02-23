import type { GlobalToken } from '../../theme/internal'
import { defaultPrefixCls } from '../../config-provider/context.ts'

export const TARGET_CLS = `${defaultPrefixCls}-wave-target`

export type WaveComponent = 'Tag' | 'Button' | 'Checkbox' | 'Radio' | 'Switch' | 'Steps'
export type WaveColorSource = 'color' | 'backgroundColor' | 'borderColor' | null

export type ShowWaveEffect = (
  element: HTMLElement,
  info: {
    className: string
    token: GlobalToken
    component?: WaveComponent
    colorSource?: WaveColorSource
    event: MouseEvent
    hashId: string
  },
) => void

export type ShowWave = (event: MouseEvent) => void
