import type {
  ListyClassNames,
  ListyStyles,
  ScrollAlign,
  ListyProps as VcListyProps,
} from '@v-c/listy'
import type { Key } from '@v-c/util/dist/type'
import type { StyleValue } from 'vue'
import type { SemanticType } from '../_util/hooks/useMergeSemantic'
import type { VueNode } from '../_util/type'

export type { ListyClassNames, ListyStyles, ScrollAlign }

export interface ListyKeyScrollToConfig {
  key: Key
  align?: ScrollAlign
  offset?: number
}

export interface ListyGroupScrollToConfig {
  groupKey: Key
  align?: ScrollAlign
  offset?: number
}

export interface ListyPositionScrollToConfig {
  left?: number
  top?: number
}

export type ListyScrollToConfig
  = | number
    | null
    | ListyKeyScrollToConfig
    | ListyPositionScrollToConfig
    | ListyGroupScrollToConfig

export interface ListyRef {
  scrollTo: (config?: ListyScrollToConfig) => void
}

export interface ListySemanticType {
  classes?: ListyClassNames
  styles?: ListyStyles
}

type ListyClassNamesType = SemanticType<ListyProps, ListyClassNames>
type ListyStylesType = SemanticType<ListyProps, ListyStyles>

export interface ListyProps
  extends Omit<VcListyProps, 'itemHeight' | 'direction' | 'classNames' | 'styles' | 'itemRender' | 'onScroll'> {
  rootClass?: string
  class?: string
  style?: StyleValue
  classes?: ListyClassNamesType
  styles?: ListyStylesType
  itemRender?: (item: any, index: number) => VueNode
  /**
   * Whether rows are hoverable
   * @default true
   */
  rowHoverable?: boolean
}
