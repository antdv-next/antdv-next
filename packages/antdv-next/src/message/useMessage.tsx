import type { NotificationAPI, NotificationConfig as VcNotificationConfig } from '@v-c/notification'
import type { Key, MaybeRef } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type {
  ArgsClassNamesType,
  ArgsProps,
  ArgsStylesType,
  ConfigOptions,
  MessageInstance,
  MessageSemanticClassNames,
  MessageSemanticStyles,
  MessageType,
  NoticeType,
  TypeOpen,
} from './interface'
import type { PureContentProps } from './PurePanel'
import { useNotificationProvider, useNotification as useVcNotification } from '@v-c/notification'
import { clsx } from '@v-c/util'
import { computed, defineComponent, shallowRef, unref } from 'vue'
import { mergeClassNames, mergeStyles, resolveStyleOrClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning } from '../_util/warning'
import { useBaseConfig, useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { PureContent } from './PurePanel'
import useStyle from './style'
import { getMotion, wrapPromiseFn } from './util'

const DEFAULT_OFFSET = 8
const DEFAULT_DURATION = 3

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = ConfigOptions & {
  onAllRemoved?: VoidFunction
}

interface HolderRef extends NotificationAPI {
  prefixCls: string
  contextClassName?: string
  contextStyle?: CSSProperties
  contextClasses?: ArgsClassNamesType
  contextStyles?: ArgsStylesType
  classNames?: MessageSemanticClassNames
  styles?: MessageSemanticStyles
}

const Wrapper = defineComponent<{ prefixCls: string }>(
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
    }) as unknown as any)

    return () => slots.default?.()
  },
)

const renderNotifications: VcNotificationConfig['renderNotifications'] = (node, { prefixCls, key }) => {
  return (
    <Wrapper prefixCls={prefixCls} key={key}>
      {node}
    </Wrapper>
  )
}

const Holder = defineComponent<HolderProps>(
  (props, { expose }) => {
    const { getPrefixCls, direction, getPopupContainer } = useBaseConfig('message')
    const {
      class: contextClassName,
      style: contextStyle,
      classes: contextClasses,
      styles: contextStyles,
    } = useComponentBaseConfig('message', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const prefixCls = computed(() => props.prefixCls ?? getPrefixCls('message'))
    const mergedTop = computed(() => {
      if (typeof props.top === 'number') {
        return `${props.top}px`
      }
      if (typeof props.top === 'string') {
        return props.top
      }
      return `${DEFAULT_OFFSET}px`
    })
    const mergedDuration = computed(() => props.duration ?? DEFAULT_DURATION)
    const mergedPauseOnHover = computed(() => (props.pauseOnHover === undefined ? true : props.pauseOnHover))

    const getStyle = () => ({
      left: '50%',
      transform: 'translateX(-50%)',
      top: mergedTop.value,
    })

    const getClassName = () => clsx({
      [`${prefixCls.value}-rtl`]: props.rtl ?? direction.value === 'rtl',
    })

    const getNotificationMotion = () => getMotion(prefixCls.value, props.transitionName)

    const [api, holder] = useVcNotification({
      prefixCls: prefixCls.value,
      style: getStyle,
      className: getClassName,
      motion: getNotificationMotion,
      closable: false,
      duration: mergedDuration.value,
      getContainer: () => props.getContainer?.() || getPopupContainer?.() || document.body,
      maxCount: props.maxCount,
      onAllRemoved: props.onAllRemoved,
      renderNotifications,
      pauseOnHover: mergedPauseOnHover.value,
    })

    const mergedProps = computed(() => props)
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ArgsClassNamesType,
      ArgsStylesType,
      HolderProps
    >(
      useToArr(classes, contextClasses),
      useToArr(styles, contextStyles),
      useToProps(mergedProps),
    )

    expose({
      ...api,
      prefixCls,
      contextClassName,
      contextStyle,
      contextClasses,
      contextStyles,
      classNames: mergedClassNames,
      styles: mergedStyles,
    })

    return () => holder?.() as any
  },
  {
    name: 'MessageHolder',
    inheritAttrs: false,
  },
)

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0

export function useInternalMessage(messageConfig?: MaybeRef<HolderProps>) {
  const holderRef = shallowRef<HolderRef>()
  const warning = devUseWarning('Message')

  const wrapAPI = (): MessageInstance => {
    const close = (key: Key) => {
      holderRef.value?.close(key)
    }

    const open = (config: ArgsProps): MessageType => {
      if (!holderRef.value) {
        warning(
          false,
          'usage',
          'You are calling notice in render which will break in concurrent mode. Please trigger in effect instead.',
        )
        const fakeResult: any = () => {}
        fakeResult.then = () => {}
        return fakeResult
      }

      const {
        open: originOpen,
        prefixCls,
        contextClassName,
        contextStyle,
        contextClasses,
        contextStyles,
        classNames: originClassNames,
        styles: originStyles,
      } = holderRef.value

      const noticePrefixCls = `${prefixCls}-notice`

      const {
        content,
        icon,
        type,
        key,
        class: className,
        style,
        onClose,
        classes: configClassNames = {},
        styles = {},
        ...restConfig
      } = config

      let mergedKey: Key | undefined = key
      if (mergedKey === undefined || mergedKey === null) {
        keyIndex += 1
        mergedKey = `antd-message-${keyIndex}`
      }

      const contextConfig = { ...messageConfig, ...config }

      const resolvedContextClassNames = resolveStyleOrClass(contextClasses!, { props: contextConfig })
      const semanticClassNames = resolveStyleOrClass(configClassNames, { props: contextConfig })
      const resolvedContextStyles = resolveStyleOrClass(contextStyles!, { props: contextConfig })
      const semanticStyles = resolveStyleOrClass(styles, { props: contextConfig })

      const mergedClassNames = mergeClassNames(
        undefined,
        resolvedContextClassNames,
        semanticClassNames,
        originClassNames,
      )

      const mergedStyles = mergeStyles(
        resolvedContextStyles,
        semanticStyles,
        originStyles,
      )

      return wrapPromiseFn((resolve) => {
        originOpen({
          ...restConfig as any,
          key: mergedKey!,
          placement: 'top',
          content: (
            <PureContent
              prefixCls={prefixCls}
              type={type}
              icon={icon}
              classNames={mergedClassNames as PureContentProps['classNames']}
              styles={mergedStyles as PureContentProps['styles']}
            >
              {content}
            </PureContent>
          ),
          className: clsx(
            { [`${noticePrefixCls}-${type}`]: !!type },
            className,
            contextClassName,
            mergedClassNames.root,
          ),
          style: {
            ...mergedStyles.root,
            ...contextStyle,
            ...style,
          },
          onClose: () => {
            onClose?.()
            resolve()
          },
        })
        return () => {
          close(mergedKey!)
        }
      })
    }

    const destroy = (key?: Key) => {
      if (key !== undefined) {
        close(key)
      }
      else {
        holderRef.value?.destroy()
      }
    }

    const instance = {
      open,
      destroy,
    } as MessageInstance

    const types: NoticeType[] = ['info', 'success', 'warning', 'error', 'loading']

    types.forEach((type) => {
      const typeOpen: TypeOpen = (jointContent, duration, onClose) => {
        let config: ArgsProps

        if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
          config = jointContent
        }
        else {
          config = { content: jointContent }
        }

        let mergedDuration: number | undefined
        let mergedOnClose: VoidFunction | undefined
        if (typeof duration === 'function') {
          mergedOnClose = duration
        }
        else {
          mergedDuration = duration
          mergedOnClose = onClose
        }

        return open({
          onClose: mergedOnClose,
          duration: mergedDuration,
          ...config,
          type,
        })
      }

      instance[type] = typeOpen
    })

    return instance
  }

  const holderContext = () => <Holder key="message-holder" {...unref(messageConfig)} ref={holderRef as any} />

  return [wrapAPI(), holderContext] as const
}

export default function useMessage(messageConfig?: ConfigOptions) {
  return useInternalMessage(messageConfig)
}
