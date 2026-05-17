import type { CSSProperties, SlotsType, VueNode } from 'vue'
import type {
  ArgsClassNamesType,
  MessageSemanticClassNames,
  NoticeType,
} from './interface'
import { NotificationList } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { resolveMessageIcon } from './PurePanel'
import useStyle from './style'

export interface PureListItem {
  key: string | number
  content?: VueNode
  type: NoticeType
  duration?: number | false
}

export interface PureListProps {
  items: PureListItem[]
  classes?: ArgsClassNamesType
  style?: CSSProperties
}

export interface PureListSlots {
  default?: () => any
}

/**
 * @private Internal component. Do not use in production.
 * Mirrors ant-design 6.4 `message._InternalListDoNotUseOrYouWillBeFired`.
 */
const PureList = defineComponent<
  PureListProps,
  Record<string, never>,
  string,
  SlotsType<PureListSlots>
>(
  (props) => {
    const { getPrefixCls } = useComponentBaseConfig('message', props)
    const prefixCls = computed(() => getPrefixCls('message'))
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    return () => {
      const noticePrefixCls = `${prefixCls.value}-notice`
      const classes = (props.classes ?? {}) as MessageSemanticClassNames

      const configList = props.items.map((item) => {
        const { content, duration, key, type } = item
        const typeIconCls = type ? `${noticePrefixCls}-icon-${type}` : undefined
        return {
          key,
          duration: duration as any,
          icon: resolveMessageIcon(prefixCls.value, undefined, type),
          title: content,
          class: `${noticePrefixCls}-${type}`,
          classNames: {
            wrapper: `${prefixCls.value}-${type}`,
            icon: typeIconCls,
          },
        }
      }) as any

      return (
        <NotificationList
          prefixCls={prefixCls.value}
          placement="top"
          configList={configList}
          class={clsx(hashId.value, cssVarCls.value, rootCls.value)}
          classNames={{
            list: classes.list,
            listContent: classes.listContent,
            wrapper: classes.wrapper,
            title: classes.title,
            icon: classes.icon,
            root: classes.root,
          } as any}
          style={props.style}
          stack={false}
        />
      )
    }
  },
  {
    name: 'MessagePureList',
    inheritAttrs: false,
  },
)

export default PureList
