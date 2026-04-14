import type { Ref } from 'vue'
import type { AnyObject } from '../../../_util/type.ts'
import type { devUseWarning } from '../../../_util/warning.ts'
import type {
  FilterDropdownProps as ColumnFilterDropdownProps,
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  FilterKey,
  FilterValue,
  GetPopupContainer,
  Key,
  SafeKey,
  TableLocale,
  TransformColumns,
} from '../../interface.ts'
import { getColumnKey, getColumnPos, renderColumnTitle } from '../../util.ts'
import FilterDropdown, { flattenKeys } from './FilterDropdown'

export interface FilterState<RecordType = AnyObject> {
  column: ColumnType<RecordType>
  key: Key
  filteredKeys?: FilterKey
  forceFiltered?: boolean
}

export function collectFilterStates<RecordType extends AnyObject = AnyObject>(columns: ColumnsType<RecordType>, init: boolean, pos?: string): FilterState<RecordType>[] {
  let filterStates: FilterState<RecordType>[] = []

  ;(columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos)
    const filterDropdownIsDefined = column.filterDropdown !== undefined

    if (column.filters || filterDropdownIsDefined || 'onFilter' in column) {
      if ('filteredValue' in column) {
        let filteredValues = column.filteredValue
        if (!filterDropdownIsDefined) {
          filteredValues = (filteredValues as any)?.map(String) ?? filteredValues
        }
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: column.filtered,
        })
      }
      else {
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: (init && column.defaultFilteredValue
            ? column.defaultFilteredValue!
            : undefined) as FilterKey,
          forceFiltered: column.filtered,
        })
      }
    }

    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)]
    }
  })

  return filterStates
}

function injectFilter<RecordType extends AnyObject = AnyObject>(
  prefixCls: string,
  dropdownPrefixCls: string,
  columns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  locale: TableLocale,
  triggerFilter: (filterState: FilterState<RecordType>) => void,
  getPopupContainer?: GetPopupContainer,
  pos?: string,
  rootClassName?: string,
  filterDropdown?: FilterConfig<RecordType>['filterDropdown'],
  filterIcon?: FilterConfig<RecordType>['filterIcon'],
): ColumnsType<RecordType> {
  return columns.map((column, index) => {
    const columnPos = getColumnPos(index, pos)
    const {
      filterOnClose = true,
      filterMultiple = true,
      filterMode,
      filterSearch,
    } = column as ColumnType<RecordType>

    let newColumn: ColumnsType<RecordType>[number] = column

    if (newColumn.filters || newColumn.filterDropdown) {
      const columnKey = getColumnKey(newColumn, columnPos)
      const filterState = filterStates.find(({ key }) => columnKey === key)
      newColumn = {
        ...newColumn,
        title: (renderProps: ColumnTitleProps<RecordType>) => (
          <FilterDropdown
            tablePrefixCls={prefixCls}
            prefixCls={`${prefixCls}-filter`}
            dropdownPrefixCls={dropdownPrefixCls}
            column={newColumn as any}
            filterDropdownRender={filterDropdown as any}
            filterIconRender={filterIcon as any}
            columnKey={columnKey}
            filterState={filterState as any}
            filterOnClose={filterOnClose}
            filterMultiple={filterMultiple}
            filterMode={filterMode}
            filterSearch={filterSearch}
            triggerFilter={triggerFilter as any}
            locale={locale}
            getPopupContainer={getPopupContainer}
            rootClassName={rootClassName}
          >
            {renderColumnTitle<RecordType>(column.title, renderProps)}
          </FilterDropdown>
        ),
      }
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectFilter(
          prefixCls,
          dropdownPrefixCls,
          newColumn.children,
          filterStates,
          locale,
          triggerFilter,
          getPopupContainer,
          columnPos,
          rootClassName,
          filterDropdown,
          filterIcon,
        ),
      }
    }

    return newColumn
  })
}

export function generateFilterInfo<RecordType extends AnyObject = AnyObject>(filterStates: FilterState<RecordType>[]) {
  const currentFilters: Record<string, FilterValue | null> = {}

  filterStates.forEach(({ key, filteredKeys, column }) => {
    const keyAsString = key as SafeKey
    const { filters, filterDropdown } = column
    if (filterDropdown) {
      currentFilters[keyAsString] = (filteredKeys as FilterValue) || null
    }
    else if (Array.isArray(filteredKeys)) {
      const keys = flattenKeys(filters)
      currentFilters[keyAsString] = keys.filter(originKey =>
        (filteredKeys as string[]).includes(String(originKey)),
      )
    }
    else {
      currentFilters[keyAsString] = null
    }
  })

  return currentFilters
}

export function getFilterData<RecordType extends AnyObject = AnyObject>(data: RecordType[], filterStates: FilterState<RecordType>[], childrenColumnName: string) {
  const filterDatas = filterStates.reduce<RecordType[]>((currentData, filterState) => {
    const {
      column: { onFilter, filters },
      filteredKeys,
    } = filterState
    if (onFilter && filteredKeys && (filteredKeys as any).length) {
      const flatKeys = flattenKeys(filters)
      const keyMap = new Map<string, FilterValue[number]>()
      flatKeys.forEach((key) => {
        const stringKey = String(key)
        if (!keyMap.has(stringKey))
          keyMap.set(stringKey, key)
      })

      const realKeys = (filteredKeys as any[]).map((key) => {
        const stringKey = String(key)
        return keyMap.get(stringKey) ?? key
      })

      return currentData.reduce<RecordType[]>((records, record) => {
        const currentRecord = { ...record } as any

        if (currentRecord[childrenColumnName]) {
          currentRecord[childrenColumnName] = getFilterData(
            currentRecord[childrenColumnName],
            filterStates,
            childrenColumnName,
          )
        }

        if (realKeys.some(realKey => onFilter(realKey as any, currentRecord)))
          records.push(currentRecord)

        return records
      }, [])
    }
    return currentData
  }, data)
  return filterDatas
}

export interface FilterConfig<RecordType = AnyObject> {
  prefixCls: string
  dropdownPrefixCls: string
  mergedFilterStates: FilterState<RecordType>[]
  filterStates: Ref<FilterState<RecordType>[]>
  locale: TableLocale
  filterDropdown?: (ctx: ColumnFilterDropdownProps & { column: ColumnType<RecordType> }) => any
  filterIcon?: (ctx: { column: ColumnType<RecordType>, filtered: boolean }) => any
  onFilterChange: (
    filters: Record<string, FilterValue | null>,
    filterStates: FilterState<RecordType>[],
  ) => void
  getPopupContainer?: GetPopupContainer
  rootClassName?: string
}

function getMergedColumns<RecordType extends AnyObject = AnyObject>(rawMergedColumns: ColumnsType<RecordType>): ColumnsType<RecordType> {
  return rawMergedColumns.flatMap((column) => {
    if ('children' in column) {
      return [column, ...getMergedColumns<RecordType>(column.children || [])]
    }
    return [column]
  })
}

export function getMergedFilterStates<RecordType extends AnyObject = AnyObject>(
  rawMergedColumns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  warning?: ReturnType<typeof devUseWarning>,
) {
  const mergedColumns = getMergedColumns<RecordType>(rawMergedColumns || [])
  const collectedStates = collectFilterStates(mergedColumns, false)
  if (collectedStates.length === 0) {
    return collectedStates
  }
  let filteredKeysIsAllNotControlled = true
  let filteredKeysIsAllControlled = true
  collectedStates.forEach(({ filteredKeys }) => {
    if (filteredKeys !== undefined) {
      filteredKeysIsAllNotControlled = false
    }
    else {
      filteredKeysIsAllControlled = false
    }
  })

  if (filteredKeysIsAllNotControlled) {
    const keyList = (mergedColumns || []).map((column, index) =>
      getColumnKey(column, getColumnPos(index)),
    )
    return filterStates
      .filter(({ key }) => keyList.includes(key))
      .map((item) => {
        const col = mergedColumns[keyList.indexOf(item.key)]
        return {
          ...item,
          column: {
            ...item.column,
            ...col,
          },
          forceFiltered: col?.filtered as any,
        }
      })
  }

  warning?.(
    filteredKeysIsAllControlled,
    'usage',
    'Columns should all contain `filteredValue` or not contain `filteredValue`.',
  )

  return collectedStates
}

export default function useFilter<RecordType extends AnyObject = AnyObject>(
  props: FilterConfig<RecordType>,
) {
  const {
    prefixCls,
    dropdownPrefixCls,
    mergedFilterStates,
    filterStates,
    onFilterChange,
    getPopupContainer,
    locale,
    rootClassName,
    filterDropdown,
    filterIcon,
  } = props
  const filters = generateFilterInfo<RecordType>(mergedFilterStates)

  const triggerFilter = (filterState: FilterState<RecordType>) => {
    const newFilterStates = mergedFilterStates.filter(({ key }) => key !== filterState.key)
    newFilterStates.push(filterState)
    filterStates.value = newFilterStates
    onFilterChange(generateFilterInfo<RecordType>(newFilterStates), newFilterStates)
  }

  const transformColumns: TransformColumns<RecordType> = innerColumns =>
    injectFilter(
      prefixCls,
      dropdownPrefixCls,
      innerColumns,
      mergedFilterStates,
      locale,
      triggerFilter,
      getPopupContainer,
      undefined,
      rootClassName,
      filterDropdown,
      filterIcon,
    )

  return [transformColumns, mergedFilterStates, filters] as const
}

export { flattenKeys }
