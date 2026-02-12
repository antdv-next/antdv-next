import type { App as AppVue } from 'vue'
import type { ComponentBaseProps } from '../config-provider/context'
import type { AppConfig } from './context'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { computed, defineComponent, Fragment } from 'vue'
import { devUseWarning } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useMessage } from '../message'
import { useModal } from '../modal'
import { useNotification } from '../notification'
import { AppConfigProvider, useAppConfig, useAppContextProvider } from './context'
import useStyle from './style'

export interface AppProps extends ComponentBaseProps, AppConfig {
  component?: any
}

const App = defineComponent<AppProps>(
  (props, { slots, attrs }) => {
    const {
      direction,
      prefixCls,
      class: contextClassName,
      style: contextStyle,
    } = useComponentBaseConfig('app', props)
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const appConfig = useAppConfig()

    const mergedAppConfig = computed(() => {
      return {
        message: { ...appConfig.message, ...props?.message },
        notification: { ...appConfig.notification, ...props?.notification },
      }
    })

    const [messageApi, MessageContextHolder] = useMessage(computed(() => mergedAppConfig?.value?.message) as any)

    const [notificationApi, NotificationContextHolder] = useNotification(computed(() => mergedAppConfig?.value?.notification) as any)
    const [ModalApi, ModalContextHolder] = useModal()

    useAppContextProvider({
      message: messageApi,
      notification: notificationApi,
      modal: ModalApi,
    })

    return () => {
      const { rootClass } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const customClassName = clsx(
        hashId.value,
        prefixCls.value,
        className,
        rootClass,
        cssVarCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
      )
      const { component = 'div' } = props

      // https://github.com/ant-design/ant-design/issues/48802#issuecomment-2097813526
      devUseWarning('App')(
        !(cssVarCls.value && component === false),
        'usage',
        'When using cssVar, ensure `component` is assigned a valid Vue component string.',
      )
      // ============================ Render ============================
      const Component = component === false ? Fragment : component
      const rootProps = {
        ...restAttrs,
        class: clsx(contextClassName, customClassName),
        style: { ...contextStyle, ...style },
      }
      return (
        <AppConfigProvider {...mergedAppConfig.value}>
          <Component {...(component === false ? undefined : rootProps)}>
            <MessageContextHolder />
            <NotificationContextHolder />
            <ModalContextHolder />
            { slots?.default?.()}
          </Component>
        </AppConfigProvider>
      )
    }
  },
  {
    name: 'AApp',
    inheritAttrs: false,
  },
)

;(App as any).install = (app: AppVue) => {
  app.component(App.name, App)
}

export default App
