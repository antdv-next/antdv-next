import type { CSSProperties, SlotsType } from 'vue'
import type { VueNode } from '../_util/type'
import type { IconType, NotificationClassNamesType, NotificationPlacement } from './interface'
import { NotificationList } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { computed, createVNode, defineComponent } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { getCloseIcon, TypeIcon } from './PurePanel'
import useStyle from './style'

export interface PureListItem {
  key: string | number
  title?: VueNode
  description?: VueNode
  type: IconType
  actions?: VueNode
  duration?: number | false
  showProgress?: boolean
}

export interface PureListProps {
  prefixCls?: string
  items: PureListItem[]
  placement?: NotificationPlacement
  classes?: NotificationClassNamesType
  style?: CSSProperties
}

export interface PureListSlots {
  default?: () => any
}

/**
 * @private Internal component. Do not use in production.
 * Mirrors ant-design 6.4.0 `notification._InternalListDoNotUseOrYouWillBeFired`.
 */
const PureList = defineComponent<
  PureListProps,
  Record<string, never>,
  string,
  SlotsType<PureListSlots>
>(
  (props) => {
    const { getPrefixCls } = useComponentBaseConfig('notification', props)
    const prefixCls = computed(() => getPrefixCls('notification'))
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    return () => {
      const noticePrefixCls = `${prefixCls.value}-notice`
      const configList = props.items.map((item) => {
        const { actions, description, duration, key, showProgress, title, type } = item
        const typeIconCls = `${noticePrefixCls}-icon-${type}`
        return {
          key,
          actions,
          closable: {
            closeIcon: getCloseIcon(noticePrefixCls),
          },
          description,
          duration: duration as any,
          icon: TypeIcon[type] ? createVNode(TypeIcon[type]) : null,
          showProgress,
          title,
          class: `${noticePrefixCls}-${type}`,
          classNames: {
            icon: typeIconCls,
          },
        }
      }) as any

      return (
        <NotificationList
          prefixCls={prefixCls.value}
          placement={props.placement ?? 'topRight'}
          configList={configList}
          class={clsx(hashId.value, cssVarCls.value, rootCls.value)}
          classNames={props.classes as any}
          style={props.style}
          stack={false}
        />
      )
    }
  },
  {
    name: 'NotificationPureList',
    inheritAttrs: false,
  },
)

export default PureList
