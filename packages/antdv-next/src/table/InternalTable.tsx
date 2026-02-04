import type { TableProps as VcTableProps } from '@v-c/table'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { AnyObject, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { SizeType } from '../config-provider/SizeContext'
import type { PaginationSemanticClassNames, PaginationSemanticStyles } from '../pagination/interface.ts'
import type { SpinProps } from '../spin'
import type { FilterState } from './hooks/useFilter'
import type { SortState } from './hooks/useSorter'
import type {
  ColumnsType,
  ColumnType,
  FilterDropdownProps,
  FilterValue,
  GetPopupContainer,
  Key,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableAction,
  TableCurrentDataSource,
  TableLocale,
  TablePaginationConfig,
  TableRowSelection,
} from './interface.ts'
import VcTable, { INTERNAL_HOOKS, VirtualTable as VcVirtualTable } from '@v-c/table'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch, watchEffect } from 'vue'
import { useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import scrollTo from '../_util/scrollTo.ts'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { devUseWarning, isDev } from '../_util/warning.ts'
import ConfigProvider from '../config-provider'
import { useComponentBaseConfig, useConfig } from '../config-provider/context.ts'
import { DefaultRenderEmpty } from '../config-provider/defaultRenderEmpty.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useBreakpoint } from '../grid/hooks/useBreakpoint'
import defaultLocale from '../locale/en_US.ts'
import useLocale from '../locale/useLocale.ts'
import Pagination from '../pagination'
import Spin from '../spin'
import { useToken } from '../theme/internal'
import renderExpandIcon from './ExpandIcon.tsx'
import useContainerWidth from './hooks/useContainerWidth.ts'
import useFilter, { collectFilterStates, generateFilterInfo, getFilterData, getMergedFilterStates } from './hooks/useFilter'
import useLazyKVMap from './hooks/useLazyKVMap.ts'
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination.ts'
import useSelection from './hooks/useSelection.tsx'
import useSorter, { getSortData } from './hooks/useSorter.tsx'
import useTitleColumns from './hooks/useTitleColumns.ts'
import useStyle from './style'
import { TableMeasureRowContextProvider } from './TableMeasureRowContext.ts'
import { convertColumnsToColumnProps } from './utils.ts'

const EMPTY_LIST: AnyObject[] = []

export type TableSemanticName = keyof TableSemanticClassNames & keyof TableSemanticStyles

export interface TableSemanticClassNames {
  root?: string
  section?: string
  title?: string
  footer?: string
  content?: string
}

export interface TableSemanticStyles {
  root?: CSSProperties
  section?: CSSProperties
  title?: CSSProperties
  footer?: CSSProperties
  content?: CSSProperties
}

export type ComponentsSemantic = keyof ComponentsSemanticClassNames
  & keyof ComponentsSemanticStyles

export interface ComponentsSemanticClassNames {
  wrapper?: string
  cell?: string
  row?: string
}

export interface ComponentsSemanticStyles {
  wrapper?: CSSProperties
  cell?: CSSProperties
  row?: CSSProperties
}

export type TableClassNamesType<RecordType = AnyObject> = SemanticClassNamesType<
  TableProps<RecordType>,
  TableSemanticClassNames,
  {
    body?: ComponentsSemanticClassNames
    header?: ComponentsSemanticClassNames
    pagination?: PaginationSemanticClassNames
  }
>

export type TableStylesType<RecordType = AnyObject> = SemanticStylesType<
  TableProps<RecordType>,
  TableSemanticStyles,
  {
    body?: ComponentsSemanticStyles
    header?: ComponentsSemanticStyles
    pagination?: PaginationSemanticStyles
  }
>

interface ChangeEventInfo<RecordType = AnyObject> {
  pagination: {
    current?: number
    pageSize?: number
    total?: number
  }
  filters: Record<string, FilterValue | null>
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[]

  filterStates: FilterState<RecordType>[]
  sorterStates: SortState<RecordType>[]

  resetPagination: (current?: number, pageSize?: number) => void
}

export interface TableProps<RecordType = AnyObject>
  extends ComponentBaseProps,
  Omit<
    VcTableProps<RecordType>,
    | 'transformColumns'
    | 'internalHooks'
    | 'internalRefs'
    | 'data'
    | 'columns'
    | 'scroll'
    | 'emptyText'
    | 'className'
    | 'style'
    | 'classNames'
    | 'styles'
    | 'getPopupContainer'
    | 'onUpdate:expandedRowKeys'
    | 'onScroll'
  > {
  classes?: TableClassNamesType<RecordType>
  styles?: TableStylesType<RecordType>
  dropdownPrefixCls?: string
  dataSource?: VcTableProps<RecordType>['data']
  columns?: ColumnsType<RecordType>
  pagination?: false | TablePaginationConfig
  loading?: boolean | SpinProps
  size?: SizeType
  bordered?: boolean
  locale?: TableLocale

  rowSelection?: TableRowSelection<RecordType>

  getPopupContainer?: GetPopupContainer
  scroll?: VcTableProps<RecordType>['scroll'] & { scrollToFirstRowOnChange?: boolean }
  sortDirections?: SortOrder[]
  showSorterTooltip?: boolean | SorterTooltipProps
  virtual?: boolean
}

export interface InternalTableProps<RecordType = AnyObject> extends TableProps<RecordType> {
  _renderTimes: number
}

export interface TableEmits<RecordType = AnyObject> {
  'change': (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void
  'update:expandedRowKeys': (keys: readonly Key[]) => void
  'scroll': NonNullable<VcTableProps['onScroll']>
  [key: string]: (...args: any[]) => void
}

export interface TableSlots<RecordType = AnyObject> {
  default?: () => any
  title?: (data: readonly RecordType[]) => any
  footer?: (data: readonly RecordType[]) => any
  summary?: (data: readonly RecordType[]) => any
  emptyText?: () => any
  expandIcon?: (info: any) => any
  expandedRowRender?: (ctx: { record: RecordType, index: number, indent: number, expanded: boolean }) => any
  headerCell?: (ctx: { column: ColumnType<RecordType>, index: number, text: any }) => any
  bodyCell?: (ctx: { column: ColumnType<RecordType>, index: number, text: any, record: RecordType }) => any
  filterDropdown?: (ctx: FilterDropdownProps & { column: ColumnType<RecordType> }) => any
  filterIcon?: (ctx: { column: ColumnType<RecordType>, filtered: boolean }) => any
}

function resolvePanelRender<RecordType>(
  slots: TableSlots<RecordType>,
  props: TableProps<RecordType>,
  key: 'title' | 'footer' | 'summary',
) {
  if (slots[key] || (props as any)[key]) {
    return (data: readonly RecordType[]) => getSlotPropsFnRun(slots, props, key, true, data)
  }
  return undefined
}

const defaults = {
  showSorterTooltip: { target: 'full-header' },
} as any
const InternalTable = defineComponent<
  InternalTableProps,
  TableEmits,
  string,
  SlotsType<TableSlots>
>(
  (props = defaults, { slots, emit, attrs, expose }) => {
    const {
      prefixCls,
      direction,
      getPrefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      renderEmpty,
      getPopupContainer: contextGetPopupContainer,
      virtual: contextVirtual,
      bodyCell: contextBodyCell,
      headerCell: contextHeaderCell,
      rowKey: contextRowKey,
    } = useComponentBaseConfig('table', props, ['bodyCell', 'headerCell', 'rowKey'])

    const configCtx = useConfig()

    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const mergedSize = useSize(computed(() => props.size))

    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        bordered: props.bordered,
      } as TableProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TableClassNamesType,
      TableStylesType,
      TableProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => ({
        pagination: { _default: 'root' },
        header: { _default: 'wrapper' },
        body: { _default: 'wrapper' },
      })),
    )

    const [tableLocale] = useLocale('Table', defaultLocale.Table)
    const [globalLocale] = useLocale('global', defaultLocale.global)
    const mergedLocale = computed(() => ({ ...tableLocale?.value, ...(props.locale || {}) }))

    const rawData = shallowRef(props?.dataSource || EMPTY_LIST)
    watch(() => props.dataSource, () => {
      rawData.value = props?.dataSource || EMPTY_LIST
    })
    const internalRefs = {
      body: shallowRef<HTMLDivElement | null>(null),
    } as NonNullable<VcTableProps['internalRefs']>

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const baseColumns = computed(() => {
      if (props.columns) {
        return props.columns
      }
      const children = slots.default?.() ?? []
      return convertColumnsToColumnProps(children)
    })

    const needResponsive = computed(() => baseColumns.value.some((col: any) => col.responsive))
    const screens = useBreakpoint(needResponsive, null)

    const mergedColumns = computed(() => {
      const matched = new Set(Object.keys(screens.value || {}).filter(m => screens.value?.[m as Breakpoint]))
      return baseColumns.value.filter((c: any) => !c.responsive || c.responsive.some((r: Breakpoint) => matched.has(r)))
    })

    const tableProps = computed(() =>
      omit(props, [
        'classes',
        'styles',
        'dataSource',
        'columns',
        'pagination',
        'loading',
        'size',
        'bordered',
        'rowSelection',
        'locale',
        'rootClass',
        'dropdownPrefixCls',
        'scroll',
        'sortDirections',
        'showSorterTooltip',
        'virtual',
        '_renderTimes',
      ]),
    )

    const mergedScroll = computed(() => {
      if (!props.scroll) {
        return undefined
      }
      const { scrollToFirstRowOnChange, ...rest } = props.scroll
      return rest
    })

    const mergedExpandable = computed(() => {
      const { expandable, ...legacyExpandableProps } = props
      const baseExpandable = expandable !== undefined
        ? { ...legacyExpandableProps, ...expandable }
        : { ...legacyExpandableProps }

      if ((baseExpandable as any).showExpandColumn === false) {
        ;(baseExpandable as any).expandIconColumnIndex = -1
      }

      if (slots.expandIcon) {
        ;(baseExpandable as any).expandIcon = slots.expandIcon
      }

      return baseExpandable as any
    })

    const childrenColumnName = computed(() => mergedExpandable.value.childrenColumnName || 'children')

    const getRowKey = computed(() => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey
      }
      if (!props.rowKey && contextRowKey.value && typeof contextRowKey.value === 'function') {
        return contextRowKey.value
      }
      const rowKey = props.rowKey || contextRowKey.value as string || 'key'
      return (record: any) => record?.[rowKey]
    })

    if (isDev) {
      const warning = devUseWarning('Table')
      warning(
        !(typeof props.rowKey === 'function' && props.rowKey.length > 1),
        'usage',
        '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
      )
    }

    const [getRecordByKey] = useLazyKVMap(rawData as any, childrenColumnName, getRowKey)

    const changeEventInfo: Partial<ChangeEventInfo> = {}

    const triggerOnChange = (
      info: Partial<ChangeEventInfo>,
      action: TableAction,
      reset = false,
    ) => {
      const changeInfo = {
        ...changeEventInfo,
        ...info,
      }

      if (reset) {
        changeEventInfo.resetPagination?.()

        if (changeInfo.pagination?.current) {
          changeInfo.pagination.current = 1
        }

        if (props.pagination && typeof props.pagination === 'object') {
          ;(props.pagination as any).onChange?.(1, changeInfo.pagination?.pageSize)
        }
      }

      if (props.scroll?.scrollToFirstRowOnChange !== false && internalRefs.body?.value) {
        scrollTo(0, {
          getContainer: () => internalRefs.body.value!,
        })
      }
      emit('change', changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
        currentDataSource: getFilterData(
          getSortData(rawData.value as any, changeInfo.sorterStates!, childrenColumnName.value),
          changeInfo.filterStates!,
          childrenColumnName.value,
        ),
        action,
      })
    }

    const onSorterChange = (
      sorter: SorterResult | SorterResult[],
      sorterStates: SortState[],
    ) => {
      triggerOnChange(
        {
          sorter,
          sorterStates,
        },
        'sort',
        false,
      )
    }

    const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter({
      prefixCls,
      mergedColumns: mergedColumns as any,
      onSorterChange,
      sortDirections: computed(() => props.sortDirections || ['ascend', 'descend']),
      tableLocale: mergedLocale,
      showSorterTooltip: computed(() => props.showSorterTooltip!),
      globalLocale,
    })

    const sortedData = computed(() =>
      getSortData(rawData.value as any, sortStates.value, childrenColumnName.value),
    )

    const filterStates = shallowRef<FilterState[]>(
      collectFilterStates(mergedColumns.value as any, true),
    )
    const filterStateWarning = isDev ? devUseWarning('Table') : undefined
    const mergedFilterStates = computed(() =>
      getMergedFilterStates(mergedColumns.value as any, filterStates.value, filterStateWarning),
    )
    const filters = computed(() => generateFilterInfo(mergedFilterStates.value))
    const onFilterChange = (filters: Record<string, FilterValue | null>, filterStates: FilterState[]) => {
      triggerOnChange({ filters, filterStates }, 'filter', true)
    }

    const mergedData = computed(() =>
      getFilterData(sortedData.value as any, mergedFilterStates.value, childrenColumnName.value),
    )

    const onPaginationChange = (current: number, pageSize: number) => {
      triggerOnChange(
        {
          pagination: { ...changeEventInfo.pagination, current, pageSize },
        },
        'paginate',
      )
    }

    const [mergedPagination, resetPagination] = usePagination(
      computed(() => mergedData.value.length),
      onPaginationChange,
      computed(() => props.pagination!),
    )

    watchEffect(() => {
      changeEventInfo.sorter = getSorters()
      changeEventInfo.sorterStates = sortStates.value
      changeEventInfo.filters = filters.value
      changeEventInfo.filterStates = mergedFilterStates.value
      changeEventInfo.pagination = props.pagination === false
        ? {}
        : getPaginationParam(mergedPagination.value, props.pagination)
      changeEventInfo.resetPagination = resetPagination
    })

    const pageData = computed(() => {
      if (props.pagination === false || !(mergedPagination.value as any).pageSize) {
        return mergedData.value
      }

      const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value as TablePaginationConfig
      if (isDev) {
        const warning = devUseWarning('Table')
        warning(current > 0, 'usage', '`current` should be positive number.')
      }

      if (mergedData.value.length < (total || 0)) {
        if (mergedData.value.length > pageSize) {
          if (isDev) {
            const warning = devUseWarning('Table')
            warning(
              false,
              'usage',
              '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
            )
          }
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize)
        }
        return mergedData.value
      }

      return mergedData.value.slice((current - 1) * pageSize, current * pageSize)
    })

    const [transformSelectionColumns, selectedKeySet] = useSelection(
      {
        prefixCls,
        data: mergedData,
        pageData,
        getRowKey,
        getRecordByKey,
        childrenColumnName,
        locale: mergedLocale,
        getPopupContainer: computed(() => props.getPopupContainer || contextGetPopupContainer),
      },
      computed(() => props.rowSelection),
    )

    const internalRowClassName = (record: AnyObject, index: number, indent: number) => {
      const resolvedRowClassName = typeof props.rowClassName === 'function'
        ? props.rowClassName(record, index, indent)
        : props.rowClassName
      return clsx(
        {
          [`${prefixCls.value}-row-selected`]: selectedKeySet.value.has(getRowKey.value(record, index)),
        },
        resolvedRowClassName,
      )
    }

    const getContainerWidth = useContainerWidth(prefixCls.value)

    const rootRef = shallowRef<HTMLDivElement | null>(null)
    const tblRef = shallowRef<any>(null)

    expose({
      scrollTo: (...args: any[]) => {
        tblRef.value?.scrollTo?.(...args)
      },
      get nativeElement() {
        return rootRef.value
      },
    })

    const spinProps = computed<SpinProps | undefined>(() => {
      if (typeof props.loading === 'boolean') {
        return { spinning: props.loading }
      }
      if (typeof props.loading === 'object' && props.loading !== null) {
        return { spinning: true, ...props.loading }
      }
      return undefined
    })

    const mergedVirtual = computed(() => props.virtual ?? contextVirtual.value)
    const TableComponent = computed(() => mergedVirtual.value ? VcVirtualTable : VcTable)

    const [, token] = useToken()
    const listItemHeight = computed(() => {
      const { fontSize, lineHeight, lineWidth, padding, paddingXS, paddingSM } = token.value
      const fontHeight = Math.floor(fontSize * lineHeight)

      switch (mergedSize.value) {
        case 'middle':
          return paddingSM * 2 + fontHeight + lineWidth
        case 'small':
          return paddingXS * 2 + fontHeight + lineWidth
        default:
          return padding * 2 + fontHeight + lineWidth
      }
    })

    const renderHeaderCell = (ctx: { column: ColumnType, index: number, text: any }) => {
      const node = getSlotPropsFnRun(slots, props as any, 'headerCell', true, ctx)
      if (node === null || node === undefined) {
        if (contextHeaderCell.value) {
          return contextHeaderCell.value(ctx)
        }
      }
      return node
    }

    const renderBodyCell = (ctx: { column: ColumnType, index: number, text: any, record: any }) => {
      const node = getSlotPropsFnRun(slots, props as any, 'bodyCell', true, ctx)
      if (node === null || node === undefined) {
        if (contextBodyCell.value) {
          return contextBodyCell.value(ctx)
        }
        else if (configCtx.value?.transformCellText) {
          return configCtx.value.transformCellText(ctx)
        }
      }
      return node
    }
    return () => {
      const columnTitlePropsFn = () => {
        const mergedFilters: Record<string, FilterValue> = {}
        Object.keys(filters.value).forEach((filterKey) => {
          if (filters.value[filterKey] !== null) {
            mergedFilters[filterKey] = filters.value[filterKey] as FilterValue
          }
        })
        return {
          ...sorterTitleProps.value,
          filters: mergedFilters,
        }
      }
      const columnTitleProps = columnTitlePropsFn()
      const [transformTitleColumns] = useTitleColumns(columnTitleProps)

      const renderExpandedRow = slots.expandedRowRender
        ? (record: AnyObject, index: number, indent: number, expanded: boolean) =>
            getSlotPropsFnRun(slots, props as any, 'expandedRowRender', true, {
              record,
              index,
              indent,
              expanded,
            })
        : undefined
      const { locale } = props
      const mergedEmptyNodeFn = () => {
        if (spinProps.value?.spinning && rawData.value === EMPTY_LIST) {
          return null
        }
        if (slots.emptyText) {
          return getSlotPropsFnRun(slots, props as any, 'emptyText')
        }
        if (typeof locale?.emptyText !== 'undefined') {
          return locale?.emptyText
        }
        return renderEmpty?.value?.('Table') || <DefaultRenderEmpty componentName="Table" />
      }
      const mergedEmptyNode = mergedEmptyNodeFn()
      const mergedGetPopupContainer = props.getPopupContainer || contextGetPopupContainer
      const renderFilterDropdown = slots.filterDropdown
        ? (ctx: FilterDropdownProps & { column: ColumnType }) =>
            getSlotPropsFnRun(slots, props as any, 'filterDropdown', false, ctx)
        : undefined
      const renderFilterIcon = slots.filterIcon
        ? (ctx: { column: ColumnType, filtered: boolean }) =>
            getSlotPropsFnRun(slots, props as any, 'filterIcon', false, ctx)
        : undefined
      const [transformFilterColumns] = useFilter({
        prefixCls: prefixCls.value,
        dropdownPrefixCls: getPrefixCls('dropdown', props.dropdownPrefixCls),
        mergedFilterStates: mergedFilterStates.value,
        filterStates,
        onFilterChange,
        filterDropdown: renderFilterDropdown,
        filterIcon: renderFilterIcon,
        getPopupContainer: mergedGetPopupContainer,
        locale: mergedLocale.value,
        rootClassName: clsx(props.rootClass, cssVarCls.value, rootCls.value, hashId.value),
      })
      const transformColumns = (innerColumns: ColumnsType): ColumnsType =>
        transformTitleColumns(
          transformSelectionColumns(
            transformFilterColumns(
              transformSorterColumns(innerColumns),
            ),
          ),
        )
      const expandType = (() => {
        if (rawData.value.some(item => item?.[childrenColumnName.value])) {
          return 'nest'
        }
        if (renderExpandedRow || mergedExpandable.value.expandedRowRender) {
          return 'row'
        }
        return null
      })()
      const mergedExpandableConfig = (() => {
        const expandable = { ...mergedExpandable.value }
        ;(expandable as any).__PARENT_RENDER_ICON__ = expandable.expandIcon

        if (renderExpandedRow) {
          expandable.expandedRowRender = renderExpandedRow as any
        }

        expandable.expandIcon = expandable.expandIcon || renderExpandIcon(mergedLocale.value)

        if (expandType === 'nest' && expandable.expandIconColumnIndex === undefined) {
          expandable.expandIconColumnIndex = props.rowSelection ? 1 : 0
        }
        else if (expandType === 'nest' && expandable.expandIconColumnIndex! > 0 && props.rowSelection) {
          expandable.expandIconColumnIndex! -= 1
        }

        if (typeof expandable.indentSize !== 'number') {
          expandable.indentSize = typeof props.indentSize === 'number' ? props.indentSize : 15
        }

        return expandable
      })()
      const renderPagination = (placement: 'start' | 'end' | 'center' = 'end') => (
        <Pagination
          {...mergedPagination.value as any}
          classes={mergedClassNames.value.pagination}
          styles={mergedStyles.value.pagination}
          class={clsx(
            `${prefixCls.value}-pagination ${prefixCls.value}-pagination-${placement}`,
            (mergedPagination.value as any).class,
            (mergedPagination.value as any).className,
          )}
          size={mergedPagination.value.size || (mergedSize.value === 'small' || mergedSize.value === 'middle' ? 'small' : undefined)}
        />
      )
      const paginationNodes = (() => {
        if (props.pagination === false || !mergedPagination.value.total) {
          return { top: null, bottom: null }
        }

        let topPaginationNode: VueNode = null
        let bottomPaginationNode: VueNode = null

        const { placement, position } = mergedPagination.value
        const mergedPlacement = placement ?? position
        const normalizePlacement = (pos: string) => {
          const lowerPos = pos.toLowerCase()
          if (lowerPos.includes('center')) {
            return 'center'
          }
          return lowerPos.includes('left') || lowerPos.includes('start') ? 'start' : 'end'
        }

        if (Array.isArray(mergedPlacement)) {
          const [topPos, bottomPos] = ['top', 'bottom'].map(dir => mergedPlacement.find(p => p.includes(dir)))
          const isDisable = mergedPlacement.every(p => `${p}` === 'none')
          if (!topPos && !bottomPos && !isDisable) {
            bottomPaginationNode = renderPagination()
          }
          if (topPos) {
            topPaginationNode = renderPagination(normalizePlacement(topPos))
          }
          if (bottomPos) {
            bottomPaginationNode = renderPagination(normalizePlacement(bottomPos))
          }
        }
        else {
          bottomPaginationNode = renderPagination()
        }

        if (isDev) {
          const warning = devUseWarning('Table')
          warning.deprecated(!position, 'pagination.position', 'pagination.placement')
        }

        return {
          top: topPaginationNode,
          bottom: bottomPaginationNode,
        }
      })()
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const wrapperCls = clsx(
        cssVarCls.value,
        rootCls.value,
        `${prefixCls.value}-wrapper`,
        contextClassName.value,
        {
          [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
        },
        props.rootClass,
        mergedClassNames.value.root,
        hashId.value,
        className,
      )

      const mergedStyle = { ...mergedStyles.value.root, ...contextStyle.value, ...style }

      const tableClassName = clsx(
        {
          [`${prefixCls.value}-middle`]: mergedSize.value === 'middle',
          [`${prefixCls.value}-small`]: mergedSize.value === 'small',
          [`${prefixCls.value}-bordered`]: props.bordered,
          [`${prefixCls.value}-empty`]: rawData.value.length === 0,
        },
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )

      const title = resolvePanelRender(slots, props, 'title')
      const footer = resolvePanelRender(slots, props, 'footer')
      const summary = resolvePanelRender(slots, props, 'summary')

      const TableComp = TableComponent.value as any
      const virtualProps = mergedVirtual.value ? { listItemHeight: listItemHeight.value } : {}

      return (
        <div ref={rootRef} class={wrapperCls} style={mergedStyle}>
          <Spin spinning={false} {...(spinProps.value || {})}>
            {paginationNodes.top}
            <TableComp
              {...virtualProps}
              {...tableProps.value}
              {...restAttrs}
              ref={tblRef}
              columns={mergedColumns.value as any}
              data={pageData.value as any}
              rowKey={getRowKey.value as any}
              rowClassName={internalRowClassName as any}
              emptyText={mergedEmptyNode as any}
              classNames={mergedClassNames.value as any}
              styles={mergedStyles.value as any}
              expandable={mergedExpandableConfig}
              prefixCls={prefixCls.value}
              direction={props.direction ?? direction.value}
              headerCell={slots.headerCell || contextHeaderCell.value || props.headerCell ? renderHeaderCell : undefined}
              bodyCell={slots.bodyCell || props.bodyCell || contextBodyCell.value || configCtx.value?.transformCellText ? renderBodyCell : undefined}
              className={tableClassName}
              internalHooks={INTERNAL_HOOKS}
              internalRefs={internalRefs}
              transformColumns={transformColumns as any}
              getContainerWidth={getContainerWidth}
              scroll={mergedScroll.value as any}
              measureRowRender={(measureRow: any) => (
                <TableMeasureRowContextProvider value={true}>
                  <ConfigProvider getPopupContainer={node => node as HTMLElement}>
                    {measureRow}
                  </ConfigProvider>
                </TableMeasureRowContextProvider>
              )}
              title={title as any}
              footer={footer as any}
              summary={summary as any}
              onUpdate:expandedRowKeys={(keys: readonly Key[]) => emit('update:expandedRowKeys', keys)}
            />
            {paginationNodes.bottom}
          </Spin>
        </div>
      )
    }
  },
  {
    name: 'AInternalTable',
    inheritAttrs: false,
  },
)

export default InternalTable
