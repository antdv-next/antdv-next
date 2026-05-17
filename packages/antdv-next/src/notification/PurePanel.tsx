import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type {
  IconType,
  NotificationSemanticClassNames,
  NotificationSemanticStyles,
} from './interface'
import { CheckCircleFilled, CloseCircleFilled, CloseOutlined, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { Notification } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, createVNode, defineComponent } from 'vue'
import {
  pureAttrs,
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import useClosable, { pickClosable } from '../_util/hooks/useClosable'
import isNonNullable from '../_util/isNonNullable'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useBaseConfig, useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useStyle, { PurePanelStyle } from './style'

export type PurePanelClassNamesType = SemanticClassNamesType<
  PurePanelProps,
  NotificationSemanticClassNames
>

export type PurePanelStylesType = SemanticStylesType<PurePanelProps, NotificationSemanticStyles>

export function getCloseIcon(prefixCls: string, closeIcon?: VueNode): VueNode {
  if (closeIcon === null || closeIcon === false) {
    return null
  }
  return closeIcon || <CloseOutlined class={`${prefixCls}-close-icon`} />
}

export interface PureContentProps {
  prefixCls: string
  icon?: VueNode
  title?: VueNode
  description?: VueNode
  actions?: VueNode
  type?: IconType
  role?: 'alert' | 'status'
  classes: NotificationSemanticClassNames
  styles: NotificationSemanticStyles
}

export const TypeIcon: Record<IconType, any> = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
}

const typeToIcon = TypeIcon

export function resolveIconNode(
  icon: VueNode | undefined,
  type: IconType | undefined,
): VueNode {
  if (icon) {
    return icon
  }
  if (type && typeToIcon[type]) {
    return createVNode(typeToIcon[type])
  }
  return null
}

export function getIconWrapperClassName(prefixCls: string, type: IconType | undefined): string {
  return type ? `${prefixCls}-icon-${type}` : ''
}

const defaults = {
  role: 'alert',
} as any

export const PureContent = defineComponent<PureContentProps>(
  (props = defaults) => {
    return () => {
      const {
        prefixCls,
        icon,
        type,
        title,
        description,
        actions,
        role = 'alert',
        styles,
        classes: pureContentCls,
      } = props
      let iconNode: any
      if (icon) {
        iconNode = (
          <span class={clsx(`${prefixCls}-icon`, pureContentCls.icon)} style={styles.icon}>
            {icon}
          </span>
        )
      }
      else if (type) {
        if (typeToIcon[type]) {
          iconNode = createVNode(typeToIcon[type], {
            class: clsx(`${prefixCls}-icon`, pureContentCls.icon, `${prefixCls}-icon-${type}`),
            style: styles.icon,
          })
        }
        else {
          iconNode = null
        }
      }
      const hasTitle = isNonNullable(title) && title !== false && title !== ''

      return (
        <div class={clsx({ [`${prefixCls}-with-icon`]: iconNode })} role={role}>
          {iconNode}
          {hasTitle && (
            <div class={clsx(`${prefixCls}-title`, pureContentCls.title)} style={styles.title}>
              {title}
            </div>
          )}
          {description && (
            <div
              class={clsx(`${prefixCls}-description`, pureContentCls.description)}
              style={styles.description}
            >
              {description}
            </div>
          )}
          {actions && (
            <div
              class={clsx(`${prefixCls}-actions`, pureContentCls.actions)}
              style={styles.actions}
            >
              {actions}
            </div>
          )}
        </div>
      )
    }
  },
  {
    name: 'NoticePureContent',
    inheritAttrs: false,
  },
)

export interface PurePanelProps extends
  // Omit<NoticeConfig, 'prefixCls' | 'eventKey' | 'classNames' | 'styles' | 'className' | 'style'>,
  Omit<PureContentProps, 'prefixCls' | 'children' | 'classes' | 'styles'> {
  content?: VueNode
  duration?: number | false | null
  showProgress?: boolean
  pauseOnHover?: boolean
  closable?:
    | boolean
    | ({ closeIcon?: VueNode, onClose?: VoidFunction } & Record<string, any>)
  prefixCls?: string
  classes?: PurePanelClassNamesType
  styles?: PurePanelStylesType
  closeIcon?: VueNode
  props?: Record<string, any>
  onClose?: VoidFunction
  onClick?: (event: Event) => void
}

const omitKeys = [
  'prefixCls',
  'icon',
  'type',
  'message',
  'title',
  'description',
  'btn',
  'actions',
  'closeIcon',
  'className',
  'style',
  'styles',
  'classNames',
  'closable',
]

/** @private Internal Component. Do not use in your production. */
const PurePanel = defineComponent<PurePanelProps>(
  (props, { attrs, slots }) => {
    const { classes: notificationClassNames, styles } = toPropsRefs(props, 'classes', 'styles')
    const {
      getPrefixCls,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('notification', props)
    const { notification: notificationContext } = useBaseConfig('notification', props)
    const prefixCls = computed(() => props.prefixCls ?? getPrefixCls('notification'))

    const mergedProps = computed(() => props)

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      PurePanelClassNamesType,
      PurePanelStylesType,
      PurePanelProps
    >(
      useToArr(contextClassNames, notificationClassNames),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )
    const closeableInfo = useClosable(
      pickClosable(computed(() => props) as unknown as any) as any,
      pickClosable(notificationContext as any) as any,
      computed(() => {
        return {
          closable: true,
          closeIcon: <CloseOutlined class={`${prefixCls.value}-close-icon`} />,
          closeIconRender: (icon: any) => getCloseIcon(prefixCls.value, icon as any),
        } as any
      }),
    )
    const rawClosable = computed(() => closeableInfo.value?.[0])
    const mergedCloseIcon = computed(() => closeableInfo.value?.[1])
    const ariaProps = computed(() => closeableInfo.value?.[3] || {})
    const mergedClosable = computed(() => {
      const { closable } = props
      return rawClosable.value
        ? {
            onClose: closable && typeof closable === 'object' ? closable?.onClose : undefined,
            closeIcon: mergedCloseIcon.value,
            ...ariaProps.value,
          }
        : false
    })
    return () => {
      const noticePrefixCls = `${prefixCls.value}-notice`
      const notificationClassName = (attrs as any).class
      const style = (attrs as any).style
      const restProps = omit(props, omitKeys as any)
      // slot > prop > null
      const actions = getSlotPropsFnRun(slots, props, 'actions')
      const titleNode = getSlotPropsFnRun(slots, props, 'title')
      const descriptionNode = getSlotPropsFnRun(slots, props, 'description')
      const slotIcon = getSlotPropsFnRun(slots, props, 'icon')
      const mergedNcs = mergedClassNames.value as PureContentProps['classes']
      const mergedNss = mergedStyles.value as PureContentProps['styles']
      const iconNode = resolveIconNode(slotIcon ?? props.icon, props.type)
      const iconWrapperClass = clsx(getIconWrapperClassName(noticePrefixCls, props.type), mergedNcs?.icon)
      return (
        <div
          class={clsx(
            `${noticePrefixCls}-pure-panel`,
            hashId.value,
            notificationClassName,
            cssVarCls.value,
            rootCls.value,
            mergedClassNames.value?.root,
          )}
          style={mergedStyles.value.root}
        >
          <PurePanelStyle prefixCls={prefixCls.value} />
          <Notification
            style={{
              ...contextStyle.value,
              ...style,
            }}
            {...pureAttrs(attrs)}
            {...restProps as any}
            prefixCls={prefixCls.value}
            duration={null}
            closable={mergedClosable.value}
            role={props.role}
            class={clsx(
              notificationClassName,
              contextClassName.value,
              { [`${noticePrefixCls}-with-icon`]: !!iconNode },
            )}
            icon={iconNode}
            title={titleNode}
            description={descriptionNode}
            actions={actions}
            classNames={{
              icon: iconWrapperClass,
              title: mergedNcs?.title,
              description: mergedNcs?.description,
              actions: mergedNcs?.actions,
            }}
            styles={{
              icon: mergedNss?.icon,
              title: mergedNss?.title,
              description: mergedNss?.description,
              actions: mergedNss?.actions,
            }}
          />
        </div>
      )
    }
  },
  {
    name: 'NoticePurePanel',
    inheritAttrs: false,
  },
)

export default PurePanel
