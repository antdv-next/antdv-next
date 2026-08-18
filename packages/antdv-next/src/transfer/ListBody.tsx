import type { KeyWiseTransferItem, RenderedItem, TransferListBodyProps } from './interface'
import { clsx } from '@v-c/util'
import { computed, defineComponent, ref, watch } from 'vue'
import Pagination from '../pagination'
import ListItem from './ListItem'

export type ExistPagination = Exclude<TransferListBodyProps<KeyWiseTransferItem>['pagination'], boolean>

export interface ListBodyRef<RecordType extends KeyWiseTransferItem> {
  items?: RenderedItem<RecordType>[]
}

function parsePagination(pagination?: ExistPagination) {
  const defaultPagination = {
    simple: true,
    showSizeChanger: false,
    showLessItems: false,
  }

  return { ...defaultPagination, ...pagination }
}

const TransferListBody = defineComponent<
  TransferListBodyProps<KeyWiseTransferItem>
>(
  (props, { expose }) => {
    const current = ref(1)

    const mergedPagination = computed(() => {
      if (!props.pagination) {
        return null
      }
      const convertPagination = typeof props.pagination === 'object' ? props.pagination : {}
      return parsePagination(convertPagination)
    })

    const pageSize = ref(mergedPagination.value?.pageSize ?? 10)
    watch(
      () => mergedPagination.value?.pageSize,
      (nextPageSize) => {
        if (nextPageSize) {
          pageSize.value = nextPageSize
        }
      },
    )

    watch(
      [() => props.filteredRenderItems.length, mergedPagination, pageSize],
      () => {
        if (mergedPagination.value) {
          const maxPageCount = Math.ceil(props.filteredRenderItems.length / pageSize.value)
          current.value = Math.min(current.value, maxPageCount || 1)
        }
      },
    )

    const memoizedItems = computed(() => {
      if (!mergedPagination.value) {
        return props.filteredRenderItems
      }
      const start = (current.value - 1) * pageSize.value
      const end = current.value * pageSize.value
      return props.filteredRenderItems.slice(start, end)
    })

    expose({
      get items() {
        return memoizedItems.value
      },
    })

    const onInternalClick = (item: KeyWiseTransferItem, e: MouseEvent) => {
      props.onItemSelect(item.key, !props.selectedKeys.includes(item.key), e)
    }

    const onRemove = (item: KeyWiseTransferItem) => {
      props.onItemRemove?.([item.key])
    }

    const onPageChange = (cur: number) => {
      current.value = cur
    }

    const onSizeChange = (cur: number, size: number) => {
      current.value = cur
      pageSize.value = size
    }

    return () => {
      const {
        classes = {},
        styles = {},
        prefixCls,
        showRemove,
        filteredRenderItems,
        disabled,
        onScroll,
        selectedKeys,
        remove,
      } = props
      const paginationNode = mergedPagination.value
        ? (
            <Pagination
              size="small"
              disabled={disabled}
              simple={mergedPagination.value.simple}
              pageSize={pageSize.value}
              showLessItems={mergedPagination.value.showLessItems}
              showSizeChanger={mergedPagination.value.showSizeChanger}
              class={`${prefixCls}-pagination`}
              total={filteredRenderItems.length}
              current={current.value}
              onChange={onPageChange}
              onShowSizeChange={onSizeChange}
            />
          )
        : null

      return (
        <>
          <ul
            class={clsx(`${prefixCls}-content`, classes.list, {
              [`${prefixCls}-content-show-remove`]: showRemove,
            })}
            style={styles.list}
            onScroll={onScroll}
          >
            {(memoizedItems.value || []).map(({ renderedEl, renderedText, item }) => (
              <ListItem
                key={item.key}
                prefixCls={prefixCls}
                classes={classes}
                styles={styles}
                item={item}
                renderedText={renderedText}
                renderedEl={renderedEl}
                showRemove={showRemove}
                onClick={onInternalClick}
                onRemove={onRemove}
                removeLabel={remove}
                checked={selectedKeys.includes(item.key)}
                disabled={disabled}
              />
            ))}
          </ul>
          {paginationNode}
        </>
      )
    }
  },
  {
    name: 'ATransferListBody',
    inheritAttrs: false,
  },
)

export default TransferListBody
