import type {
  ListyClassNames,
  ListyRef,
  ListyScrollToConfig,
  ListyStyles,
  ScrollAlign,
  ListyProps as VcListyProps,
} from '@v-c/listy'
import type { CSSProperties } from 'vue'
import type { SemanticType } from '../_util/hooks/useMergeSemantic'
import type { VueNode } from '../_util/type'

export type { ListyClassNames, ListyRef, ListyScrollToConfig, ListyStyles, ScrollAlign }

export interface ListySemanticType {
  classes?: ListyClassNames
  styles?: ListyStyles
}

type ListyClassNamesType = SemanticType<ListyClassNames, ListyProps>
type ListyStylesType = SemanticType<ListyStyles, ListyProps>

export interface ListyProps
  extends Omit<VcListyProps, 'itemHeight' | 'direction' | 'classNames' | 'styles' | 'itemRender'> {
  rootClass?: string
  class?: string
  style?: CSSProperties
  classes?: ListyClassNamesType
  styles?: ListyStylesType
  itemRender?: (item: any, index: number) => VueNode
}
