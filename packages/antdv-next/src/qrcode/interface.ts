import type { QRProps } from '@v-c/qrcode'
import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { Locale } from '../locale'

export type QRStatus = 'active' | 'expired' | 'loading' | 'scanned'
export interface StatusRenderInfo {
  status: Exclude<QRStatus, 'active'>
  locale: Locale['QRCode']
  onRefresh?: () => void
}

type ImageSettings = QRProps['imageSettings']

export type { ImageSettings, QRProps }

export type QRPropsCanvas = QRProps
export type QRPropsSvg = QRProps

export type QRCodeSemanticName = keyof QRCodeSemanticClassNames & keyof QRCodeSemanticStyles

export interface QRCodeSemanticClassNames {
  root?: string
  cover?: string
}

export interface QRCodeSemanticStyles {
  root?: CSSProperties
  cover?: CSSProperties
}

export type QRCodeClassNamesType = SemanticClassNamesType<QRCodeProps, QRCodeSemanticClassNames>

export type QRCodeStylesType = SemanticStylesType<QRCodeProps, QRCodeSemanticStyles>

export interface QRCodeProps extends QRProps, ComponentBaseProps {
  type?: 'canvas' | 'svg'
  icon?: string
  iconSize?: number | { width: number, height: number }
  bordered?: boolean
  errorLevel?: 'L' | 'M' | 'Q' | 'H'
  status?: QRStatus
  statusRender?: (info: StatusRenderInfo) => any
  color?: any
  classes?: QRCodeClassNamesType
  styles?: QRCodeStylesType
}

export interface QRCodeSlots {
  statusRender?: (info: StatusRenderInfo) => any
}

export interface QRCodeEmits {
  refresh: () => void
}
