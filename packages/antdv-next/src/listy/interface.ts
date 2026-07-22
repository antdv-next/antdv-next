import type {
  ListyClassNames,
  ListyRef,
  ListyScrollToConfig,
  ListyStyles,
  ListyProps as RcListyProps,
  ScrollAlign,
} from '@v-c/listy'
import type { CSSProperties, VNode } from 'vue'
import type { SemanticType } from '../_util/hooks/useMergeSemantic'

export type { ListyClassNames, ListyRef, ListyScrollToConfig, ListyStyles, ScrollAlign }

export interface ListySemanticType {
  classes?: ListyClassNames
  styles?: ListyStyles
}

type ListyClassNamesType = SemanticType<ListyClassNames, ListyProps>
type ListyStylesType = SemanticType<ListyStyles, ListyProps>

export interface ListyProps
  extends Omit<RcListyProps, 'itemHeight' | 'direction' | 'classNames' | 'styles' | 'itemRender'> {
  rootClassName?: string
  class?: string
  style?: CSSProperties
  classes?: ListyClassNamesType
  styles?: ListyStylesType
  itemRender?: (item: any) => VNode
}
