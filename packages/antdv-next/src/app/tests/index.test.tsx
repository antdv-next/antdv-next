import type { NotificationConfig } from '../../notification/interface'
import type { AppConfig } from '../context'
import { SmileOutlined } from '@antdv-next/icons'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, onMounted } from 'vue'
import App from '..'
import ConfigProvider from '../../config-provider'
import { useAppConfig } from '../context'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount, waitFakeTimer } from '/@tests/utils'

describe('app', () => {
  mountTest(App)
  rtlTest(App)

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.querySelectorAll('.ant-message, .ant-notification').forEach((node) => {
      node.parentNode?.removeChild(node)
    })
  })

  const cloneConfig = (config?: AppConfig): AppConfig | undefined => {
    if (!config) {
      return config
    }
    return {
      message: config.message ? { ...config.message } : undefined,
      notification: config.notification ? { ...config.notification } : undefined,
    }
  }

  it('single', () => {
    const MyPage = defineComponent(() => {
      const { message } = App.useApp()
      onMounted(() => {
        message.success('Good!')
      })
      return () => <div>Hello World</div>
    })

    const wrapper = mount(() => (
      <App>
        <MyPage />
      </App>
    ))

    expect(wrapper.text()).toContain('Hello World')
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('should work as message and notification config configured in app', async () => {
    let consumedConfig: AppConfig | undefined

    const Consumer = defineComponent(() => {
      const { message, notification } = App.useApp()
      consumedConfig = cloneConfig(useAppConfig())

      onMounted(() => {
        message.success('Message 1')
        message.success('Message 2')
        notification.success({ title: 'Notification 1' })
        notification.success({ title: 'Notification 2' })
        notification.success({ title: 'Notification 3' })
      })

      return () => <div />
    })

    const wrapper = mount(
      () => (
        <App message={{ maxCount: 1 }} notification={{ maxCount: 2 }}>
          <Consumer />
        </App>
      ),
      { attachTo: document.body },
    )

    await waitFakeTimer(1, 1)

    expect(consumedConfig?.message).toStrictEqual({ maxCount: 1 })
    expect(consumedConfig?.notification).toStrictEqual({ maxCount: 2 })

    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(1)
    expect(document.querySelectorAll('.ant-notification-notice')).toHaveLength(2)
    wrapper.unmount()
  })

  it('should be a merged config configured in nested app', () => {
    let offsetConsumedConfig: AppConfig | undefined
    let maxCountConsumedConfig: AppConfig | undefined

    const OffsetConsumer = defineComponent(() => {
      offsetConsumedConfig = cloneConfig(useAppConfig())
      return () => <div />
    })

    const MaxCountConsumer = defineComponent(() => {
      maxCountConsumedConfig = cloneConfig(useAppConfig())
      return () => <div />
    })

    const wrapper = mount(() => (
      <App message={{ maxCount: 1 }} notification={{ maxCount: 2 }}>
        <App message={{ top: 32 }} notification={{ top: 96 }}>
          <OffsetConsumer />
        </App>
        <MaxCountConsumer />
      </App>
    ))

    expect(offsetConsumedConfig?.message).toStrictEqual({ maxCount: 1, top: 32 })
    expect(offsetConsumedConfig?.notification).toStrictEqual({ maxCount: 2, top: 96 })
    expect(maxCountConsumedConfig?.message).toStrictEqual({ maxCount: 1 })
    expect(maxCountConsumedConfig?.notification).toStrictEqual({ maxCount: 2 })
    wrapper.unmount()
  })

  it('should respect config from props in priority', () => {
    let consumedConfig: AppConfig | undefined

    const Consumer = defineComponent(() => {
      consumedConfig = cloneConfig(useAppConfig())
      return () => <div />
    })

    const wrapper = mount(() => (
      <App message={{ maxCount: 10, top: 20 }} notification={{ maxCount: 30, bottom: 40 }}>
        <App message={{ maxCount: 11 }} notification={{ bottom: 41 }}>
          <Consumer />
        </App>
      </App>
    ))

    expect(consumedConfig?.message).toStrictEqual({ maxCount: 11, top: 20 })
    expect(consumedConfig?.notification).toStrictEqual({ maxCount: 30, bottom: 41 })
    wrapper.unmount()
  })

  it('should respect notification placement config from props in priority', async () => {
    let consumedConfig: AppConfig | undefined

    const Consumer = defineComponent(() => {
      const { notification } = App.useApp()
      consumedConfig = cloneConfig(useAppConfig())

      onMounted(() => {
        notification.success({ title: 'Notification 1' })
        notification.success({ title: 'Notification 2' })
        notification.success({ title: 'Notification 3' })
      })

      return () => <div />
    })

    const config: NotificationConfig = {
      placement: 'bottomLeft',
      top: 100,
      bottom: 50,
    }

    const wrapper = mount(
      () => (
        <App notification={config}>
          <Consumer />
        </App>
      ),
      { attachTo: document.body },
    )

    await waitFakeTimer(1, 1)

    expect(consumedConfig?.notification).toStrictEqual(config)
    expect(document.querySelector('.ant-notification-topRight')).toBeNull()
    expect(document.querySelector('.ant-notification-bottomLeft')).toHaveStyle({
      top: 'auto',
      left: '0px',
      bottom: '50px',
    })
    wrapper.unmount()
  })

  it('support className', () => {
    const wrapper = mount(() => (
      <App class="test-class">
        <div>test</div>
      </App>
    ))

    expect(wrapper.find('.ant-app').classes()).toContain('test-class')
    wrapper.unmount()
  })

  it('support style', () => {
    const wrapper = mount(() => (
      <App style={{ color: 'blue' }}>
        <div>test</div>
      </App>
    ))

    expect(wrapper.element.querySelector('.ant-app')).toHaveStyle({ color: 'rgb(0, 0, 255)' })
    wrapper.unmount()
  })

  describe('restIcon style', () => {
    beforeEach(() => {
      Array.from(document.querySelectorAll('style')).forEach((style) => {
        style.parentNode?.removeChild(style)
      })
    })

    it('should work by default', () => {
      const wrapper = mount(() => (
        <App>
          <SmileOutlined />
        </App>
      ))

      expect(wrapper.find('.anticon').exists()).toBe(true)
      const dynamicStyles = Array.from(document.querySelectorAll('style[data-css-hash]'))
      const regex = /\.anticon\s*\{[^}]*\}/
      expect(
        dynamicStyles.some((style) => {
          return regex.test(style.innerHTML)
        }),
      ).toBe(true)
      wrapper.unmount()
    })
  })

  describe('component', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    afterEach(() => {
      errorSpy.mockReset()
    })

    afterAll(() => {
      errorSpy.mockRestore()
    })

    it('replace', () => {
      const wrapper = mount(() => (
        <App component="section">
          <p />
        </App>
      ))

      expect(wrapper.find('section.ant-app').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should warn if component is false and cssVarCls is not empty', () => {
      const wrapper = mount(() => (
        <ConfigProvider>
          <App component={false} />
        </ConfigProvider>
      ))

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: [antd: App] When using cssVar, ensure `component` is assigned a valid React component string.',
      )
      wrapper.unmount()
    })
  })
})
