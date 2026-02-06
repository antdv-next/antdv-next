import type { PaginationProps as VcPaginationProps } from '@v-c/pagination'
import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { SizeType } from '../config-provider/SizeContext'
import type { SelectProps } from '../select'

export interface PaginationLocale {
  // Options
  items_per_page?: string
  jump_to?: string
  jump_to_confirm?: string
  page?: string

  // Pagination
  prev_page?: string
  next_page?: string
  prev_5?: string
  next_5?: string
  prev_3?: string
  next_3?: string
  page_size?: string
}

export type SemanticName = keyof PaginationSemanticClassNames & keyof PaginationSemanticStyles

export type PaginationSemanticName = SemanticName

export interface PaginationSemanticClassNames {
  root?: string
  item?: string
}

export interface PaginationSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export type PaginationClassNamesType = SemanticClassNamesType<
  PaginationProps,
  PaginationSemanticClassNames
>

export type PaginationStylesType = SemanticStylesType<PaginationProps, PaginationSemanticStyles>

export interface PaginationProps extends Omit<VcPaginationProps, | 'className'
  | 'style'
  | 'classNames'
  | 'styles'
  | 'locale'
  | 'showSizeChanger'
  | 'pageSizeOptions'
  | 'prevIcon'
  | 'nextIcon'
  | 'jumpPrevIcon'
  | 'jumpNextIcon'
  | 'onChange'
  | 'onShowSizeChange'> {
  showQuickJumper?: boolean | { goButton?: VueNode }
  size?: SizeType
  responsive?: boolean
  totalBoundaryShowSizeChanger?: number
  rootClass?: string
  showSizeChanger?: boolean | SelectProps
  pageSizeOptions?: (string | number)[]
  classes?: PaginationClassNamesType
  styles?: PaginationStylesType
  locale?: PaginationLocale
  prevIcon?: VueNode
  nextIcon?: VueNode
  jumpPrevIcon?: VueNode
  jumpNextIcon?: VueNode
  /** @deprecated Not official support. Will be removed in next major version. */
  selectComponentClass?: any
}

export type PaginationPosition = 'top' | 'bottom' | 'both'

export interface PaginationConfig extends Omit<PaginationProps, 'rootClass'> {
  position?: PaginationPosition
}

export interface PaginationEmits {
  'change': (page: number, pageSize: number) => void
  'showSizeChange': (current: number, size: number) => void
  'update:current': (page: number) => void
  'update:pageSize': (size: number) => void
}

export interface PaginationSlots {
  itemRender?: (ctx: { page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: VueNode }) => any
  showTotal?: (ctx: { total: number, range: [number, number] }) => any
  prevIcon?: () => any
  nextIcon?: () => any
  jumpPrevIcon?: () => any
  jumpNextIcon?: () => any
}
