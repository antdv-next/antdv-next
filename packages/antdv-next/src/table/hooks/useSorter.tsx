import type { Ref } from 'vue'
import type { AnyObject } from '../../_util/type.ts'
import type { Locale } from '../../locale'
import type { TooltipProps } from '../../tooltip'
import type {
  ColumnGroupType,
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  CompareFn,
  Key,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableLocale,
  TransformColumns,
} from '../interface.ts'
import { CaretDownOutlined, CaretUpOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import KeyCode from '@v-c/util/dist/KeyCode'
import { computed, shallowRef, unref } from 'vue'
import Tooltip from '../../tooltip'
import { getColumnKey, getColumnPos, renderColumnTitle, safeColumnTitle } from '../util.ts'

const ASCEND = 'ascend'
const DESCEND = 'descend'

function getMultiplePriority<RecordType extends AnyObject = AnyObject>(column: ColumnType<RecordType>): number | false {
  if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
    return column.sorter.multiple
  }
  return false
}

function getSortFunction<RecordType extends AnyObject = AnyObject>(sorter: ColumnType<RecordType>['sorter']): CompareFn<RecordType> | false {
  if (typeof sorter === 'function') {
    return sorter
  }
  if (sorter && typeof sorter === 'object' && sorter.compare) {
    return sorter.compare
  }
  return false
}

function nextSortDirection(sortDirections: SortOrder[], current: SortOrder | null) {
  if (!current) {
    return sortDirections[0]
  }
  return sortDirections[sortDirections.indexOf(current) + 1]
}

export interface SortState<RecordType = AnyObject> {
  column: ColumnType<RecordType>
  key: Key
  sortOrder: SortOrder | null
  multiplePriority: number | false
}

function collectSortStates<RecordType extends AnyObject = AnyObject>(columns: ColumnsType<RecordType>, init: boolean, pos?: string): SortState<RecordType>[] {
  let sortStates: SortState<RecordType>[] = []

  const pushState = (column: ColumnsType<RecordType>[number], columnPos: string) => {
    sortStates.push({
      column,
      key: getColumnKey<RecordType>(column, columnPos),
      multiplePriority: getMultiplePriority<RecordType>(column),
      sortOrder: column.sortOrder!,
    })
  }

  ;(columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos)
    if ((column as ColumnGroupType<RecordType>).children) {
      if ('sortOrder' in column) {
        // Controlled
        pushState(column, columnPos)
      }
      sortStates = [
        ...sortStates,
        ...collectSortStates<RecordType>(
          (column as ColumnGroupType<RecordType>).children,
          init,
          columnPos,
        ),
      ]
    }
    else if (column.sorter) {
      if ('sortOrder' in column) {
        // Controlled
        pushState(column, columnPos)
      }
      else if (init && column.defaultSortOrder) {
        // Default sorter
        sortStates.push({
          column,
          key: getColumnKey(column, columnPos),
          multiplePriority: getMultiplePriority<RecordType>(column),
          sortOrder: column.defaultSortOrder!,
        })
      }
    }
  })

  return sortStates
}

function injectSorter<RecordType extends AnyObject = AnyObject>(prefixCls: string, columns: ColumnsType<RecordType>, sorterStates: SortState<RecordType>[], triggerSorter: (sorterStates: SortState<RecordType>) => void, defaultSortDirections: SortOrder[], tableLocale?: TableLocale, tableShowSorterTooltip?: boolean | SorterTooltipProps, pos?: string, a11yLocale?: Locale['global']): ColumnsType<RecordType> {
  const finalColumns = (columns || []).map((column, index) => {
    const columnPos = getColumnPos(index, pos)
    let newColumn: ColumnsType<RecordType>[number] = column
    if (newColumn.sorter) {
      const sortDirections: SortOrder[] = newColumn.sortDirections || defaultSortDirections
      const showSorterTooltip = newColumn.showSorterTooltip === undefined
        ? tableShowSorterTooltip
        : newColumn.showSorterTooltip

      const columnKey = getColumnKey(newColumn, columnPos)
      const sorterState = sorterStates.find(({ key }) => key === columnKey)
      const sortOrder = sorterState ? sorterState.sortOrder : null
      const nextSortOrder = nextSortDirection(sortDirections, sortOrder)

      const { cancelSort, triggerAsc, triggerDesc } = tableLocale || {}
      let sortTip: string | undefined = cancelSort
      if (nextSortOrder === DESCEND) {
        sortTip = triggerDesc
      }
      else if (nextSortOrder === ASCEND) {
        sortTip = triggerAsc
      }
      const tooltipProps: TooltipProps = typeof showSorterTooltip === 'object'
        ? { title: sortTip, ...showSorterTooltip }
        : { title: sortTip }
      newColumn = {
        ...newColumn,
        className: clsx(newColumn.className, { [`${prefixCls}-column-sort`]: sortOrder }),
        title: (renderProps: ColumnTitleProps<RecordType>) => {
          let sorter: any
          if (column.sortIcon) {
            sorter = column.sortIcon({ sortOrder })
          }
          else {
            const upNode = sortDirections.includes(ASCEND) && (
              <CaretUpOutlined
                class={clsx(`${prefixCls}-column-sorter-up`, { active: sortOrder === ASCEND })}
              />
            )
            const downNode = sortDirections.includes(DESCEND) && (
              <CaretDownOutlined
                class={clsx(`${prefixCls}-column-sorter-down`, { active: sortOrder === DESCEND })}
              />
            )
            sorter = (
              <span
                class={clsx(`${prefixCls}-column-sorter`, {
                  [`${prefixCls}-column-sorter-full`]: !!(upNode && downNode),
                })}
              >
                <span class={`${prefixCls}-column-sorter-inner`} aria-hidden="true">
                  {upNode}
                  {downNode}
                </span>
              </span>
            )
          }
          const columnSortersClass = `${prefixCls}-column-sorters`
          const renderColumnTitleWrapper = (
            <span class={`${prefixCls}-column-title`}>
              {renderColumnTitle(column.title, renderProps)}
            </span>
          )
          const renderSortTitle = (
            <div class={columnSortersClass}>
              {renderColumnTitleWrapper}
              {sorter}
            </div>
          )
          if (showSorterTooltip) {
            if (typeof showSorterTooltip !== 'boolean' && showSorterTooltip?.target === 'sorter-icon') {
              return (
                <div
                  class={clsx(
                    columnSortersClass,
                    `${columnSortersClass}-tooltip-target-sorter`,
                  )}
                >
                  {renderColumnTitleWrapper}
                  <Tooltip {...tooltipProps}>{sorter}</Tooltip>
                </div>
              )
            }
            return <Tooltip {...tooltipProps}>{renderSortTitle}</Tooltip>
          }
          return renderSortTitle
        },
        onHeaderCell: (col) => {
          const cell: Record<string, any> = column.onHeaderCell?.(col) || {}
          const originOnClick = cell.onClick
          const originOnKeydown = cell.onKeydown || cell.onKeyDown
          cell.onClick = (event: MouseEvent) => {
            triggerSorter({
              column,
              key: columnKey,
              sortOrder: nextSortOrder!,
              multiplePriority: getMultiplePriority<RecordType>(column),
            })
            originOnClick?.(event)
          }
          cell.onKeydown = (event: KeyboardEvent) => {
            if ((event as any).keyCode === KeyCode.ENTER) {
              triggerSorter({
                column,
                key: columnKey,
                sortOrder: nextSortOrder!,
                multiplePriority: getMultiplePriority<RecordType>(column),
              })
              originOnKeydown?.(event)
            }
          }

          const renderTitle = safeColumnTitle(column.title, {})
          const displayTitle = renderTitle?.toString()

          if (sortOrder) {
            cell['aria-sort'] = sortOrder === 'ascend' ? 'ascending' : 'descending'
          }
          cell['aria-description'] = a11yLocale?.sortable
          cell['aria-label'] = displayTitle || ''
          cell.className = clsx(cell.className, `${prefixCls}-column-has-sorters`)
          cell.tabIndex = 0
          if (column.ellipsis) {
            cell.title = (renderTitle ?? '').toString()
          }
          return cell
        },
      }
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectSorter(
          prefixCls,
          newColumn.children,
          sorterStates,
          triggerSorter,
          defaultSortDirections,
          tableLocale,
          tableShowSorterTooltip,
          columnPos,
          a11yLocale,
        ),
      }
    }

    return newColumn
  })
  return finalColumns
}

function stateToInfo<RecordType extends AnyObject = AnyObject>(sorterState: SortState<RecordType>): SorterResult<RecordType> {
  const { column, sortOrder } = sorterState
  return {
    column,
    order: sortOrder,
    field: column.dataIndex as SorterResult<RecordType>['field'],
    columnKey: column.key as SorterResult<RecordType>['columnKey'],
  }
}

function generateSorterInfo<RecordType extends AnyObject = AnyObject>(sorterStates: SortState<RecordType>[]): SorterResult<RecordType> | SorterResult<RecordType>[] {
  const activeSorters = sorterStates.reduce<SorterResult<RecordType>[]>((list, sorterState) => {
    if (sorterState.sortOrder) {
      list.push(stateToInfo(sorterState))
    }
    return list
  }, [])

  if (activeSorters.length === 0 && sorterStates.length) {
    const lastIndex = sorterStates.length - 1
    return {
      ...stateToInfo(sorterStates[lastIndex!]!),
      column: undefined,
      order: undefined,
      field: undefined,
      columnKey: undefined,
    }
  }

  if (activeSorters.length <= 1) {
    return activeSorters[0] || {}
  }

  return activeSorters
}

export function getSortData<RecordType extends AnyObject = AnyObject>(data: readonly RecordType[], sortStates: SortState<RecordType>[], childrenColumnName: string): RecordType[] {
  const innerSorterStates = sortStates
    .slice()
    .sort((a, b) => (b.multiplePriority as number) - (a.multiplePriority as number))

  const cloneData = data.slice()

  const runningSorters = innerSorterStates.filter(
    ({ column: { sorter }, sortOrder }) => getSortFunction<RecordType>(sorter) && sortOrder,
  )

  if (!runningSorters.length) {
    return cloneData
  }

  return cloneData
    .sort((record1, record2) => {
      for (let i = 0; i < runningSorters.length; i += 1) {
        const sorterState = runningSorters[i]!
        const {
          column: { sorter },
          sortOrder,
        } = sorterState

        const compareFn = getSortFunction<RecordType>(sorter)

        if (compareFn && sortOrder) {
          const compareResult = compareFn(record1, record2, sortOrder)

          if (compareResult !== 0) {
            return sortOrder === ASCEND ? compareResult : -compareResult
          }
        }
      }

      return 0
    })
    .map<RecordType>((record: any) => {
      const subRecords = record?.[childrenColumnName]
      if (subRecords) {
        return {
          ...record,
          [childrenColumnName]: getSortData<RecordType>(subRecords, sortStates, childrenColumnName),
        }
      }
      return record
    })
}

type MaybeRef<T> = T | Ref<T>

interface SorterConfig<RecordType = AnyObject> {
  prefixCls: MaybeRef<string>
  mergedColumns: MaybeRef<ColumnsType<RecordType>>
  /**
   * Columns before applying the responsive filter.
   * Used to collect `defaultSortOrder` / controlled `sortOrder` for columns
   * that are currently hidden by `column.responsive`, so the user's sort
   * intent is preserved when the column appears at a different breakpoint.
   * Falls back to `mergedColumns` when not provided.
   * See: https://github.com/ant-design/ant-design/issues/32847
   */
  baseColumns?: MaybeRef<ColumnsType<RecordType>>
  onSorterChange: (
    sorterResult: SorterResult<RecordType> | SorterResult<RecordType>[],
    sortStates: SortState<RecordType>[],
  ) => void
  sortDirections: MaybeRef<SortOrder[]>
  tableLocale?: MaybeRef<TableLocale>
  showSorterTooltip?: MaybeRef<boolean | SorterTooltipProps>
  globalLocale?: MaybeRef<Locale['global']>
}

export default function useSorter<RecordType extends AnyObject = AnyObject>(
  props: SorterConfig<RecordType>,
) {
  const {
    prefixCls: rawPrefixCls,
    mergedColumns: rawMergedColumns,
    baseColumns: rawBaseColumns,
    sortDirections: rawSortDirections,
    tableLocale: rawTableLocale,
    showSorterTooltip: rawShowSorterTooltip,
    onSorterChange,
    globalLocale: rawGlobalLocale,
  } = props

  const prefixCls = computed(() => unref(rawPrefixCls))
  const mergedColumns = computed(() => unref(rawMergedColumns))
  // Use base (pre-responsive) columns to seed sort states so that
  // `defaultSortOrder` / controlled `sortOrder` on a `responsive` column is
  // honored even when the column is not visible at the current breakpoint.
  const collectColumns = computed(() => unref(rawBaseColumns) ?? mergedColumns.value)
  const sortDirections = computed(() => unref(rawSortDirections))
  const tableLocale = computed(() => unref(rawTableLocale))
  const showSorterTooltip = computed(() => unref(rawShowSorterTooltip))
  const globalLocale = computed(() => unref(rawGlobalLocale))

  const sortStates = shallowRef<SortState<RecordType>[]>(
    collectSortStates<RecordType>(collectColumns.value, true),
  )

  const getColumnKeys = (columns: ColumnsType<RecordType>, pos?: string): Key[] => {
    const newKeys: Key[] = []
    columns.forEach((item, index) => {
      const columnPos = getColumnPos(index, pos)
      newKeys.push(getColumnKey<RecordType>(item, columnPos))
      if (Array.isArray((item as ColumnGroupType<RecordType>).children)) {
        const childKeys = getColumnKeys((item as ColumnGroupType<RecordType>).children, columnPos)
        newKeys.push(...childKeys)
      }
    })
    return newKeys
  }

  const mergedSorterStates = computed<SortState<RecordType>[]>(() => {
    let validate = true
    // Collect controlled `sortOrder` from the full (pre-responsive) column
    // set so that a controlled `sortOrder` on a hidden responsive column
    // still applies to the sorted data.
    const collectedStates = collectSortStates<RecordType>(collectColumns.value, false)

    if (!collectedStates.length) {
      const collectColumnsKeys = getColumnKeys(collectColumns.value)
      return sortStates.value.filter(({ key }) => collectColumnsKeys.includes(key))
    }

    const validateStates: SortState<RecordType>[] = []

    function patchStates(state: SortState<RecordType>) {
      if (validate) {
        validateStates.push(state)
      }
      else {
        validateStates.push({
          ...state,
          sortOrder: null,
        })
      }
    }

    let multipleMode: boolean | null = null
    collectedStates.forEach((state) => {
      if (multipleMode === null) {
        patchStates(state)

        if (state.sortOrder) {
          if (state.multiplePriority === false) {
            validate = false
          }
          else {
            multipleMode = true
          }
        }
      }
      else if (multipleMode && state.multiplePriority !== false) {
        patchStates(state)
      }
      else {
        validate = false
        patchStates(state)
      }
    })

    return validateStates
  })

  const columnTitleSorterProps = computed<ColumnTitleProps<RecordType>>(() => {
    const sortColumns = mergedSorterStates.value.map(({ column, sortOrder }) => ({
      column,
      order: sortOrder,
    }))

    return {
      sortColumns,
      sortColumn: sortColumns[0]?.column,
      sortOrder: sortColumns[0]?.order,
    }
  })

  const triggerSorter = (sortState: SortState<RecordType>) => {
    let newSorterStates: SortState<RecordType>[]
    if (
      sortState.multiplePriority === false
      || !mergedSorterStates.value.length
      || mergedSorterStates.value[0]!.multiplePriority === false
    ) {
      newSorterStates = [sortState]
    }
    else {
      newSorterStates = [
        ...mergedSorterStates.value.filter(({ key }) => key !== sortState.key),
        sortState,
      ]
    }
    sortStates.value = newSorterStates
    onSorterChange(generateSorterInfo(newSorterStates), newSorterStates)
  }

  const transformColumns: TransformColumns<RecordType> = innerColumns =>
    injectSorter(
      prefixCls.value,
      innerColumns,
      mergedSorterStates.value,
      triggerSorter,
      sortDirections.value,
      tableLocale.value,
      showSorterTooltip.value,
      undefined,
      globalLocale.value,
    )

  const getSorters = () => generateSorterInfo(mergedSorterStates.value)

  return [transformColumns, mergedSorterStates, columnTitleSorterProps, getSorters] as const
}
