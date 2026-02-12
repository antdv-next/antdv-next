import type { VueNode } from '../_util/type'
import type {
  KeyWiseTransferItem,
  TransferSemanticClassNames,
  TransferSemanticStyles,
} from './interface'
import { DeleteOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'
import Checkbox from '../checkbox'
import defaultLocale from '../locale/en_US'
import useLocale from '../locale/useLocale'

interface ListItemProps<RecordType> {
  prefixCls: string
  classes: TransferSemanticClassNames
  styles: TransferSemanticStyles
  renderedText?: string | number
  renderedEl: VueNode
  disabled?: boolean
  checked?: boolean
  onClick: (item: RecordType, e: MouseEvent) => void
  onRemove?: (item: RecordType) => void
  item: RecordType
  showRemove?: boolean
}

const ListItem = defineComponent<
  ListItemProps<KeyWiseTransferItem>
>(
  (props) => {
    const [contextLocale] = useLocale('Transfer', defaultLocale.Transfer)
    return () => {
      const {
        prefixCls,
        classes: classNames,
        styles,
        renderedText,
        renderedEl,
        item,
        checked,
        disabled,
        onClick,
        onRemove,
        showRemove,
      } = props
      const mergedDisabled = disabled || item?.disabled
      const classes = clsx(`${prefixCls}-content-item`, classNames.item, {
        [`${prefixCls}-content-item-disabled`]: mergedDisabled,
        [`${prefixCls}-content-item-checked`]: checked && !mergedDisabled,
      })

      let title: string | undefined
      if (typeof renderedText === 'string' || typeof renderedText === 'number') {
        title = String(renderedText)
      }

      const labelNode = (
        <span
          class={clsx(`${prefixCls}-content-item-text`, classNames.itemContent)}
          style={styles.itemContent}
        >
          {renderedEl}
        </span>
      )

      if (showRemove) {
        return (
          <li class={classes} style={styles.item} title={title}>
            {labelNode}
            <button
              type="button"
              disabled={mergedDisabled}
              class={`${prefixCls}-content-item-remove`}
              aria-label={contextLocale?.value?.remove}
              onClick={() => onRemove?.(item)}
            >
              <DeleteOutlined />
            </button>
          </li>
        )
      }

      return (
        <li
          class={classes}
          style={styles.item}
          title={title}
          onClick={mergedDisabled ? undefined : (event: MouseEvent) => onClick(item, event)}
        >
          <Checkbox
            class={clsx(`${prefixCls}-checkbox`, classNames.itemIcon)}
            style={styles.itemIcon}
            checked={checked}
            disabled={mergedDisabled}
          />
          {labelNode}
        </li>
      )
    }
  },
  {
    name: 'ATransferListItem',
    inheritAttrs: false,
  },
)

export default ListItem
