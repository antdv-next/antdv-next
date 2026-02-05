import type { CheckboxChangeEvent } from '@v-c/checkbox'
import type { DataNode } from '@v-c/tree'
import type { Ref } from 'vue'
import type { AnyObject } from '../../_util/type.ts'
import type {
  ColumnsType,
  ColumnType,
  GetPopupContainer,
  GetRowKey,
  Key,
  RowSelectMethod,
  SelectionItem,
  TableLocale,
  TableRowSelection,
  TransformColumns,
} from '../interface.ts'
import { DownOutlined } from '@antdv-next/icons'
import { INTERNAL_COL_DEFINE } from '@v-c/table'
import { arrAdd, arrDel, conductCheck, convertDataToEntities } from '@v-c/tree'
import { clsx } from '@v-c/util'
import { computed, shallowRef, unref, watch } from 'vue'
import { useMultipleSelect } from '../../_util/hooks'
import { devUseWarning } from '../../_util/warning.ts'
import Checkbox from '../../checkbox'
import Dropdown from '../../dropdown'
import Radio from '../../radio'

export const SELECTION_COLUMN = {} as const
export const SELECTION_ALL = 'SELECT_ALL' as const
export const SELECTION_INVERT = 'SELECT_INVERT' as const
export const SELECTION_NONE = 'SELECT_NONE' as const

const EMPTY_LIST: Key[] = []

type MaybeRef<T> = T | Ref<T>

interface UseSelectionConfig<RecordType = AnyObject> {
  prefixCls: MaybeRef<string>
  pageData: MaybeRef<RecordType[]>
  data: MaybeRef<RecordType[]>
  getRowKey: MaybeRef<GetRowKey<RecordType>>
  getRecordByKey: (key: Key) => RecordType
  childrenColumnName: MaybeRef<string>
  locale: MaybeRef<TableLocale>
  getPopupContainer?: MaybeRef<GetPopupContainer | undefined>
}

export type INTERNAL_SELECTION_ITEM
  = | SelectionItem
    | typeof SELECTION_ALL
    | typeof SELECTION_INVERT
    | typeof SELECTION_NONE

function flattenData<RecordType extends AnyObject = AnyObject>(childrenColumnName: keyof RecordType, data?: RecordType[], list: RecordType[] = []): RecordType[] {
  ;(data || []).forEach((record) => {
    list.push(record)
    if (record && typeof record === 'object' && childrenColumnName in record) {
      flattenData<RecordType>(childrenColumnName, (record as any)[childrenColumnName], list)
    }
  })
  return list
}

export default function useSelection<RecordType extends AnyObject = AnyObject>(
  config: UseSelectionConfig<RecordType>,
  rowSelection?: MaybeRef<TableRowSelection<RecordType> | undefined>,
) {
  const warning = devUseWarning('Table')
  const rowSelectionValue = computed(() => unref(rowSelection))
  const selectionConfig = computed(() => rowSelectionValue.value || {} as TableRowSelection<RecordType>)
  const preserveSelectedRowKeys = computed(() => selectionConfig.value.preserveSelectedRowKeys)
  const selectionType = computed(() => selectionConfig.value.type)
  const selections = computed(() => selectionConfig.value.selections)
  const hideSelectAll = computed(() => selectionConfig.value.hideSelectAll)
  const checkStrictly = computed(() => selectionConfig.value.checkStrictly ?? true)
  const selectionColWidth = computed(() => selectionConfig.value.columnWidth)
  const fixed = computed(() => selectionConfig.value.fixed)
  const customizeRenderCell = computed(() => selectionConfig.value.renderCell)

  const prefixCls = computed(() => unref(config.prefixCls))
  const data = computed(() => unref(config.data))
  const pageData = computed(() => unref(config.pageData))
  const getRecordByKey = config.getRecordByKey
  const getRowKey = computed(() => unref(config.getRowKey))
  const childrenColumnName = computed(() => unref(config.childrenColumnName))
  const tableLocale = computed(() => unref(config.locale))
  const getPopupContainer = computed(() => unref(config.getPopupContainer))
  const isTreeData = computed(() =>
    (data.value || []).some(item => item?.[childrenColumnName.value]),
  )

  const [multipleSelect, updatePrevSelectedIndex] = useMultipleSelect<Key, Key>(item => item)

  const innerSelectedKeys = shallowRef<Key[]>(
    selectionConfig.value.defaultSelectedRowKeys || EMPTY_LIST,
  )
  const mergedSelectedKeys = computed(() => selectionConfig.value.selectedRowKeys ?? innerSelectedKeys.value)

  const setMergedSelectedKeys = (keys: Key[]) => {
    innerSelectedKeys.value = keys
  }

  const preserveRecordsRef = shallowRef(new Map<Key, RecordType>())

  const updatePreserveRecordsCache = (keys: Key[]) => {
    if (preserveSelectedRowKeys.value) {
      const newCache = new Map<Key, RecordType>()
      keys.forEach((key) => {
        let record = getRecordByKey(key)

        if (!record && preserveRecordsRef.value.has(key)) {
          record = preserveRecordsRef.value.get(key) as RecordType
        }

        newCache.set(key, record)
      })
      preserveRecordsRef.value = newCache
    }
  }

  watch(mergedSelectedKeys, (nextKeys) => {
    updatePreserveRecordsCache(nextKeys)
  })

  const flattedData = computed(() =>
    flattenData(childrenColumnName.value as keyof RecordType, pageData.value as RecordType[]),
  )

  const keyEntities = computed(() => {
    if (checkStrictly.value) {
      return { keyEntities: null }
    }
    let convertData = data.value
    if (preserveSelectedRowKeys.value) {
      const keysSet = new Set(flattedData.value.map((record, index) => getRowKey.value(record, index)))
      const preserveRecords = Array.from(preserveRecordsRef.value).reduce<RecordType[]>(
        (total, [key, value]) => (keysSet.has(key) ? total : total.concat(value)),
        [],
      )
      convertData = [...convertData, ...preserveRecords]
    }
    return convertDataToEntities(convertData as unknown as DataNode[], {
      externalGetKey: getRowKey.value as any,
      childrenPropName: childrenColumnName.value,
    })
  })

  const checkboxPropsMap = computed(() => {
    const map = new Map<Key, Partial<any>>()
    flattedData.value.forEach((record, index) => {
      const key = getRowKey.value(record, index)
      const checkboxProps = (selectionConfig.value.getCheckboxProps
        ? selectionConfig.value.getCheckboxProps(record)
        : null) || {}
      map.set(key, checkboxProps)

      warning(
        !('checked' in checkboxProps || 'defaultChecked' in checkboxProps),
        'usage',
        'Do not set `checked` or `defaultChecked` in `getCheckboxProps`. Please use `selectedRowKeys` instead.',
      )
    })
    return map
  })

  const isCheckboxDisabled = (r: RecordType) => {
    const rowKey = getRowKey.value(r)
    let checkboxProps: Partial<any> | undefined
    if (checkboxPropsMap.value.has(rowKey)) {
      checkboxProps = checkboxPropsMap.value.get(getRowKey.value(r))
    }
    else {
      checkboxProps = selectionConfig.value.getCheckboxProps
        ? selectionConfig.value.getCheckboxProps(r)
        : undefined
    }
    return !!checkboxProps?.disabled
  }

  const derivedSelectedKeys = computed(() => {
    if (checkStrictly.value) {
      return [mergedSelectedKeys.value || [], []] as const
    }
    const { checkedKeys, halfCheckedKeys } = conductCheck(
      mergedSelectedKeys.value,
      true,
      keyEntities.value.keyEntities as any,
      isCheckboxDisabled as any,
    )
    return [checkedKeys || [], halfCheckedKeys] as const
  })

  const derivedSelectedKeySet = computed(() => {
    const keys = selectionType.value === 'radio'
      ? derivedSelectedKeys.value[0].slice(0, 1)
      : derivedSelectedKeys.value[0]
    return new Set(keys)
  })

  const derivedHalfSelectedKeySet = computed(() =>
    selectionType.value === 'radio' ? new Set() : new Set(derivedSelectedKeys.value[1]),
  )

  watch(
    () => !!rowSelectionValue.value,
    (hasSelection) => {
      if (!hasSelection) {
        setMergedSelectedKeys(EMPTY_LIST)
      }
    },
  )

  const setSelectedKeys = (keys: Key[], method: RowSelectMethod) => {
    let availableKeys: Key[]
    let records: RecordType[]

    updatePreserveRecordsCache(keys)

    if (preserveSelectedRowKeys.value) {
      availableKeys = keys
      records = keys.map(key => preserveRecordsRef.value.get(key) as RecordType)
    }
    else {
      availableKeys = []
      records = []

      keys.forEach((key) => {
        const record = getRecordByKey(key)
        if (record !== undefined) {
          availableKeys.push(key)
          records.push(record)
        }
      })
    }

    setMergedSelectedKeys(availableKeys)

    selectionConfig.value.onChange?.(availableKeys, records, { type: method })
  }

  const triggerSingleSelection = (key: Key, selected: boolean, keys: Key[], event: Event) => {
    if (selectionConfig.value.onSelect) {
      const rows = keys.map(k => getRecordByKey(k))
      selectionConfig.value.onSelect(getRecordByKey(key), selected, rows, event)
    }

    setSelectedKeys(keys, 'single')
  }

  const mergedSelections = computed<SelectionItem[] | null>(() => {
    if (!selections.value || hideSelectAll.value) {
      return null
    }

    const selectionList: INTERNAL_SELECTION_ITEM[]
      = selections.value === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections.value

    return selectionList
      .map((selection: INTERNAL_SELECTION_ITEM) => {
        if (selection === SELECTION_ALL) {
          return {
            key: 'all',
            text: tableLocale.value.selectionAll,
            onSelect() {
              setSelectedKeys(
                data.value
                  .map((record, index) => getRowKey.value(record, index))
                  .filter((key) => {
                    const checkProps = checkboxPropsMap.value.get(key)
                    return !checkProps?.disabled || derivedSelectedKeySet.value.has(key)
                  }),
                'all',
              )
            },
          }
        }
        if (selection === SELECTION_INVERT) {
          return {
            key: 'invert',
            text: tableLocale.value.selectInvert,
            onSelect() {
              const keySet = new Set(derivedSelectedKeySet.value)
              pageData.value.forEach((record, index) => {
                const key = getRowKey.value(record, index)
                const checkProps = checkboxPropsMap.value.get(key)

                if (!checkProps?.disabled) {
                  if (keySet.has(key)) {
                    keySet.delete(key)
                  }
                  else {
                    keySet.add(key)
                  }
                }
              })

              const keys = Array.from(keySet)
              if (selectionConfig.value.onSelectInvert) {
                warning.deprecated(false, 'onSelectInvert', 'onChange')
                selectionConfig.value.onSelectInvert(keys)
              }

              setSelectedKeys(keys, 'invert')
            },
          }
        }
        if (selection === SELECTION_NONE) {
          return {
            key: 'none',
            text: tableLocale.value.selectNone,
            onSelect() {
              selectionConfig.value.onSelectNone?.()
              setSelectedKeys(
                Array.from(derivedSelectedKeySet.value).filter((key) => {
                  const checkProps = checkboxPropsMap.value.get(key)
                  return checkProps?.disabled
                }),
                'none',
              )
            },
          }
        }
        return selection as SelectionItem
      })
      .map(selection => ({
        ...selection,
        onSelect: (...rest) => {
          selection.onSelect?.(...rest)
          updatePrevSelectedIndex(null)
        },
      }))
  })

  const transformColumns: TransformColumns<RecordType> = (columns: ColumnsType<RecordType>) => {
    if (!rowSelectionValue.value) {
      warning(
        !columns.includes(SELECTION_COLUMN as any),
        'usage',
        '`rowSelection` is not config but `SELECTION_COLUMN` exists in the `columns`.',
      )

      return columns.filter(col => col !== (SELECTION_COLUMN as any))
    }

    let cloneColumns = [...columns]
    const keySet = new Set(derivedSelectedKeySet.value)

    const recordKeys = flattedData.value
      .map((record, index) => getRowKey.value(record, index))
      .filter(key => !checkboxPropsMap.value.get(key)?.disabled)

    const checkedCurrentAll = recordKeys.every(key => keySet.has(key))
    const checkedCurrentSome = recordKeys.some(key => keySet.has(key))

    const onSelectAllChange = () => {
      const changeKeys: Key[] = []

      if (checkedCurrentAll) {
        recordKeys.forEach((key) => {
          keySet.delete(key)
          changeKeys.push(key)
        })
      }
      else {
        recordKeys.forEach((key) => {
          if (!keySet.has(key)) {
            keySet.add(key)
            changeKeys.push(key)
          }
        })
      }

      const keys = Array.from(keySet)

      selectionConfig.value.onSelectAll?.(
        !checkedCurrentAll,
        keys.map(k => getRecordByKey(k)),
        changeKeys.map(k => getRecordByKey(k)),
      )

      setSelectedKeys(keys, 'all')
      updatePrevSelectedIndex(null)
    }

    let title: any
    let columnTitleCheckbox: any
    if (selectionType.value !== 'radio') {
      let customizeSelections: any
      if (mergedSelections.value) {
        const menuItems = mergedSelections.value.map((selection, index) => ({
          key: selection.key ?? index,
          label: selection.text,
        }))

        const selectionMap = new Map<string | number, SelectionItem>()
        mergedSelections.value.forEach((selection, index) => {
          selectionMap.set(selection.key ?? index, selection)
        })

        customizeSelections = (
          <div class={`${prefixCls.value}-selection-extra`}>
            <Dropdown
              menu={{
                getPopupContainer: getPopupContainer.value,
                items: menuItems,
              }}
              getPopupContainer={getPopupContainer.value}
              onMenuClick={(info: any) => {
                const selection = selectionMap.get(info?.key)
                selection?.onSelect?.(recordKeys)
              }}
            >
              <span>
                <DownOutlined />
              </span>
            </Dropdown>
          </div>
        )
      }

      const allDisabledData = flattedData.value
        .map((record, index) => {
          const key = getRowKey.value(record, index)
          const checkboxProps = checkboxPropsMap.value.get(key) || {}
          return { checked: keySet.has(key), ...checkboxProps }
        })
        .filter(({ disabled }: any) => disabled)

      const allDisabled = !!allDisabledData.length && allDisabledData.length === flattedData.value.length

      const allDisabledAndChecked = allDisabled && allDisabledData.every(({ checked }) => checked)
      const allDisabledSomeChecked = allDisabled && allDisabledData.some(({ checked }) => checked)
      const customCheckboxProps = selectionConfig.value.getTitleCheckboxProps?.() || {}
      const { onChange, disabled } = customCheckboxProps as any
      columnTitleCheckbox = (
        <Checkbox
          aria-label={customizeSelections ? 'Custom selection' : 'Select all'}
          {...customCheckboxProps as any}
          checked={!allDisabled ? !!flattedData.value.length && checkedCurrentAll : allDisabledAndChecked}
          indeterminate={
            !allDisabled
              ? !checkedCurrentAll && checkedCurrentSome
              : !allDisabledAndChecked && allDisabledSomeChecked
          }
          onChange={(e: any) => {
            onSelectAllChange()
            onChange?.(e)
          }}
          disabled={disabled ?? (flattedData.value.length === 0 || allDisabled)}
          skipGroup
        />
      )

      title = !hideSelectAll.value && (
        <div class={`${prefixCls.value}-selection`}>
          {columnTitleCheckbox}
          {customizeSelections}
        </div>
      )
    }

    let renderCell: (
      _: RecordType,
      record: RecordType,
      index: number,
    ) => { node: any, checked: boolean }

    if (selectionType.value === 'radio') {
      renderCell = (_, record, index) => {
        const key = getRowKey.value(record, index)
        const checked = keySet.has(key)
        const checkboxProps = checkboxPropsMap.value.get(key)
        return {
          node: (
            <Radio
              {...checkboxProps as any}
              checked={checked}
              onClick={(e: any) => {
                e.stopPropagation()
                checkboxProps?.onClick?.(e)
              }}
              onChange={(event: any) => {
                if (!keySet.has(key)) {
                  triggerSingleSelection(key, true, [key], (event as any).nativeEvent)
                }
                checkboxProps?.onChange?.(event)
              }}
            />
          ),
          checked,
        }
      }
    }
    else {
      renderCell = (_, record, index) => {
        const key = getRowKey.value(record, index)
        const checked = keySet.has(key)
        const indeterminate = derivedHalfSelectedKeySet.value.has(key)
        const checkboxProps = checkboxPropsMap.value.get(key)
        let mergedIndeterminate: boolean
        if (isTreeData.value) {
          mergedIndeterminate = indeterminate
          warning(
            typeof (checkboxProps as any)?.indeterminate !== 'boolean',
            'usage',
            'set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.',
          )
        }
        else {
          mergedIndeterminate = (checkboxProps as any)?.indeterminate ?? indeterminate
        }

        return {
          node: (
            <Checkbox
              {...checkboxProps as any}
              indeterminate={mergedIndeterminate}
              checked={checked}
              skipGroup
              onClick={(e: any) => {
                e.stopPropagation()
                checkboxProps?.onClick?.(e)
              }}
              onChange={(event: CheckboxChangeEvent) => {
                const nativeEvent = event.nativeEvent
                const { shiftKey } = nativeEvent
                const currentSelectedIndex = recordKeys.indexOf(key)
                const isMultiple = derivedSelectedKeys.value[0].some(item => recordKeys.includes(item))

                if (shiftKey && checkStrictly.value && isMultiple) {
                  const changedKeys = multipleSelect(currentSelectedIndex, recordKeys, keySet)
                  const keys = Array.from(keySet)

                  selectionConfig.value.onSelectMultiple?.(
                    !checked,
                    keys.map(recordKey => getRecordByKey(recordKey)),
                    changedKeys.map(recordKey => getRecordByKey(recordKey)),
                  )

                  setSelectedKeys(keys, 'multiple')
                }
                else {
                  const originCheckedKeys = derivedSelectedKeys.value[0]
                  if (checkStrictly.value) {
                    const checkedKeys = checked
                      ? arrDel(originCheckedKeys, key)
                      : arrAdd(originCheckedKeys, key)
                    triggerSingleSelection(key, !checked, checkedKeys, nativeEvent)
                  }
                  else {
                    const result = conductCheck(
                      [...originCheckedKeys, key],
                      true,
                      keyEntities.value.keyEntities as any,
                      isCheckboxDisabled as any,
                    )
                    const { checkedKeys, halfCheckedKeys } = result
                    let nextCheckedKeys = checkedKeys

                    if (checked) {
                      const tempKeySet = new Set(checkedKeys)
                      tempKeySet.delete(key)
                      nextCheckedKeys = conductCheck(
                        Array.from(tempKeySet),
                        { checked: false, halfCheckedKeys },
                        keyEntities.value.keyEntities as any,
                        isCheckboxDisabled as any,
                      ).checkedKeys
                    }

                    triggerSingleSelection(key, !checked, nextCheckedKeys, nativeEvent)
                  }
                }

                if (checked) {
                  updatePrevSelectedIndex(null)
                }
                else {
                  updatePrevSelectedIndex(currentSelectedIndex)
                }
                checkboxProps?.onChange?.(event)
              }}
            />
          ),
          checked,
        }
      }
    }

    const renderSelectionCell = (_: any, record: RecordType, index: number) => {
      const { node, checked } = renderCell(_, record, index)

      if (customizeRenderCell.value) {
        return customizeRenderCell.value(checked, record, index, node)
      }

      return node
    }

    if (!cloneColumns.includes(SELECTION_COLUMN as any)) {
      if (
        cloneColumns.findIndex((col: any) => col[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN') === 0
      ) {
        const [expandColumn, ...restColumns] = cloneColumns
        cloneColumns = [expandColumn, SELECTION_COLUMN as any, ...restColumns]
      }
      else {
        cloneColumns = [SELECTION_COLUMN as any, ...cloneColumns]
      }
    }

    const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN as any)

    warning(
      cloneColumns.filter(col => col === (SELECTION_COLUMN as any)).length <= 1,
      'usage',
      'Multiple `SELECTION_COLUMN` exist in `columns`.',
    )

    cloneColumns = cloneColumns.filter(
      (column, index) => column !== (SELECTION_COLUMN as any) || index === selectionColumnIndex,
    )

    const prevCol: ColumnType<RecordType> & Record<string, any> | undefined
      = cloneColumns[selectionColumnIndex - 1]
    const nextCol: ColumnType<RecordType> & Record<string, any> | undefined
      = cloneColumns[selectionColumnIndex + 1]

    let mergedFixed: any = fixed.value

    if (mergedFixed === undefined) {
      if (nextCol?.fixed !== undefined) {
        mergedFixed = nextCol.fixed
      }
      else if (prevCol?.fixed !== undefined) {
        mergedFixed = prevCol.fixed
      }
    }

    if (
      mergedFixed
      && prevCol
      && prevCol[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN'
      && prevCol.fixed === undefined
    ) {
      prevCol.fixed = mergedFixed
    }

    const columnCls = clsx(`${prefixCls.value}-selection-col`, {
      [`${prefixCls.value}-selection-col-with-dropdown`]: selections.value && selectionType.value === 'checkbox',
    })

    const renderColumnTitle = () => {
      if (!selectionConfig.value.columnTitle) {
        return title
      }
      if (typeof selectionConfig.value.columnTitle === 'function') {
        return selectionConfig.value.columnTitle(columnTitleCheckbox)
      }
      return selectionConfig.value.columnTitle
    }

    const selectionColumn: ColumnsType<RecordType>[0] & {
      RC_TABLE_INTERNAL_COL_DEFINE: Record<string, any>
    } = {
      fixed: mergedFixed,
      width: selectionColWidth.value,
      className: `${prefixCls.value}-selection-column`,
      title: renderColumnTitle(),
      render: renderSelectionCell as any,
      onCell: selectionConfig.value.onCell,
      align: selectionConfig.value.align,
      [INTERNAL_COL_DEFINE]: { className: columnCls },
    } as any

    return cloneColumns.map(col => (col === (SELECTION_COLUMN as any) ? selectionColumn : col))
  }

  return [transformColumns, derivedSelectedKeySet] as const
}
