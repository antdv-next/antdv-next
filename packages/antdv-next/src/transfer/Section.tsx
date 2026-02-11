import type { MenuProps } from '../menu'
import type {
  KeyWiseTransferItem,
  RenderResult,
  RenderResultObject,
  TransferListProps,
  TransferSearchOption,
} from './interface'
import type { ListBodyRef } from './ListBody'
import { DownOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, isVNode, ref } from 'vue'
import { groupKeysMap } from '../_util/transKeys'
import Checkbox from '../checkbox'
import Dropdown from '../dropdown'
import { OmitProps } from './interface'
import DefaultListBody from './ListBody'
import Search from './search'

const defaultRender = () => null

function isRenderResultPlainObject(result: RenderResult): result is RenderResultObject {
  return !!(result && !isVNode(result) && Object.prototype.toString.call(result) === '[object Object]')
}

function getEnabledItemKeys<RecordType extends KeyWiseTransferItem>(items: RecordType[]) {
  return items.filter(data => !data.disabled).map(data => data.key)
}

const isValidIcon = (icon: any) => icon !== undefined

function getShowSearchOption(showSearch: boolean | TransferSearchOption) {
  if (showSearch && typeof showSearch === 'object') {
    return {
      ...showSearch,
      defaultValue: showSearch.defaultValue || '',
    }
  }
  return {
    defaultValue: '',
    placeholder: '',
  }
}

const TransferSection = defineComponent<
  TransferListProps<KeyWiseTransferItem>
>(
  (props) => {
    const sectionPrefixCls = computed(() => `${props.prefixCls}-section`)
    const listPrefixCls = computed(() => `${props.prefixCls}-list`)
    const dataSource = computed(() => props.dataSource || [])

    const searchOptions = getShowSearchOption(props.showSearch || false)
    const filterValue = ref(searchOptions.defaultValue)
    const listBodyRef = ref<ListBodyRef<KeyWiseTransferItem> | null>(null)

    const internalHandleFilter = (e: Event) => {
      const target = e?.target as HTMLInputElement | null
      filterValue.value = target?.value ?? ''
      props.handleFilter(e)
    }

    const internalHandleClear = () => {
      filterValue.value = ''
      props.handleClear()
    }

    const matchFilter = (text: string, item: KeyWiseTransferItem) => {
      if (typeof props.filterOption === 'function') {
        return props.filterOption(filterValue.value, item, props.direction)
      }
      return text.includes(filterValue.value)
    }

    const renderItem = (item: KeyWiseTransferItem) => {
      const renderResult = (props.render || defaultRender)(item)
      const isRenderResultPlain = isRenderResultPlainObject(renderResult)
      const labelNode = props.labelRender?.(item)
      let mergedLabel: any = null
      if (Array.isArray(labelNode)) {
        const labelNodes = filterEmpty(labelNode)
        if (labelNodes.length) {
          mergedLabel = labelNodes
        }
      }
      else if (labelNode !== undefined && labelNode !== null) {
        mergedLabel = labelNode
      }
      const renderedText = isRenderResultPlain
        ? renderResult.value
        : (typeof renderResult === 'string' || typeof renderResult === 'number' ? String(renderResult) : '')
      return {
        item,
        renderedEl: mergedLabel ?? (isRenderResultPlain ? renderResult.label : renderResult),
        renderedText,
      }
    }

    const notFoundContentEle = computed(() =>
      Array.isArray(props.notFoundContent)
        ? props.notFoundContent[props.direction === 'left' ? 0 : 1]
        : props.notFoundContent,
    )

    const filteredItems = computed(() => {
      const filterItems: KeyWiseTransferItem[] = []
      const filterRenderItems: any[] = []
      dataSource.value.forEach((item) => {
        const renderedItem = renderItem(item)
        if (filterValue.value && !matchFilter(renderedItem.renderedText, item)) {
          return
        }
        filterItems.push(item)
        filterRenderItems.push(renderedItem)
      })
      return { filterItems, filterRenderItems }
    })

    const checkedActiveItems = computed(() =>
      filteredItems.value.filterItems
        .filter(item => props.checkedKeys.includes(item.key) && !item.disabled),
    )

    const checkStatus = computed(() => {
      if (checkedActiveItems.value.length === 0) {
        return 'none'
      }
      const checkedKeysMap = groupKeysMap(props.checkedKeys)
      if (filteredItems.value.filterItems.every(item => checkedKeysMap.has(item.key) || !!item.disabled)) {
        return 'all'
      }
      return 'part'
    })

    const renderListBody = () => {
      const search = props.showSearch
        ? (
            <div class={`${listPrefixCls.value}-body-search-wrapper`}>
              <Search
                prefixCls={`${listPrefixCls.value}-search`}
                onChange={internalHandleFilter}
                onClear={internalHandleClear}
                placeholder={searchOptions.placeholder || props.searchPlaceholder}
                value={filterValue.value}
                disabled={props.disabled}
              />
            </div>
          )
        : null

      const listProps = {
        ...omit(props, [...OmitProps]),
        filteredItems: filteredItems.value.filterItems,
        filteredRenderItems: filteredItems.value.filterRenderItems,
        selectedKeys: props.checkedKeys,
        classes: props.classes,
        styles: props.styles,
      }

      let bodyContent: any = props.renderList
        ? props.renderList({
            ...listProps,
            onItemSelect: (key: any, check: any) => listProps.onItemSelect(key, check),
          })
        : null
      const customize = !!bodyContent

      if (!customize) {
        bodyContent = (
          <DefaultListBody
            ref={listBodyRef}
            {...listProps}
            prefixCls={listPrefixCls.value}
          />
        )
      }

      const bodyNode = customize
        ? <div class={`${listPrefixCls.value}-body-customize-wrapper`}>{bodyContent}</div>
        : (filteredItems.value.filterItems.length
            ? bodyContent
            : <div class={`${listPrefixCls.value}-body-not-found`}>{notFoundContentEle.value}</div>)

      return (
        <div
          class={clsx(
            `${listPrefixCls.value}-body`,
            { [`${listPrefixCls.value}-body-with-search`]: props.showSearch },
            props.classes?.body,
          )}
          style={props.styles?.body}
        >
          {search}
          {bodyNode}
        </div>
      )
    }

    const getSelectAllLabel = (selectedCount: number, totalCount: number) => {
      if (props.selectAllLabel) {
        return typeof props.selectAllLabel === 'function'
          ? props.selectAllLabel({ selectedCount, totalCount })
          : props.selectAllLabel
      }
      const unit = totalCount > 1 ? props.itemsUnit : props.itemUnit
      return `${selectedCount > 0 ? `${selectedCount}/` : ''}${totalCount} ${unit}`
    }

    return () => {
      const checkBox = (
        <Checkbox
          disabled={dataSource.value.filter(d => !d.disabled).length === 0 || props.disabled}
          checked={checkStatus.value === 'all'}
          indeterminate={checkStatus.value === 'part'}
          class={`${listPrefixCls.value}-checkbox`}
          onChange={() => {
            props.onItemSelectAll?.(
              filteredItems.value.filterItems.filter(item => !item.disabled).map(({ key }) => key),
              checkStatus.value !== 'all',
            )
          }}
        />
      )

      const footerDom = props.footer && (props.footer.length < 2
        ? props.footer(props)
        : props.footer(props, { direction: props.direction }))

      const listFooter = footerDom
        ? (
            <div class={clsx(`${listPrefixCls.value}-footer`, props.classes?.footer)} style={props.styles?.footer}>
              {footerDom}
            </div>
          )
        : null

      const checkAllCheckbox = !props.showRemove && !props.pagination && checkBox

      let items: MenuProps['items']

      if (props.showRemove) {
        items = [
          props.pagination
            ? {
                key: 'removeCurrent',
                label: props.removeCurrent,
                onClick() {
                  const pageKeys = getEnabledItemKeys(
                    (listBodyRef.value?.items || []).map(entity => entity.item),
                  )
                  props.onItemRemove?.(pageKeys)
                },
              }
            : null,
          {
            key: 'removeAll',
            label: props.removeAll,
            onClick() {
              props.onItemRemove?.(getEnabledItemKeys(filteredItems.value.filterItems))
            },
          },
        ].filter(Boolean)
      }
      else {
        items = [
          {
            key: 'selectAll',
            label: checkStatus.value === 'all' ? props.deselectAll : props.selectAll,
            onClick() {
              const keys = getEnabledItemKeys(filteredItems.value.filterItems)
              props.onItemSelectAll?.(keys, keys.length !== props.checkedKeys.length)
            },
          },
          props.pagination
            ? {
                key: 'selectCurrent',
                label: props.selectCurrent,
                onClick() {
                  const pageItems = listBodyRef.value?.items || []
                  props.onItemSelectAll?.(getEnabledItemKeys(pageItems.map(entity => entity.item)), true)
                },
              }
            : null,
          {
            key: 'selectInvert',
            label: props.selectInvert,
            onClick() {
              const availablePageItemKeys = getEnabledItemKeys(
                (listBodyRef.value?.items || []).map(entity => entity.item),
              )
              const checkedKeySet = new Set(props.checkedKeys)
              const newCheckedKeysSet = new Set(checkedKeySet)
              availablePageItemKeys.forEach((key) => {
                if (checkedKeySet.has(key)) {
                  newCheckedKeysSet.delete(key)
                }
                else {
                  newCheckedKeysSet.add(key)
                }
              })
              props.onItemSelectAll?.(Array.from(newCheckedKeysSet), 'replace')
            },
          },
        ].filter(Boolean)
      }

      const dropdown = (
        <Dropdown class={`${listPrefixCls.value}-header-dropdown`} menu={{ items }} disabled={props.disabled}>
          {isValidIcon(props.selectionsIcon) ? props.selectionsIcon : <DownOutlined />}
        </Dropdown>
      )

      return (
        <div
          class={clsx(sectionPrefixCls.value, props.classes?.section, {
            [`${sectionPrefixCls.value}-with-pagination`]: !!props.pagination,
            [`${sectionPrefixCls.value}-with-footer`]: !!footerDom,
          })}
          style={{ ...props.style, ...props.styles?.section }}
        >
          <div class={clsx(`${listPrefixCls.value}-header`, props.classes?.header)} style={props.styles?.header}>
            {props.showSelectAll
              ? (
                  <>
                    {checkAllCheckbox}
                    {dropdown}
                  </>
                )
              : null}
            <span class={`${listPrefixCls.value}-header-selected`}>
              {getSelectAllLabel(checkedActiveItems.value.length, filteredItems.value.filterItems.length)}
            </span>
            <span class={clsx(`${listPrefixCls.value}-header-title`, props.classes?.title)} style={props.styles?.title}>
              {props.titleText}
            </span>
          </div>
          {renderListBody()}
          {listFooter}
        </div>
      )
    }
  },
  {
    name: 'ATransferList',
    inheritAttrs: false,
  },
)

export default TransferSection
