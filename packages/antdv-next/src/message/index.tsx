import type { Key } from '@v-c/util/dist/type'
import type {
  ArgsProps,
  ConfigOptions,
  MessageInstance,
  MessageType,
  NoticeType,
  TypeOpen,
} from './interface'
import { createVNode, defineComponent, getCurrentInstance, onMounted, render, shallowRef, watch } from 'vue'
import { useAppConfig } from '../app/context.ts'
import { useBaseConfig } from '../config-provider/context.ts'
import ConfigProvider, { globalConfig } from '../config-provider/index.tsx'
import PurePanel from './PurePanel.tsx'
import useMessage, { useInternalMessage } from './useMessage.tsx'
import { wrapPromiseFn } from './util.ts'

export type { ArgsProps } from './interface'

interface GlobalMessage {
  fragment: DocumentFragment
  instance?: MessageInstance | null
  sync?: VoidFunction
}

interface GlobalHolderRef {
  instance: MessageInstance
  sync: () => void
}

interface OpenTask {
  type: 'open'
  config: ArgsProps
  resolve: VoidFunction
  setCloseFn: (closeFn: MessageType) => void
  skipped?: boolean
}

interface TypeTask {
  type: NoticeType
  args: Parameters<TypeOpen>
  resolve: VoidFunction
  setCloseFn: (closeFn: MessageType) => void
  skipped?: boolean
}

type Task
  = | OpenTask
    | TypeTask
    | {
      type: 'destroy'
      key?: Key
      skipped?: boolean
    }

let message: GlobalMessage | null = null
let taskQueue: Task[] = []
let defaultGlobalConfig: ConfigOptions = {}
let act: (callback: VoidFunction) => Promise<void> | void = callback => callback()

function getGlobalContext() {
  const { getContainer, duration, rtl, maxCount, top, pauseOnHover } = defaultGlobalConfig
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
    duration,
    rtl,
    maxCount,
    top,
    pauseOnHover,
    appContext,
  }
}

const GlobalHolder = defineComponent<{ messageConfig: ConfigOptions, sync: () => void }>(
  (props, { expose }) => {
    const { messageConfig, sync } = props
    const { getPrefixCls } = useBaseConfig()
    const prefixCls = defaultGlobalConfig.prefixCls || getPrefixCls('message')
    const appConfig = useAppConfig()
    const [api, holder] = useInternalMessage({
      ...messageConfig,
      prefixCls,
      ...(appConfig.message || {}),
    })

    onMounted(() => {
      sync?.()
    })

    const instance = {
      ...api,
    }

    Object.keys(instance).forEach((method) => {
      ;(instance as any)[method as keyof MessageInstance] = (...args: any[]) => {
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
    const messageConfig = shallowRef<ConfigOptions>(getGlobalContext())
    const holderRef = shallowRef<GlobalHolderRef>()
    const sync = () => {
      messageConfig.value = getGlobalContext()
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
          messageConfig={messageConfig.value}
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

function flushMessageQueue() {
  if (!message) {
    const holderFragment = document.createDocumentFragment()
    const newMessage: GlobalMessage = {
      fragment: holderFragment,
    }
    message = newMessage

    act(() => {
      const vnode = createVNode(GlobalHolderWrapper, {
        onReady: (node: GlobalHolderRef) => {
          Promise.resolve().then(() => {
            if (!newMessage.instance && node?.instance) {
              newMessage.instance = node.instance
              newMessage.sync = node.sync
              flushMessageQueue()
            }
          })
        },
      })

      const globalContext = getGlobalContext()
      if (globalContext.appContext) {
        vnode.appContext = globalContext.appContext
      }
      render(vnode, holderFragment as any)
    })
    return
  }

  if (!message.instance) {
    return
  }

  taskQueue.forEach((task) => {
    const { type, skipped } = task
    if (skipped) {
      return
    }

    switch (type) {
      case 'open':
        act(() => {
          const closeFn = message!.instance!.open({
            ...defaultGlobalConfig,
            ...task.config,
          })
          closeFn?.then(task.resolve)
          task.setCloseFn(closeFn)
        })
        break
      case 'destroy':
        act(() => {
          message?.instance!.destroy(task.key)
        })
        break
      default:
        act(() => {
          const closeFn = (message!.instance as any)[type](...task.args)
          closeFn?.then(task.resolve)
          task.setCloseFn(closeFn)
        })
    }
  })

  taskQueue = []
}

function setMessageGlobalConfig(config: ConfigOptions) {
  defaultGlobalConfig = {
    ...defaultGlobalConfig,
    ...config,
  }

  act(() => {
    message?.sync?.()
  })
}

function open(config: ArgsProps): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let closeFn: MessageType | undefined

    const task: OpenTask = {
      type: 'open',
      config,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn
      },
    }
    taskQueue.push(task)

    return () => {
      if (closeFn) {
        act(() => {
          closeFn?.()
        })
      }
      else {
        task.skipped = true
      }
    }
  })

  flushMessageQueue()

  return result
}

function typeOpen(type: NoticeType, args: Parameters<TypeOpen>): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let closeFn: MessageType | undefined

    const task: TypeTask = {
      type,
      args,
      resolve,
      setCloseFn: (fn) => {
        closeFn = fn
      },
    }

    taskQueue.push(task)

    return () => {
      if (closeFn) {
        act(() => {
          closeFn?.()
        })
      }
      else {
        task.skipped = true
      }
    }
  })

  flushMessageQueue()

  return result
}

function destroy(key?: Key) {
  taskQueue.push({ type: 'destroy', key })
  flushMessageQueue()
}

interface BaseMethods {
  open: (config: ArgsProps) => MessageType
  destroy: (key?: Key) => void
  config: (config: ConfigOptions) => void
  useMessage: typeof useMessage
  /** @private Internal Component. Do not use in your production. */
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel
}

interface MessageMethods {
  info: TypeOpen
  success: TypeOpen
  error: TypeOpen
  warning: TypeOpen
  loading: TypeOpen
}

const methods: (keyof MessageMethods)[] = ['success', 'info', 'warning', 'error', 'loading']

const baseStaticMethods: BaseMethods = {
  open,
  destroy,
  config: setMessageGlobalConfig,
  useMessage,
  _InternalPanelDoNotUseOrYouWillBeFired: PurePanel,
}

const staticMethods = baseStaticMethods as MessageMethods & BaseMethods

methods.forEach((type: keyof MessageMethods) => {
  staticMethods[type] = (...args: Parameters<TypeOpen>) => typeOpen(type, args)
})

function noop() {}

let _actWrapper: (wrapper: any) => void = noop
// @ts-expect-error this file is only for test
if (process.env.NODE_ENV === 'test') {
  _actWrapper = (wrapper) => {
    act = wrapper
  }
}
const actWrapper = _actWrapper
export { actWrapper }

let _actDestroy = noop
// @ts-expect-error this file is only for test
if (process.env.NODE_ENV === 'test') {
  _actDestroy = () => {
    message = null
  }
}
const actDestroy = _actDestroy
export { actDestroy }

export default staticMethods

export {
  useMessage,
}
