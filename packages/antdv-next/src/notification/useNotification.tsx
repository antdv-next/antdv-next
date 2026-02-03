import type { NotificationAPI, NotificationConfig as VcNotificationConfig } from '@v-c/notification'
import type { Key, MaybeRef } from '@v-c/util/dist/type'
import type { NotificationConfig as CPNotificationConfig } from '../config-provider/context'
import type {
  ArgsProps,
  NotificationClassNamesType,
  NotificationConfig,
  NotificationInstance,
  NotificationPlacement,
  NotificationSemanticClassNames,
  NotificationSemanticStyles,
  NotificationStylesType,
} from './interface'
import type { PureContentProps } from './PurePanel.tsx'
import { useNotificationProvider, useNotification as useVcNotification } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { computed, defineComponent, shallowRef, unref } from 'vue'
import { mergeClassNames, mergeStyles, resolveStyleOrClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { computeClosable, pickClosable } from '../_util/hooks/useClosable.tsx'
import { toPropsRefs } from '../_util/tools.ts'
import { devUseWarning } from '../_util/warning.ts'
import { useBaseConfig, useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useToken } from '../theme/internal.ts'
import { getCloseIcon, PureContent } from './PurePanel.tsx'
import useStyle from './style'
import { getCloseIconConfig, getMotion, getPlacementStyle } from './util.ts'

const DEFAULT_OFFSET = 24
const DEFAULT_DURATION = 4.5
const DEFAULT_PLACEMENT: NotificationPlacement = 'topRight'

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = NotificationConfig & {
  onAllRemoved?: VoidFunction
}

interface HolderRef extends NotificationAPI {
  prefixCls: string
  notification?: CPNotificationConfig
  classNames: NotificationSemanticClassNames
  styles: NotificationSemanticStyles
}

const Wrapper = defineComponent<{
  prefixCls: string
}>(
  (props, { slots }) => {
    const prefixCls = computed(() => props.prefixCls)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    useNotificationProvider(computed(() => {
      return {
        classNames: {
          list: clsx(hashId.value, cssVarCls.value, rootCls.value),
        },
      }
    }) as any)
    return () => {
      return slots?.default?.()
    }
  },
)

const renderNotifications: VcNotificationConfig['renderNotifications'] = (node, { prefixCls, key }) => {
  return (
    <Wrapper prefixCls={prefixCls} key={key}>
      {node}
    </Wrapper>
  )
}

const holderDefaultProps = {
  duration: DEFAULT_DURATION,
  pauseOnHover: true,
} as any

const Holder = defineComponent<HolderProps>(
  (props = holderDefaultProps, { expose }) => {
    const { getPrefixCls, getPopupContainer, notification, direction } = useBaseConfig('notification')

    const { classes: contextClassNames, styles: contextStyles } = useComponentBaseConfig('notification', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const [,token] = useToken()
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'))
    const mergedDuration = computed(() => {
      return typeof props.duration === 'number' && props.duration > 0 ? props.duration : false
    })
    // =============================== Style ===============================
    const getStyle = (placement: NotificationPlacement) => {
      return getPlacementStyle(placement, props?.top ?? DEFAULT_OFFSET, props?.bottom ?? DEFAULT_DURATION)
    }
    const getClassName = () => clsx({
      [`${prefixCls.value}-rtl`]: props.rtl ?? direction.value === 'rtl',
    })

    // ============================== Motion ===============================
    const getNotificationMotion = () => getMotion(prefixCls.value)

    // ============================== Origin ===============================
    const vcConfig = computed(() => ({
      prefixCls: prefixCls.value,
      style: getStyle,
      className: getClassName,
      motion: getNotificationMotion,
      closable: { closeIcon: getCloseIcon(prefixCls.value) },
      duration: mergedDuration.value,
      getContainer: () => props?.getContainer?.() || getPopupContainer?.() || document.body,
      maxCount: props?.maxCount,
      pauseOnHover: props?.pauseOnHover,
      showProgress: props?.showProgress,
      onAllRemoved: props.onAllRemoved,
      renderNotifications,
      stack: props.stack === false
        ? false
        : {
            threshold: typeof props.stack === 'object' ? props.stack.threshold : undefined,
            offset: 8,
            gap: token.value?.margin,
          },

    }))
    const [api, holder] = useVcNotification(vcConfig as any)

    const mergedProps = computed(() => props)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      NotificationClassNamesType,
      NotificationStylesType,
      HolderProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ================================ Ref ================================
    expose({
      ...api,
      prefixCls,
      notification,
      classes: mergedClassNames,
      styles: mergedStyles,
    })
    return () => {
      return holder?.() as any
    }
  },
  {
    name: 'NotificationHolder',
    inheritAttrs: false,
  },
)

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(
  notificationConfig?: MaybeRef<HolderProps>,
) {
  const holderRef = shallowRef<HolderRef>()
  const warning = devUseWarning('Notification')

  const { notification: notificationContext } = useBaseConfig('notification')
  // ================================ API ================================
  const wrapAPIFn = () => {
    // Wrap with notification content
    // >>> Open
    const open = (config: ArgsProps) => {
      if (!holderRef.value) {
        warning(
          false,
          'usage',
          'You are calling notice in render which will break in React 18 concurrent mode. Please trigger in effect instead.',
        )
        return
      }
      const {
        open: originOpen,
        prefixCls,
        notification,
        classNames: originClassNames,
        styles: originStyles,
      } = holderRef.value
      const contextClassName = notification?.class || {}
      const contextStyle = notification?.style || {}
      const noticePrefixCls = `${prefixCls}-notice`

      const {
        title,
        description,
        icon,
        type,
        actions,
        class: className,
        style,
        role = 'alert',
        closeIcon,
        closable,
        classes: configClassNames = {},
        styles = {},
        ...restConfig
      } = config
      const mergedTitle = title
      const mergedActions = actions

      const realCloseIcon = getCloseIcon(
        noticePrefixCls,
        getCloseIconConfig(closeIcon, unref(notificationConfig), notification),
      )

      const [rawClosable, mergedCloseIcon, , ariaProps] = computeClosable(
        pickClosable(computed(() => ({ ...(unref(notificationConfig) || {}), ...config }))) as any,
        pickClosable(notificationContext as any) as any,
        computed(() => ({
          closable: true,
          closeIcon: realCloseIcon,
        })),
      )

      const mergedClosable = rawClosable
        ? {
            onClose: closable && typeof closable === 'object' ? closable.onClose : undefined,
            closeIcon: mergedCloseIcon,
            ...ariaProps,
          }
        : false

      const semanticClassNames = resolveStyleOrClass(configClassNames, { props: config })
      const semanticStyles = resolveStyleOrClass(styles, { props: config })

      const mergedClassNames = mergeClassNames(
        undefined,
        originClassNames,
        semanticClassNames,
      )

      const mergedStyles = mergeStyles(
        originStyles,
        semanticStyles,
      )
      return originOpen({
        // use placement from props instead of hard-coding "topRight"
        placement: unref(notificationConfig)?.placement ?? DEFAULT_PLACEMENT,
        ...restConfig,
        content: (
          <PureContent
            prefixCls={noticePrefixCls}
            icon={icon}
            type={type}
            title={mergedTitle}
            description={description}
            actions={mergedActions}
            role={role}
            classes={mergedClassNames as PureContentProps['classes']}
            styles={mergedStyles as PureContentProps['styles']}
          />
        ),
        className: clsx(
          { [`${noticePrefixCls}-${type}`]: type },
          className,
          contextClassName,
          mergedClassNames.root,
        ),
        style: { ...contextStyle, ...mergedStyles.root, ...style } as any,
        closable: mergedClosable,
      })
    }

    // >>> destroy
    const destroy = (key?: Key) => {
      if (key !== undefined) {
        holderRef.value?.close(key)
      }
      else {
        holderRef.value?.destroy()
      }
    }
    const clone = {
      open,
      destroy,
    } as NotificationInstance

    const keys = ['success', 'info', 'warning', 'error'] as const

    keys.forEach((type) => {
      clone[type] = config => open({ ...config, type })
    })
    return clone
  }
  const holderContext = () => {
    return <Holder key="notificaion-holder" {...unref(notificationConfig)} ref={holderRef}></Holder>
  }
  // ============================== Return ===============================
  return [wrapAPIFn(), holderContext] as const
}

export default function useNotification(notificationConfig?: MaybeRef<NotificationConfig>) {
  return useInternalNotification(notificationConfig)
}
