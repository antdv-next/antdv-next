import type { Key } from '@v-c/util/dist/type'
import type { ArgsProps, GlobalConfigProps, NotificationInstance } from './interface'
import { createVNode, defineComponent, getCurrentInstance, onMounted, render, shallowRef, watch } from 'vue'
import { useAppConfig } from '../app/context.ts'
import { useBaseConfig } from '../config-provider/context.ts'
import ConfigProvider, { globalConfig } from '../config-provider/index.tsx'
import PurePanel from './PurePanel.tsx'
import useNotification, { useInternalNotification } from './useNotification'

export type { ArgsProps }

interface GlobalNotification {
  fragment: DocumentFragment
  instance?: NotificationInstance | null
  sync?: VoidFunction
}

interface GlobalHolderRef {
  instance: NotificationInstance
  sync: () => void
}

type Task
  = | {
    type: 'open'
    config: ArgsProps
  }
  | {
    type: 'destroy'
    key?: Key
  }

let notification: GlobalNotification | null = null
let taskQueue: Task[] = []
let defaultGlobalConfig: GlobalConfigProps = {}
let act: (callback: VoidFunction) => Promise<void> | void = (callback: VoidFunction) => callback()

function getGlobalContext() {
  const { getContainer, rtl, maxCount, top, bottom, showProgress, pauseOnHover } = defaultGlobalConfig
  const mergedContainer = getContainer?.() || document.body

  let appContext = defaultGlobalConfig.appContext
  const instance = getCurrentInstance()
  if (instance && !appContext) {
    appContext = instance.appContext
  }
  else if (!appContext) {
    appContext = globalConfig().appContext
  }

  return {
    getContainer: () => mergedContainer,
    rtl,
    maxCount,
    top,
    bottom,
    showProgress,
    pauseOnHover,
    appContext,
  }
}

const GlobalHolder = defineComponent<{ notificationConfig: GlobalConfigProps, sync: () => void }>(
  (props, { expose }) => {
    const { notificationConfig, sync } = props
    const { getPrefixCls } = useBaseConfig()
    const prefixCls = defaultGlobalConfig?.prefixCls || getPrefixCls('notification')
    const appConfig = useAppConfig()
    const [api, holder] = useInternalNotification({
      ...notificationConfig,
      prefixCls,
      ...(appConfig.notification || {}),
    })

    onMounted(() => {
      sync?.()
    })

    const instance = {
      ...api,
    }

    Object.keys(instance).forEach((method) => {
      ;(instance as any)[method as keyof NotificationInstance] = (...args: any[]) => {
        sync()
        return (api as any)[method](...args)
      }
    })

    expose({
      instance,
      sync,
    })

    return () => {
      if (typeof holder === 'function') {
        return holder?.()
      }
      return holder as any
    }
  },
)

const GlobalHolderWrapper = defineComponent<{ onReady?: (holder: GlobalHolderRef) => void }>(
  (props) => {
    const notificationConfig = shallowRef<GlobalConfigProps>(getGlobalContext())
    const holderRef = shallowRef<GlobalHolderRef>()
    const sync = () => {
      notificationConfig.value = getGlobalContext()
    }

    onMounted(sync)

    let filled = false
    watch(
      () => holderRef.value,
      (holder) => {
        if (holder && !filled) {
          filled = true
          props.onReady?.({
            instance: holder.instance,
            sync,
          })
        }
      },
      { immediate: true },
    )
    const global = globalConfig()

    return () => {
      const holderNode = (
        <GlobalHolder
          ref={holderRef as any}
          sync={sync}
          notificationConfig={notificationConfig.value}
        />
      )
      const dom = global.holderRender ? global.holderRender(holderNode) : holderNode

      return (
        <ConfigProvider
          prefixCls={global.getRootPrefixCls()}
          iconPrefixCls={global.getIconPrefixCls()}
          theme={global.theme.value as any}
        >
          {dom}
        </ConfigProvider>
      )
    }
  },
)

function flushNotificationQueue() {
  if (!notification) {
    const holderFragment = document.createDocumentFragment()
    const newNotification: GlobalNotification = {
      fragment: holderFragment,
    }
    notification = newNotification

    act(() => {
      const vnode = createVNode(GlobalHolderWrapper, {
        onReady: (node: GlobalHolderRef) => {
          Promise.resolve().then(() => {
            if (!newNotification.instance && node?.instance) {
              newNotification.instance = node.instance
              newNotification.sync = node.sync
              flushNotificationQueue()
            }
          })
        },
      })
      const globalCtx = getGlobalContext()
      if (globalCtx.appContext) {
        vnode.appContext = globalCtx.appContext
      }
      render(vnode, holderFragment as any)
    })
    return
  }

  if (!notification.instance) {
    return
  }

  taskQueue.forEach((task) => {
    switch (task.type) {
      case 'open': {
        act(() => {
          notification?.instance?.open({
            ...defaultGlobalConfig,
            ...task.config,
          })
        })
        break
      }
      case 'destroy':
        act(() => {
          notification?.instance?.destroy(task.key)
        })
        break
    }
  })

  taskQueue = []
}

function setNotificationGlobalConfig(config: GlobalConfigProps) {
  defaultGlobalConfig = {
    ...defaultGlobalConfig,
    ...config,
  }

  act(() => {
    notification?.sync?.()
  })
}

function open(config: ArgsProps) {
  taskQueue.push({ type: 'open', config })
  flushNotificationQueue()
}

function destroy(key?: Key) {
  taskQueue.push({ type: 'destroy', key })
  flushNotificationQueue()
}

interface BaseMethods {
  open: (config: ArgsProps) => void
  destroy: (key?: Key) => void
  config: (config: GlobalConfigProps) => void
  useNotification: typeof useNotification
  /** @private Internal Component. Do not use in your production. */
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel
}

type StaticFn = (config: ArgsProps) => void

interface NoticeMethods {
  success: StaticFn
  info: StaticFn
  warning: StaticFn
  error: StaticFn
}

const methods: (keyof NoticeMethods)[] = ['success', 'info', 'warning', 'error']

const baseStaticMethods: BaseMethods = {
  open,
  destroy,
  config: setNotificationGlobalConfig,
  useNotification,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
}

const staticMethods = baseStaticMethods as NoticeMethods & BaseMethods

methods.forEach((type: keyof NoticeMethods) => {
  staticMethods[type] = config => open({ ...config, type })
})

function noop() {}

let _actWrapper: (wrapper: any) => void = noop
// @ts-expect-error this
if (process.env.NODE_ENV === 'test') {
  _actWrapper = (wrapper) => {
    act = wrapper
  }
}
const actWrapper = _actWrapper
export { actWrapper }

let _actDestroy = noop
// @ts-expect-error this
if (process.env.NODE_ENV === 'test') {
  _actDestroy = () => {
    notification = null
    taskQueue = []
  }
}
const actDestroy = _actDestroy
export { actDestroy }

export default staticMethods
export {
  useNotification,
}
