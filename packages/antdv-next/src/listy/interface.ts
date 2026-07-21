import type {
  ListyClassNames,
  ListyRef,
  ListyScrollToConfig,
  ListyStyles,
  ListyProps as RcListyProps,
  ScrollAlign,
} from '@v-c/listy'
import type { CSSProperties, VNode } from 'vue'

export type { ListyClassNames, ListyRef, ListyScrollToConfig, ListyStyles, ScrollAlign }

export interface ListyProps
  extends Omit<RcListyProps, 'itemHeight' | 'direction' | 'classNames' | 'itemRender'> {
  rootClassName?: string
  class?: string
  style?: CSSProperties
  classes?: ListyClassNames
  itemRender?: (item: any) => VNode
}
