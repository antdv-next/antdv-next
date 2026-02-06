import type { CheckboxChangeEvent } from '@v-c/checkbox'
import type { EventDataNode, DataNode as FieldDataNode } from '@v-c/tree'
import type { SlotsType } from 'vue'
import type { AnyObject, EmptyEmit } from '../../../_util/type.ts'
import type { DropdownEmits } from '../../../dropdown'

import type { MenuProps } from '../../../menu'
import type {
  FilterDropdownProps as ColumnFilterDropdownProps,
  ColumnFilterItem,
  ColumnType,
  FilterKey,
  FilterSearchType,
  FilterValue,
  GetPopupContainer,
  Key,
  TableLocale,
} from '../../interface.ts'
import type { FilterState } from './index.tsx'
import { FilterFilled } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import isEqual from '@v-c/util/dist/isEqual'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import extendsObject from '../../../_util/extendsObject.ts'
import { toPropsRefs } from '../../../_util/tools.ts'
import { devUseWarning, isDev } from '../../../_util/warning.ts'
import Button from '../../../button'
import Checkbox from '../../../checkbox'
import { useConfig } from '../../../config-provider/context.ts'
import Dropdown from '../../../dropdown'
import Empty from '../../../empty'
import Menu from '../../../menu'
import { OverrideProvider } from '../../../menu/OverrideContext.tsx'
import Radio from '../../../radio'
import Tree from '../../../tree'
import { useTableMeasureRowContext } from '../../TableMeasureRowContext.ts'
import FilterSearch from './FilterSearch'
import FilterDropdownMenuWrapper from './FilterWrapper'

export function flattenKeys(filters?: ColumnFilterItem[]) {
  let keys: FilterValue = []
  ;(filters || []).forEach(({ value, children }) => {
    keys.push(value)
    if (children) {
      keys = [...keys, ...flattenKeys(children)]
    }
  })
  return keys
}

function hasSubMenu(filters: ColumnFilterItem[]) {
  return filters.some(({ children }) => children)
}

function searchValueMatched(searchValue: string, text: any) {
  if (typeof text === 'string' || typeof text === 'number') {
    return text?.toString().toLowerCase().includes(searchValue.trim().toLowerCase())
  }
  return false
}

function renderFilterItems({
  filters,
  prefixCls,
  filteredKeys,
  filterMultiple,
  searchValue,
  filterSearch,
}: {
  filters: ColumnFilterItem[]
  prefixCls: string
  filteredKeys: Key[]
  filterMultiple: boolean
  searchValue: string
  filterSearch: FilterSearchType<ColumnFilterItem>
}): Required<MenuProps>['items'] {
  return filters.map((filter, index) => {
    const key = String(filter.value)

    if (filter.children) {
      return {
        key: key || index,
        label: filter.text,
        popupClassName: `${prefixCls}-dropdown-submenu`,
        children: renderFilterItems({
          filters: filter.children,
          prefixCls,
          filteredKeys,
          filterMultiple,
          searchValue,
          filterSearch,
        }),
      }
    }

    const Component = filterMultiple ? Checkbox : Radio
    const checked = filteredKeys.includes(key)
    const item = {
      key: filter.value !== undefined ? key : index,
      label: (
        <>
          <Component checked={checked} />
          <span>{filter.text}</span>
        </>
      ),
    }
    if (searchValue.trim()) {
      if (typeof filterSearch === 'function') {
        return filterSearch(searchValue, filter) ? item : null
      }
      return searchValueMatched(searchValue, filter.text) ? item : null
    }
    return item
  })
}

export type TreeColumnFilterItem = ColumnFilterItem & FilterTreeDataNode

export interface FilterDropdownProps<RecordType = AnyObject> {
  tablePrefixCls: string
  prefixCls: string
  dropdownPrefixCls: string
  column: ColumnType<RecordType>
  filterDropdownRender?: (ctx: ColumnFilterDropdownProps & { column: ColumnType<RecordType> }) => any
  filterIconRender?: (ctx: { column: ColumnType<RecordType>, filtered: boolean }) => any
  filterState?: FilterState<RecordType>
  filterOnClose: boolean
  filterMultiple: boolean
  filterMode?: 'menu' | 'tree'
  filterSearch?: FilterSearchType<ColumnFilterItem | TreeColumnFilterItem>
  columnKey: Key
  children?: any
  triggerFilter: (filterState: FilterState<RecordType>) => void
  locale: TableLocale
  getPopupContainer?: GetPopupContainer
  filterResetToDefaultFilteredValue?: boolean
  rootClassName?: string
}

type FilterTreeDataNode = FieldDataNode

interface FilterRestProps {
  confirm?: boolean
  closeDropdown?: boolean
}

function wrapStringListType(keys?: FilterKey) {
  return (keys as string[]) || []
}

function useSyncState<T>(defaultValue: T) {
  const stateRef = shallowRef(defaultValue)
  const setState = (next: T | ((prev: T) => T)) => {
    stateRef.value = typeof next === 'function' ? (next as (prev: T) => T)(stateRef.value) : next
  }
  return [stateRef, setState] as const
}

const defaults = {
  filterSearch: false,
} as any

const FilterDropdown = defineComponent<
  FilterDropdownProps,
  EmptyEmit,
  string,
  SlotsType<{ default?: () => any }>
>(
  (props = defaults, { slots }) => {
    const { filterMode, filterSearch, column } = toPropsRefs(props, 'filterSearch', 'filterMode', 'column')
    const filterDropdownProps = computed<Record<string, any>>(() => column?.value?.filterDropdownProps ?? {})

    const visible = shallowRef(false)
    const inMeasureRow = useTableMeasureRowContext()
    const filtered = computed(() => {
      const filterState = props.filterState
      return !!(
        filterState
        && ((filterState.filteredKeys?.length) || filterState.forceFiltered)
      )
    })

    const triggerVisible = (newVisible: boolean) => {
      visible.value = newVisible
      filterDropdownProps.value.onOpenChange?.(newVisible)
      column.value.onFilterDropdownOpenChange?.(newVisible)
    }

    if (isDev) {
      const warning = devUseWarning('Table')
      const deprecatedList: [keyof ColumnType<AnyObject>, string][] = [
        ['filterDropdownOpen', 'filterDropdownProps.open'],
        ['onFilterDropdownOpenChange', 'filterDropdownProps.onOpenChange'],
      ]

      deprecatedList.forEach(([deprecatedName, newName]) => {
        warning.deprecated(!(deprecatedName in column.value), deprecatedName, newName)
      })
      warning.deprecated(
        !('filterCheckall' in props.locale),
        'filterCheckall' as 'deprecated',
        'locale.filterCheckAll',
      )
    }

    let hasPropDropdownRender = false
    const mergedVisible = computed(() => {
      return filterDropdownProps.value?.open ?? column.value.filterDropdownOpen ?? visible.value
    })

    const propFilteredKeys = computed(() => props.filterState?.filteredKeys)
    const [filteredKeysSync, setFilteredKeysSync] = useSyncState(
      wrapStringListType(propFilteredKeys.value),
    )

    const onSelectKeys = ({ selectedKeys }: { selectedKeys: string[] }) => {
      setFilteredKeysSync(selectedKeys)
    }

    const onCheck = (
      keys: string[],
      { node, checked }: { node: EventDataNode<FilterTreeDataNode>, checked: boolean },
    ) => {
      if (!props.filterMultiple) {
        onSelectKeys({ selectedKeys: checked && node.key ? [node.key as string] : [] })
      }
      else {
        onSelectKeys({ selectedKeys: keys })
      }
    }

    watch([propFilteredKeys, mergedVisible], ([nextKeys, nextVisible]) => {
      if (!nextVisible) {
        return
      }
      onSelectKeys({ selectedKeys: wrapStringListType(nextKeys as FilterKey) })
    })

    const openKeys = shallowRef<string[]>([])
    const onOpenChange = (keys: string[]) => {
      openKeys.value = keys
    }

    const searchValue = shallowRef('')
    const onSearch = (e: Event) => {
      const target = e.target as HTMLInputElement
      searchValue.value = target?.value || ''
    }

    watch(mergedVisible, (nextVisible) => {
      if (!nextVisible) {
        searchValue.value = ''
      }
    })

    const internalTriggerFilter = (keys?: string[]) => {
      const filterState = props.filterState
      const mergedKeys = keys?.length ? keys : null
      if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
        return null
      }

      if (isEqual(mergedKeys, filterState?.filteredKeys, true)) {
        return null
      }

      props.triggerFilter({
        column: column.value,
        key: props.columnKey,
        filteredKeys: mergedKeys as FilterKey,
      })
    }

    const onConfirm = () => {
      triggerVisible(false)
      internalTriggerFilter(filteredKeysSync.value)
    }

    const onReset = (
      { confirm, closeDropdown }: FilterRestProps = { confirm: false, closeDropdown: false },
    ) => {
      if (confirm) {
        internalTriggerFilter([])
      }
      if (closeDropdown) {
        triggerVisible(false)
      }

      searchValue.value = ''

      if (column.value.filterResetToDefaultFilteredValue) {
        setFilteredKeysSync((column.value.defaultFilteredValue || []).map(key => String(key)))
      }
      else {
        setFilteredKeysSync([])
      }
    }

    const doFilter = ({ closeDropdown } = { closeDropdown: true }) => {
      if (closeDropdown) {
        triggerVisible(false)
      }
      internalTriggerFilter(filteredKeysSync.value)
    }

    const filterDropdownDefined = computed(() => (
      props.filterDropdownRender !== undefined || column.value?.filterDropdown !== undefined
    ))

    const onVisibleChange: DropdownEmits['openChange'] = (newVisible, info) => {
      if (info?.source === 'trigger') {
        if (newVisible && propFilteredKeys.value !== undefined) {
          setFilteredKeysSync(wrapStringListType(propFilteredKeys.value))
        }

        triggerVisible(newVisible)

        if (!newVisible && !hasPropDropdownRender && props.filterOnClose) {
          onConfirm()
        }
      }
    }

    const dropdownMenuClass = computed(() => clsx({
      [`${props.dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(column?.value?.filters || []),
    }))

    const onCheckAll = (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        const allFilterKeys = flattenKeys(column.value?.filters).map(key => String(key))
        setFilteredKeysSync(allFilterKeys)
      }
      else {
        setFilteredKeysSync([])
      }
    }

    const getTreeData = ({ filters }: { filters?: ColumnFilterItem[] }) =>
      (filters || []).map((filter, index) => {
        const key = String(filter.value)
        const item: FilterTreeDataNode = {
          title: filter.text,
          key: filter.value !== undefined ? key : String(index),
        }
        if (filter.children) {
          item.children = getTreeData({ filters: filter.children })
        }
        return item
      })

    const getFilterData = (node: FilterTreeDataNode): TreeColumnFilterItem => ({
      ...node,
      text: node.title as any,
      value: node.key,
      children: node.children?.map(item => getFilterData(item)) || [],
    })

    const config = useConfig()
    const direction = computed(() => config.value.direction)

    const menuItems = computed(() => {
      if (filterMode.value === 'tree') {
        return []
      }
      return renderFilterItems({
        filters: props?.column?.filters || [],
        filterSearch: filterSearch.value as FilterSearchType<ColumnFilterItem>,
        prefixCls: props.prefixCls,
        filteredKeys: filteredKeysSync.value,
        filterMultiple: props.filterMultiple,
        searchValue: searchValue.value,
      })
    })

    return () => {
      const { dropdownPrefixCls, prefixCls, tablePrefixCls } = props
      const renderEmpty = config.value.renderEmpty

      const getDropdownContent = () => {
        let dropdownContent: any
        const baseDropdownProps = {
          prefixCls: `${dropdownPrefixCls}-custom`,
          setSelectedKeys: (selectedKeys: any) => onSelectKeys({ selectedKeys: selectedKeys as string[] }),
          selectedKeys: filteredKeysSync.value,
          confirm: doFilter,
          clearFilters: onReset,
          filters: column.value.filters,
          visible: mergedVisible.value,
          close: () => {
            triggerVisible(false)
          },
        }

        let filterNode = null
        if (props.filterDropdownRender) {
          const node = props.filterDropdownRender({ ...baseDropdownProps, column: column.value })
          if (node) {
            const _filterDropdown = filterEmpty(Array.isArray(node) ? node : [node])
            if (_filterDropdown && _filterDropdown.length > 0) {
              filterNode = _filterDropdown.length === 1 ? _filterDropdown[0] : _filterDropdown
              hasPropDropdownRender = true
            }
            else {
              hasPropDropdownRender = false
            }
          }
          else {
            hasPropDropdownRender = false
          }
        }
        if (filterNode) {
          dropdownContent = filterNode
        }
        else if (typeof column.value.filterDropdown === 'function') {
          dropdownContent = column.value.filterDropdown({
            ...baseDropdownProps,
          })
        }
        else if (column.value.filterDropdown) {
          dropdownContent = column.value.filterDropdown
        }
        else {
          const selectedKeys = filteredKeysSync.value || []
          const getFilterComponent = () => {
            const empty = renderEmpty?.('Table.filter') ?? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={props.locale.filterEmptyText}
                styles={{
                  image: { height: 24 },
                }}
                style={{
                  margin: 0,
                  padding: '16px 0',
                }}
              />
            )
            if ((column.value.filters || []).length === 0) {
              return empty
            }
            if (filterMode.value === 'tree') {
              return (
                <>
                  <FilterSearch
                    filterSearch={filterSearch.value as any}
                    value={searchValue.value}
                    onChange={onSearch}
                    tablePrefixCls={props.tablePrefixCls}
                    locale={props.locale}
                  />
                  <div class={`${props.tablePrefixCls}-filter-dropdown-tree`}>
                    {props.filterMultiple
                      ? (
                          <Checkbox
                            checked={selectedKeys.length === flattenKeys(column.value.filters).length}
                            indeterminate={
                              selectedKeys.length > 0
                              && selectedKeys.length < flattenKeys(column.value.filters).length
                            }
                            class={`${props.tablePrefixCls}-filter-dropdown-checkall`}
                            onChange={onCheckAll}
                          >
                            {props.locale?.filterCheckall ?? props.locale?.filterCheckAll}
                          </Checkbox>
                        )
                      : null}
                    <Tree
                      checkable
                      selectable={false}
                      blockNode
                      multiple={props.filterMultiple}
                      checkStrictly={!props.filterMultiple}
                      class={`${props.dropdownPrefixCls}-menu`}
                      onCheck={onCheck}
                      checkedKeys={selectedKeys}
                      selectedKeys={selectedKeys}
                      showIcon={false}
                      treeData={getTreeData({ filters: column.value.filters })}
                      autoExpandParent
                      defaultExpandAll
                      filterTreeNode={
                        searchValue.value.trim()
                          ? (node: FilterTreeDataNode) => {
                              if (typeof filterSearch.value === 'function') {
                                return (filterSearch.value as any)(searchValue.value, getFilterData(node))
                              }
                              return searchValueMatched(searchValue.value, node.title)
                            }
                          : undefined
                      }
                    />
                  </div>
                </>
              )
            }
            const isEmpty = menuItems.value?.every?.(item => item === null)
            return (
              <>
                <FilterSearch
                  filterSearch={filterSearch.value as FilterSearchType<ColumnFilterItem>}
                  value={searchValue.value}
                  onChange={onSearch}
                  tablePrefixCls={props.tablePrefixCls}
                  locale={props.locale}
                />
                {isEmpty
                  ? (empty)
                  : (
                      <Menu
                        selectable
                        multiple={props.filterMultiple}
                        prefixCls={`${props.dropdownPrefixCls}-menu`}
                        class={dropdownMenuClass.value}
                        onSelect={onSelectKeys}
                        onDeselect={onSelectKeys}
                        selectedKeys={selectedKeys}
                        getPopupContainer={props.getPopupContainer}
                        openKeys={openKeys.value}
                        onOpenChange={onOpenChange}
                        items={menuItems.value}
                      />
                    )}
              </>
            )
          }

          const getResetDisabled = () => {
            if (column.value.filterResetToDefaultFilteredValue) {
              return isEqual(
                (column.value.defaultFilteredValue || []).map(key => String(key)),
                selectedKeys,
                true,
              )
            }

            return selectedKeys.length === 0
          }

          dropdownContent = (
            <>
              {getFilterComponent()}
              <div class={`${props.prefixCls}-dropdown-btns`}>
                <Button type="link" size="small" disabled={getResetDisabled()} onClick={() => onReset()}>
                  {props.locale.filterReset}
                </Button>
                <Button type="primary" size="small" onClick={onConfirm}>
                  {props.locale.filterConfirm}
                </Button>
              </div>
            </>
          )
        }
        if (filterDropdownDefined.value) {
          dropdownContent = <OverrideProvider value={{ selectable: undefined }}>{dropdownContent}</OverrideProvider>
        }

        return (
          <FilterDropdownMenuWrapper className={`${props.prefixCls}-dropdown`}>
            {dropdownContent}
          </FilterDropdownMenuWrapper>
        )
      }

      const getDropdownTrigger = () => {
        let filterIcon: any
        if (props.filterIconRender) {
          filterIcon = props.filterIconRender({ column: column.value, filtered: filtered.value })
        }
        else if (typeof column.value.filterIcon === 'function') {
          filterIcon = column.value.filterIcon(filtered.value)
        }
        else if (column.value.filterIcon) {
          filterIcon = column.value.filterIcon
        }
        else {
          filterIcon = <FilterFilled />
        }

        return (
          <span
            role="button"
            tabindex={-1}
            class={clsx(`${props.prefixCls}-trigger`, { active: filtered.value })}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {filterIcon}
          </span>
        )
      }

      const getTitle = () => slots.default?.() ?? (props as any).children

      const triggerNode = getDropdownTrigger()
      // MeasureRow：仅渲染静态 trigger，不渲染 Dropdown 实例
      if (inMeasureRow.value) {
        return (
          <div class={`${prefixCls}-column`}>
            <span class={`${tablePrefixCls}-column-title`}>{getTitle()}</span>
            {triggerNode}
          </div>
        )
      }
      const dropdownContent = getDropdownContent()
      const dropdownRootClassName = clsx(
        props.rootClassName,
        filterDropdownProps.value.rootClassName,
        filterDropdownProps.value.rootClass,
      )
      const mergedDropdownProps = extendsObject(
        {
          trigger: ['click'],
          placement: direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
          getPopupContainer: props.getPopupContainer,
          prefixCls: props.dropdownPrefixCls,
          rootClass: dropdownRootClassName,
        },
        {
          ...filterDropdownProps.value,
          open: mergedVisible.value,
          onOpenChange: onVisibleChange,
          popupRender: () => {
            if (typeof filterDropdownProps.value.popupRender === 'function') {
              return filterDropdownProps.value.popupRender(dropdownContent)
            }
            if (typeof filterDropdownProps.value.dropdownRender === 'function') {
              return filterDropdownProps.value.dropdownRender(dropdownContent)
            }
            return dropdownContent
          },
        },
      )
      return (
        <div class={`${prefixCls}-column`}>
          <span class={`${tablePrefixCls}-column-title`}>{getTitle()}</span>
          <Dropdown {...mergedDropdownProps as any}>
            {getDropdownTrigger()}
          </Dropdown>
        </div>
      )
    }
  },
)

export default FilterDropdown
