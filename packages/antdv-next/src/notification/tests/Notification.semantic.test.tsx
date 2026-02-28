import type { NotificationInstance } from '../interface'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useNotification } from '..'
import ConfigProvider from '../../config-provider'
import PurePanel from '../PurePanel'
import { mount } from '/@tests/utils'

async function waitForNotification() {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('notification.semantic', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ========================= PurePanel semantic =========================
  describe('purePanel', () => {
    it('should support classNames and styles as objects', () => {
      const wrapper = mount(PurePanel, {
        props: {
          type: 'info',
          title: 'Semantic Test',
          description: 'Desc',
          classes: {
            root: 'custom-root',
            title: 'custom-title',
            description: 'custom-desc',
            icon: 'custom-icon',
          },
          styles: {
            root: { margin: '10px' },
            title: { fontWeight: 'bold' },
            description: { color: 'gray' },
            icon: { fontSize: '20px' },
          },
        } as any,
        attachTo: document.body,
      })

      // root
      const root = document.querySelector('.ant-notification-notice-pure-panel')
      expect(root?.classList.contains('custom-root')).toBe(true)
      expect((root as HTMLElement)?.style.margin).toBe('10px')

      // title
      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.classList.contains('custom-title')).toBe(true)
      expect((title as HTMLElement)?.style.fontWeight).toBe('bold')

      // description
      const desc = document.querySelector('.ant-notification-notice-description')
      expect(desc?.classList.contains('custom-desc')).toBe(true)
      expect((desc as HTMLElement)?.style.color).toBe('gray')

      // icon
      const icon = document.querySelector('.ant-notification-notice-icon')
      expect(icon?.classList.contains('custom-icon')).toBe(true)
      expect((icon as HTMLElement)?.style.fontSize).toBe('20px')

      wrapper.unmount()
    })

    it('should support classNames as function', () => {
      const classesFn = vi.fn(() => ({
        root: 'fn-root',
        title: 'fn-title',
        icon: 'fn-icon',
      }))

      const wrapper = mount(PurePanel, {
        props: {
          type: 'success',
          title: 'Fn Test',
          description: 'Desc',
          classes: classesFn,
        } as any,
        attachTo: document.body,
      })

      expect(classesFn).toHaveBeenCalled()

      const root = document.querySelector('.ant-notification-notice-pure-panel')
      expect(root?.classList.contains('fn-root')).toBe(true)

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.classList.contains('fn-title')).toBe(true)

      const icon = document.querySelector('.ant-notification-notice-icon')
      expect(icon?.classList.contains('fn-icon')).toBe(true)

      wrapper.unmount()
    })

    it('should support styles as function', () => {
      const stylesFn = vi.fn(() => ({
        root: { padding: '5px' },
        title: { color: 'blue' },
      }))

      const wrapper = mount(PurePanel, {
        props: {
          type: 'warning',
          title: 'Styles Fn',
          styles: stylesFn,
        } as any,
        attachTo: document.body,
      })

      expect(stylesFn).toHaveBeenCalled()

      const root = document.querySelector('.ant-notification-notice-pure-panel')
      expect((root as HTMLElement)?.style.padding).toBe('5px')

      const title = document.querySelector('.ant-notification-notice-title')
      expect((title as HTMLElement)?.style.color).toBe('blue')

      wrapper.unmount()
    })

    it('should support actions semantic', () => {
      const wrapper = mount(PurePanel, {
        props: {
          type: 'info',
          title: 'With Actions',
          actions: <button>Act</button>,
          classes: {
            actions: 'custom-actions',
          },
          styles: {
            actions: { background: 'yellow' },
          },
        } as any,
        attachTo: document.body,
      })

      const actions = document.querySelector('.ant-notification-notice-actions')
      expect(actions?.classList.contains('custom-actions')).toBe(true)
      expect((actions as HTMLElement)?.style.background).toBe('yellow')

      wrapper.unmount()
    })
  })

  // ========================= ConfigProvider semantic merging =========================
  describe('configProvider merging', () => {
    it('should merge classNames from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider notification={{
              class: 'provider-cls',
              classes: { root: 'provider-root', title: 'provider-title', icon: 'provider-icon' },
              styles: { root: { color: 'blue' } },
            }}
            >
              <PurePanel
                type="info"
                title="Merge Test"
                description="Desc"
                classes={{ root: 'comp-root' }}
              />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-notification-notice-pure-panel')
      expect(root?.classList.contains('provider-root')).toBe(true)
      expect(root?.classList.contains('comp-root')).toBe(true)
      expect((root as HTMLElement)?.style.color).toBe('blue')

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.classList.contains('provider-title')).toBe(true)

      const icon = document.querySelector('.ant-notification-notice-icon')
      expect(icon?.classList.contains('provider-icon')).toBe(true)

      // Notice element should have provider class
      const notice = document.querySelector('.ant-notification-notice')
      expect(notice?.classList.contains('provider-cls')).toBe(true)

      wrapper.unmount()
    })

    it('should merge styles from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider notification={{
              styles: { root: { padding: '10px' }, description: { color: 'green' } },
            }}
            >
              <PurePanel
                type="info"
                title="Style Merge"
                description="Desc"
                styles={{ root: { margin: '5px' } }}
              />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const root = document.querySelector('.ant-notification-notice-pure-panel')
      expect((root as HTMLElement)?.style.padding).toBe('10px')
      expect((root as HTMLElement)?.style.margin).toBe('5px')

      const desc = document.querySelector('.ant-notification-notice-description')
      expect((desc as HTMLElement)?.style.color).toBe('green')

      wrapper.unmount()
    })

    it('component classes take priority over ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider notification={{
              classes: { title: 'provider-title' },
            }}
            >
              <PurePanel
                type="info"
                title="Priority Test"
                classes={{ title: 'comp-title' }}
              />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })

      const title = document.querySelector('.ant-notification-notice-title')
      // Both should be present (merged)
      expect(title?.classList.contains('provider-title')).toBe(true)
      expect(title?.classList.contains('comp-title')).toBe(true)

      wrapper.unmount()
    })
  })

  // ========================= useNotification semantic =========================
  describe('useNotification semantic', () => {
    it('supports classes and styles via open config', async () => {
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification()
          api = notificationApi
          return () => contextHolder()
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'Semantic via API',
        description: 'Desc',
        type: 'info',
        classes: {
          root: 'api-root',
          title: 'api-title',
          description: 'api-desc',
          icon: 'api-icon',
        },
        styles: {
          root: { margin: '8px' },
          title: { color: 'navy' },
        },
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice?.classList.contains('api-root')).toBe(true)
      expect((notice as HTMLElement)?.style.margin).toBe('8px')

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.classList.contains('api-title')).toBe(true)
      expect((title as HTMLElement)?.style.color).toBe('navy')

      const desc = document.querySelector('.ant-notification-notice-description')
      expect(desc?.classList.contains('api-desc')).toBe(true)

      const icon = document.querySelector('.ant-notification-notice-icon')
      expect(icon?.classList.contains('api-icon')).toBe(true)

      wrapper.unmount()
    })

    it('applies open config classes to notification', async () => {
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification()
          api = notificationApi
          return () => contextHolder()
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'Open Classes',
        classes: { root: 'open-root', title: 'open-title' },
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice?.classList.contains('open-root')).toBe(true)

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.classList.contains('open-title')).toBe(true)

      wrapper.unmount()
    })

    it('merges semantic from useNotification config and open config', async () => {
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification({
            classes: { root: 'hook-root', icon: 'hook-icon' },
          })
          api = notificationApi
          return () => contextHolder()
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'Merge Hook & Open',
        type: 'info',
        classes: { root: 'open-root' },
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      // Both hook-level and open-level classes should be merged
      expect(notice?.classList.contains('hook-root')).toBe(true)
      expect(notice?.classList.contains('open-root')).toBe(true)

      const icon = document.querySelector('.ant-notification-notice-icon')
      expect(icon?.classList.contains('hook-icon')).toBe(true)

      wrapper.unmount()
    })
  })
})
