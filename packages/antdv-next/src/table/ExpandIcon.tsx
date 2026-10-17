import type { ExpandIconComponent, ExpandIconProps } from '@v-c/table'
import type { FunctionalComponent } from 'vue'
import type { AnyObject } from '../_util/type.ts'
import type { TableLocale } from './interface.ts'
import { clsx } from '@v-c/util'
import { h } from 'vue'

type LegacyRenderExpandIcon<RecordType = AnyObject> = (props: {
  prefixCls: string
  record: RecordType
  expanded: boolean
  expandable: boolean
  onExpand: (record: RecordType, e: MouseEvent) => void
}) => any

function renderInternalExpandIcon<RecordType = AnyObject>(
  props: ExpandIconProps<RecordType>,
  locale: TableLocale,
) {
  const { prefixCls, type, expanded, expandable, onClick } = props
  const iconPrefix = `${prefixCls}-row-expand-icon`

  if (type === 'all' && !expandable) {
    return <span class={clsx(iconPrefix, `${iconPrefix}-spaced`)} />
  }

  const ariaLabel = type === 'all'
    ? (expanded ? locale.collapseAll : locale.expandAll)
    : (expanded ? locale.collapse : locale.expand)

  return (
    <button
      type="button"
      onClick={onClick}
      class={clsx(iconPrefix, {
        [`${iconPrefix}-spaced`]: !expandable,
        [`${iconPrefix}-expanded`]: expandable && expanded,
        [`${iconPrefix}-collapsed`]: expandable && !expanded,
      })}
      aria-label={ariaLabel}
      aria-expanded={expanded}
    />
  )
}

/**
 * Create a stable expand icon component for `components.ExpandIcon`.
 * Getters are read at render time so the component itself never changes identity.
 */
export default function createExpandIcon<RecordType extends AnyObject = AnyObject>(
  getLocale: () => TableLocale,
  getExpandIcon: () => ExpandIconComponent<RecordType> | undefined,
  getLegacyRenderExpandIcons: () => (LegacyRenderExpandIcon<RecordType> | undefined)[],
): ExpandIconComponent<RecordType> {
  const MergedExpandIcon: FunctionalComponent<ExpandIconProps<RecordType>> = (props) => {
    const ExpandIcon = getExpandIcon()
    if (ExpandIcon) {
      return h(ExpandIcon as any, props)
    }

    const renderExpandIcon = getLegacyRenderExpandIcons().find(Boolean)
    if (renderExpandIcon && props.type === 'row') {
      const { prefixCls, record, expanded, expandable, onClick } = props
      return renderExpandIcon({
        prefixCls,
        record,
        expanded,
        expandable,
        onExpand: (_record, event) => onClick(event),
      })
    }

    return renderInternalExpandIcon(props, getLocale())
  }
  MergedExpandIcon.displayName = 'TableExpandIcon'
  // `onClick` is consumed explicitly, avoid falling through to custom icon roots
  MergedExpandIcon.inheritAttrs = false
  return MergedExpandIcon as ExpandIconComponent<RecordType>
}
