import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'

export type TransferKey = string | number

export type PaginationType = boolean | {
  pageSize?: number
  simple?: boolean
  showSizeChanger?: boolean
  showLessItems?: boolean
}

export type TransferDirection = 'left' | 'right'

export interface RenderResultObject {
  label: VueNode
  value: string
}

export type RenderResult = VueNode | RenderResultObject | string | null

export interface TransferItem {
  key?: TransferKey
  title?: string
  description?: string
  disabled?: boolean
  [name: string]: any
}

export type KeyWise<T> = T & { key: TransferKey }

export type KeyWiseTransferItem = KeyWise<TransferItem>

export type TransferRender<RecordType> = (item: RecordType) => RenderResult

export interface ListStyle {
  direction: TransferDirection
}

export type SelectAllLabel = VueNode | ((info: { selectedCount: number, totalCount: number }) => VueNode)

export interface TransferLocale {
  titles?: VueNode[]
  notFoundContent?: VueNode | VueNode[]
  searchPlaceholder: string
  itemUnit: string
  itemsUnit: string
  remove?: string
  selectAll?: string
  deselectAll?: string
  selectCurrent?: string
  selectInvert?: string
  removeAll?: string
  removeCurrent?: string
}

export interface TransferSearchOption {
  placeholder?: string
  defaultValue?: string
}

export interface TransferSemanticClassNames {
  root?: string
  section?: string
  header?: string
  title?: string
  body?: string
  list?: string
  item?: string
  itemIcon?: string
  itemContent?: string
  footer?: string
  actions?: string
}

export interface TransferSemanticStyles {
  root?: CSSProperties
  section?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  body?: CSSProperties
  list?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemContent?: CSSProperties
  footer?: CSSProperties
  actions?: CSSProperties
}

export type TransferClassNamesType = SemanticClassNamesType<
  TransferProps,
  TransferSemanticClassNames
>

export type TransferStylesType = SemanticStylesType<TransferProps, TransferSemanticStyles>

export interface TransferListProps<RecordType> extends TransferLocale {
  prefixCls: string
  style?: CSSProperties
  classes?: TransferSemanticClassNames
  styles?: TransferSemanticStyles

  titleText: VueNode
  dataSource: RecordType[]
  filterOption?: (filterText: string, item: RecordType, direction: TransferDirection) => boolean
  checkedKeys: TransferKey[]
  handleFilter: (e: Event) => void
  onItemSelect: (key: TransferKey, check: boolean, e?: MouseEvent) => void
  onItemSelectAll: (dataSource: TransferKey[], checkAll: boolean | 'replace') => void
  onItemRemove?: (keys: TransferKey[]) => void
  handleClear: () => void
  render?: TransferRender<RecordType>
  labelRender?: (item: RecordType) => any
  showSearch?: boolean | TransferSearchOption
  renderList?: (props: TransferListBodyProps<RecordType>) => any
  footer?: (props: TransferListProps<RecordType>, info?: { direction: TransferDirection }) => any
  onScroll: (e: Event) => void
  disabled?: boolean
  direction: TransferDirection
  showSelectAll?: boolean
  selectAllLabel?: SelectAllLabel
  showRemove?: boolean
  pagination?: PaginationType
  selectionsIcon?: VueNode
}

export interface RenderedItem<RecordType> {
  renderedText: string
  renderedEl: VueNode
  item: RecordType
}

export const OmitProps = ['handleFilter', 'handleClear', 'checkedKeys'] as const
export type OmitProp = (typeof OmitProps)[number]

type PartialTransferListProps<RecordType> = Omit<TransferListProps<RecordType>, OmitProp>

export interface TransferListBodyProps<RecordType> extends PartialTransferListProps<RecordType> {
  filteredItems: RecordType[]
  filteredRenderItems: RenderedItem<RecordType>[]
  selectedKeys: TransferKey[]
}

export interface TransferCustomListBodyProps<RecordType> extends TransferListBodyProps<RecordType> {}

export interface TransferProps<RecordType = any> extends ComponentBaseProps {
  /** @deprecated Please use `styles.section` instead. */
  listStyle?: ((style: ListStyle) => CSSProperties) | CSSProperties
  /** @deprecated Please use `styles.actions` instead. */
  operationStyle?: CSSProperties
  classes?: TransferClassNamesType
  styles?: TransferStylesType

  disabled?: boolean
  dataSource?: RecordType[]
  targetKeys?: TransferKey[]
  selectedKeys?: TransferKey[]
  render?: TransferRender<RecordType>
  labelRender?: (item: RecordType) => any
  titles?: VueNode[]
  /** @deprecated Please use `actions` instead. */
  operations?: VueNode[]
  actions?: VueNode[]
  showSearch?: boolean | TransferSearchOption
  filterOption?: (inputValue: string, item: RecordType, direction: TransferDirection) => boolean
  locale?: Partial<TransferLocale>
  footer?: (props: TransferListProps<RecordType>, info?: { direction: TransferDirection }) => any
  rowKey?: (record: RecordType) => TransferKey
  showSelectAll?: boolean
  selectAllLabels?: SelectAllLabel[]
  oneWay?: boolean
  pagination?: PaginationType
  status?: InputStatus
  selectionsIcon?: VueNode
}

export interface TransferEmits {
  'change': (targetKeys: TransferKey[], direction: TransferDirection, moveKeys: TransferKey[]) => void
  'selectChange': (sourceSelectedKeys: TransferKey[], targetSelectedKeys: TransferKey[]) => void
  'search': (direction: TransferDirection, value: string) => void
  'scroll': (direction: TransferDirection, e: Event) => void
  'update:targetKeys': (targetKeys: TransferKey[]) => void
  'update:selectedKeys': (selectedKeys: TransferKey[]) => void
}

export interface TransferSlots<RecordType = any> {
  default?: (props: TransferCustomListBodyProps<RecordType>) => any
  render?: (item: RecordType) => any
  labelRender?: (item: RecordType) => any
  footer?: (props: { props: TransferListProps<RecordType>, info?: { direction: TransferDirection } }) => any
  selectionsIcon?: () => any
  titles?: () => any
  actions?: () => any
}
