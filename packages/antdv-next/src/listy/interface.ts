import type {
  ListyClassNames,
  ListyRef,
  ListyScrollToConfig,
  ListyStyles,
  ScrollAlign,
  ListyProps as VcListyProps,
} from '@v-c/listy'
import type { StyleValue } from 'vue'
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
  style?: StyleValue
  classes?: ListyClassNamesType
  styles?: ListyStylesType
  itemRender?: (item: any, index: number) => VueNode
  /**
   * @version >= 1.5.5
   * @nameZH 是否启用行 hover 效果
   * @nameEN Whether to enable the row hover effect
   * @desc 是否在鼠标悬停行时显示背景色，默认 true。
   * @descEN Whether to show the hover background color on row hover, default true.
   */
  rowHoverable?: boolean
}
