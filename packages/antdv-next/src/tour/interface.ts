import type {
  TourProps as VcTourProps,
  TourStepProps as VcTourStepProps,
} from '@v-c/tour'
import type { CSSProperties } from 'vue'
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'

export type TourSemanticName = keyof TourSemanticClassNames & keyof TourSemanticStyles

export interface TourSemanticClassNames {
  root?: string
  cover?: string
  mask?: string
  section?: string
  footer?: string
  actions?: string
  indicator?: string
  indicators?: string
  header?: string
  title?: string
  description?: string
}

export interface TourSemanticStyles {
  root?: CSSProperties
  cover?: CSSProperties
  mask?: CSSProperties
  section?: CSSProperties
  footer?: CSSProperties
  actions?: CSSProperties
  indicator?: CSSProperties
  indicators?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
}

export type TourClassNamesType = SemanticClassNamesType<TourProps, TourSemanticClassNames>

export type TourStylesType = SemanticStylesType<TourProps, TourSemanticStyles>

export interface TourProps extends ComponentBaseProps, Omit<
  VcTourProps,
  'classNames'
  | 'styles'
  | 'renderPanel'
  | 'rootClassName'
  | 'onClose'
  | 'onFinish'
  | 'onChange'
  | 'onPopupAlign'
  | 'className'
> {
  steps?: TourStepProps[]
  prefixCls?: string
  current?: number
  indicatorsRender?: (current: number, total: number) => any
  actionsRender?: TourStepProps['actionsRender']
  // default type, affects the background color and text color
  type?: 'default' | 'primary'
  classes?: TourClassNamesType
  styles?: TourStylesType
  // className?: string
  // style?: CSSProperties
}

export interface TourEmits {
  'change': (current: number) => void
  'close': (current: number) => void
  'finish': () => void
  'update:open': (open: boolean) => void
  'update:current': (current: number) => void
  // @ts-expect-error this is defined in VcTourProps
  'popupAlign': VcTourProps['onPopupAlign']
}

export interface TourSlots {
  actionsRender: (originNode: any, info: { current: number, total: number }) => any
  indicatorsRender: (current: number, total: number) => any
  nextButton: (params: { current: number, isFirst: boolean, isLast: boolean }) => any
  prevButton: (params: { current: number, isFirst: boolean, isLast: boolean }) => any
  coverRender: (params: { step: TourStepProps, index: number }) => any
  titleRender: (params: { step: TourStepProps, index: number }) => any
  descriptionRender: (params: { step: TourStepProps, index: number }) => any
}

export interface TourStepProps extends Omit<VcTourStepProps, 'className'> {
  cover?: VueNode
  nextButtonProps?: {
    children?: VueNode
    onClick?: () => void
    class?: string
    style?: CSSProperties
  }
  prevButtonProps?: {
    children?: VueNode
    onClick?: () => void
    class?: string
    style?: CSSProperties
  }
  indicatorsRender?: (current: number, total: number) => any
  actionsRender?: (originNode: any, info: { current: number, total: number }) => any
  // default type, affects the background color and text color
  type?: 'default' | 'primary'
  classes?: SemanticClassNames<TourSemanticName>
  styles?: SemanticStyles<TourSemanticName>
  class?: string
}

export interface TourLocale {
  Next: string
  Previous: string
  Finish: string
}
