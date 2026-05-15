import type { NotificationProps } from '@v-c/notification'
import type { VueNode } from '../_util/type'
import type {
  ArgsClassNamesType,
  ArgsStylesType,
  MessageSemanticClassNames,
  MessageSemanticStyles,
  NoticeType,
} from './interface'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, InfoCircleFilled, LoadingOutlined } from '@antdv-next/icons'
import { Notification } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { cloneVNode, computed, defineComponent, isVNode } from 'vue'
import { pureAttrs, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useStyle from './style'

export interface PureContentProps {
  prefixCls: string
  type?: NoticeType
  icon?: VueNode
  classNames?: MessageSemanticClassNames
  styles?: MessageSemanticStyles
}

const TypeIcon = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
}

export function resolveMessageIcon(
  prefixCls: string,
  icon: VueNode | undefined,
  type: NoticeType | undefined,
  iconClassName?: string,
  iconStyle?: any,
): VueNode {
  if (icon && isVNode(icon)) {
    return cloneVNode(icon, {
      class: clsx((icon.props as any)?.class, iconClassName),
      style: { ...(icon.props as any)?.style, ...iconStyle },
    })
  }
  if (icon) {
    return (
      <span class={clsx(`${prefixCls}-icon`, iconClassName)} style={iconStyle}>
        {icon}
      </span>
    )
  }
  const IconNode = type ? TypeIcon[type] : null
  return IconNode
    ? (
        <IconNode
          class={clsx(`${prefixCls}-icon`, iconClassName)}
          style={iconStyle}
        />
      )
    : null
}

export const PureContent = defineComponent<PureContentProps>(
  (props, { slots }) => {
    return () => {
      const { prefixCls, type, icon, classNames: pureContentClassNames, styles } = props

      const renderIcon = () => {
        if (!icon && !type) {
          return null
        }

        if (icon && isVNode(icon)) {
          return cloneVNode(icon, {
            class: clsx((icon.props as any)?.class, pureContentClassNames?.icon),
            style: { ...(icon.props as any)?.style, ...styles?.icon },
          })
        }

        if (icon) {
          return (
            <span class={clsx(`${prefixCls}-icon`, pureContentClassNames?.icon)} style={styles?.icon}>
              {icon}
            </span>
          )
        }

        const IconNode = type ? TypeIcon[type] : null

        return IconNode
          ? (
              <IconNode
                class={clsx(`${prefixCls}-icon`, pureContentClassNames?.icon)}
                style={styles?.icon}
              />
            )
          : null
      }

      const iconNode = renderIcon()

      return (
        <div class={clsx(`${prefixCls}-custom-content`, type && `${prefixCls}-${type}`)}>
          {iconNode}
          <span class={pureContentClassNames?.content} style={styles?.content}>
            {slots.default?.()}
          </span>
        </div>
      )
    }
  },
  {
    name: 'MessagePureContent',
    inheritAttrs: false,
  },
)

export interface PurePanelProps extends Omit<PureContentProps, 'prefixCls' | 'children' | 'classNames' | 'styles'> {
  content?: VueNode
  duration?: number | false | null
  showProgress?: boolean
  pauseOnHover?: boolean
  closable?:
    | boolean
    | ({ closeIcon?: VueNode, onClose?: VoidFunction } & Record<string, any>)
  closeIcon?: VueNode
  props?: Record<string, any>
  onClose?: VoidFunction
  onClick?: (event: Event) => void
  prefixCls?: string
  class?: string
  classes?: ArgsClassNamesType
  styles?: ArgsStylesType
}

const omitKeys: (keyof PurePanelProps)[] = [
  'prefixCls',
  'type',
  'icon',
  'content',
  'classes',
  'styles',
  'class',
]

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent<PurePanelProps>(
  (props, { attrs }) => {
    const { classes: messageClassNames, styles } = toPropsRefs(props, 'classes', 'styles')
    const {
      getPrefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('message', props)
    const prefixCls = computed(() => props.prefixCls ?? getPrefixCls('message'))
    const mergedProps = computed(() => props)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ArgsClassNamesType,
      ArgsStylesType,
      PurePanelProps
    >(
      useToArr(contextClassNames, messageClassNames),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    return () => {
      const restProps = omit(props, omitKeys)
      const noticePrefixCls = `${prefixCls.value}-notice`
      const iconNode = resolveMessageIcon(
        prefixCls.value,
        props.icon,
        props.type,
        mergedClassNames.value?.icon,
        mergedStyles.value?.icon,
      )

      return (
        <Notification
          {...pureAttrs(attrs)}
          {...restProps as NotificationProps}
          prefixCls={prefixCls.value}
          duration={null}
          class={clsx(
            contextClassName.value,
            mergedClassNames.value?.root,
            props.class,
            hashId.value,
            cssVarCls.value,
            rootCls.value,
            `${prefixCls.value}-notice-pure-panel`,
            props.type && `${noticePrefixCls}-${props.type}`,
          )}
          style={{
            ...mergedStyles.value.root,
            ...contextStyle.value,
            ...(attrs as any).style,
          }}
          icon={iconNode}
          description={(
            <span class={mergedClassNames.value?.content} style={mergedStyles.value?.content}>
              {props.content}
            </span>
          )}
        />
      )
    }
  },
  {
    name: 'MessagePurePanel',
    inheritAttrs: false,
  },
)

export default PurePanel
