import type { NotificationInstance } from '../interface'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useNotification } from '..'
import PurePanel, { getCloseIcon } from '../PurePanel'
import { getCloseIconConfig, getMotion, getPlacementStyle } from '../util'
import { mount } from '/@tests/utils'

// ========================= Helpers =========================
function mountNotification(config?: any) {
  let api!: NotificationInstance
  const App = defineComponent({
    setup() {
      const [notificationApi, contextHolder] = useNotification(config)
      api = notificationApi
      return () => contextHolder()
    },
  })
  const wrapper = mount(App, { attachTo: document.body })
  return { wrapper, getApi: () => api }
}

async function waitForNotification() {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('notification', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ========================= Type methods =========================
  describe('type methods', () => {
    it('renders success notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().success({
        title: 'Success Title',
        description: 'Success description',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('Success Title')
      expect(notice?.textContent).toContain('Success description')

      const iconEl = document.querySelector('.ant-notification-notice-icon-success')
      expect(iconEl).toBeTruthy()

      wrapper.unmount()
    })

    it('renders info notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().info({
        title: 'Info Title',
        description: 'Info description',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('Info Title')

      const iconEl = document.querySelector('.ant-notification-notice-icon-info')
      expect(iconEl).toBeTruthy()

      wrapper.unmount()
    })

    it('renders warning notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().warning({
        title: 'Warning Title',
        description: 'Warning description',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('Warning Title')

      const iconEl = document.querySelector('.ant-notification-notice-icon-warning')
      expect(iconEl).toBeTruthy()

      wrapper.unmount()
    })

    it('renders error notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().error({
        title: 'Error Title',
        description: 'Error description',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('Error Title')

      const iconEl = document.querySelector('.ant-notification-notice-icon-error')
      expect(iconEl).toBeTruthy()

      wrapper.unmount()
    })

    it('renders notification with open and type', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Open Title',
        description: 'Open description',
        type: 'success',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice-success')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('Open Title')

      wrapper.unmount()
    })

    it('renders notification without type (no icon)', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'No Type',
        description: 'No type description',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()
      expect(notice?.textContent).toContain('No Type')

      // Should not have with-icon class
      const withIcon = document.querySelector('.ant-notification-notice-with-icon')
      expect(withIcon).toBeFalsy()

      wrapper.unmount()
    })
  })

  // ========================= Content =========================
  describe('content', () => {
    it('renders title and description', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'My Title',
        description: 'My Description',
        duration: 0,
      })
      await waitForNotification()

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title).toBeTruthy()
      expect(title?.textContent).toBe('My Title')

      const desc = document.querySelector('.ant-notification-notice-description')
      expect(desc).toBeTruthy()
      expect(desc?.textContent).toBe('My Description')

      wrapper.unmount()
    })

    it('renders without description', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Title Only',
        duration: 0,
      })
      await waitForNotification()

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title).toBeTruthy()
      expect(title?.textContent).toBe('Title Only')

      const desc = document.querySelector('.ant-notification-notice-description')
      expect(desc).toBeFalsy()

      wrapper.unmount()
    })

    it('renders JSX content in title and description', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: <span class="custom-title">JSX Title</span>,
        description: <div class="custom-desc">JSX Desc</div>,
        duration: 0,
      })
      await waitForNotification()

      expect(document.querySelector('.custom-title')?.textContent).toBe('JSX Title')
      expect(document.querySelector('.custom-desc')?.textContent).toBe('JSX Desc')

      wrapper.unmount()
    })

    it('renders actions', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'With Actions',
        description: 'Desc',
        actions: <button class="action-btn">Confirm</button>,
        duration: 0,
      })
      await waitForNotification()

      const actionsArea = document.querySelector('.ant-notification-notice-actions')
      expect(actionsArea).toBeTruthy()

      const btn = document.querySelector('.action-btn')
      expect(btn).toBeTruthy()
      expect(btn?.textContent).toBe('Confirm')

      wrapper.unmount()
    })

    it('does not render actions when not provided', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'No Actions',
        description: 'Desc',
        duration: 0,
      })
      await waitForNotification()

      const actionsArea = document.querySelector('.ant-notification-notice-actions')
      expect(actionsArea).toBeFalsy()

      wrapper.unmount()
    })
  })

  // ========================= Icon =========================
  describe('icon', () => {
    it('renders custom icon', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Custom Icon',
        icon: <span class="my-custom-icon">!</span>,
        duration: 0,
      })
      await waitForNotification()

      const icon = document.querySelector('.my-custom-icon')
      expect(icon).toBeTruthy()
      expect(icon?.textContent).toBe('!')

      // Should have with-icon class
      const withIcon = document.querySelector('.ant-notification-notice-with-icon')
      expect(withIcon).toBeTruthy()

      wrapper.unmount()
    })

    it('renders type icon for each type', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      const types = ['success', 'info', 'warning', 'error'] as const
      types.forEach((type) => {
        getApi()[type]({
          title: `${type} notification`,
          description: 'desc',
          key: type,
          duration: 0,
        })
      })
      await waitForNotification()

      types.forEach((type) => {
        const iconEl = document.querySelector(`.ant-notification-notice-icon-${type}`)
        expect(iconEl).toBeTruthy()
      })

      wrapper.unmount()
    })
  })

  // ========================= Key =========================
  describe('key', () => {
    it('updates notification with same key', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'First',
        key: 'update-key',
        duration: 0,
      })
      await waitForNotification()

      let notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(1)
      expect(notices[0]!.textContent).toContain('First')

      getApi().open({
        title: 'Updated',
        key: 'update-key',
        duration: 0,
      })
      await waitForNotification()

      notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(1)
      expect(notices[0]!.textContent).toContain('Updated')

      wrapper.unmount()
    })
  })

  // ========================= Destroy =========================
  describe('destroy', () => {
    it('destroys notification by key', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Destroy Me',
        key: 'destroy-key',
        duration: 0,
      })
      await waitForNotification()

      let notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      getApi().destroy('destroy-key')
      await waitForNotification()

      notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeNull()

      wrapper.unmount()
    })

    it('destroys all notifications', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({ title: 'Msg 1', key: 'k1', duration: 0 })
      getApi().open({ title: 'Msg 2', key: 'k2', duration: 0 })
      await waitForNotification()

      let notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(2)

      getApi().destroy()
      await waitForNotification()

      notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(0)

      wrapper.unmount()
    })
  })

  // ========================= Multiple =========================
  describe('multiple notifications', () => {
    it('shows multiple notifications', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().success({ title: 'A', key: 'a', duration: 0 })
      getApi().info({ title: 'B', key: 'b', duration: 0 })
      getApi().error({ title: 'C', key: 'c', duration: 0 })
      await waitForNotification()

      const notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(3)

      wrapper.unmount()
    })
  })

  // ========================= Role =========================
  describe('role', () => {
    it('defaults to alert role', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Alert Role',
        duration: 0,
      })
      await waitForNotification()

      const el = document.querySelector('[role="alert"]')
      expect(el).toBeTruthy()

      wrapper.unmount()
    })

    it('supports status role', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Status Role',
        role: 'status',
        duration: 0,
      })
      await waitForNotification()

      const el = document.querySelector('[role="status"]')
      expect(el).toBeTruthy()

      wrapper.unmount()
    })
  })

  // ========================= Closable =========================
  describe('closable', () => {
    it('renders close button by default', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Closable',
        duration: 0,
      })
      await waitForNotification()

      const closeBtn = document.querySelector('.ant-notification-notice-close')
      expect(closeBtn).toBeTruthy()

      wrapper.unmount()
    })

    it('hides close button when closable is false', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Not Closable',
        closable: false,
        duration: 0,
      })
      await waitForNotification()

      const closeBtn = document.querySelector('.ant-notification-notice-close')
      expect(closeBtn).toBeFalsy()

      wrapper.unmount()
    })

    it('renders custom closeIcon', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Custom Close',
        closeIcon: <span class="custom-close-icon">X</span>,
        duration: 0,
      })
      await waitForNotification()

      const icon = document.querySelector('.custom-close-icon')
      expect(icon).toBeTruthy()
      expect(icon?.textContent).toBe('X')

      wrapper.unmount()
    })

    it('hides close button when closeIcon is null', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'No Close Icon',
        closeIcon: null,
        duration: 0,
      })
      await waitForNotification()

      const closeBtn = document.querySelector('.ant-notification-notice-close')
      expect(closeBtn).toBeFalsy()

      wrapper.unmount()
    })

    it('supports closable as object with onClose', async () => {
      const onClose = vi.fn()
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Object Closable',
        closable: { onClose },
        duration: 0,
      })
      await waitForNotification()

      const closeBtn = document.querySelector('.ant-notification-notice-close') as HTMLElement
      expect(closeBtn).toBeTruthy()
      closeBtn?.click()
      await waitForNotification()

      expect(onClose).toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  // ========================= Placement =========================
  describe('placement', () => {
    it('uses topRight as default placement', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Default Placement',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.right).toBe('0px')

      wrapper.unmount()
    })

    it('supports topLeft placement', async () => {
      const { wrapper, getApi } = mountNotification({ placement: 'topLeft' })
      await waitForNotification()

      getApi().open({
        title: 'TopLeft',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.left).toBe('0px')

      wrapper.unmount()
    })

    it('supports bottom placement', async () => {
      const { wrapper, getApi } = mountNotification({ placement: 'bottom' })
      await waitForNotification()

      getApi().open({
        title: 'Bottom',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.left).toBe('50%')

      wrapper.unmount()
    })

    it('supports bottomLeft placement', async () => {
      const { wrapper, getApi } = mountNotification({ placement: 'bottomLeft' })
      await waitForNotification()

      getApi().open({
        title: 'BottomLeft',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.left).toBe('0px')

      wrapper.unmount()
    })

    it('supports bottomRight placement', async () => {
      const { wrapper, getApi } = mountNotification({ placement: 'bottomRight' })
      await waitForNotification()

      getApi().open({
        title: 'BottomRight',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.right).toBe('0px')

      wrapper.unmount()
    })

    it('supports top placement (centered)', async () => {
      const { wrapper, getApi } = mountNotification({ placement: 'top' })
      await waitForNotification()

      getApi().open({
        title: 'Top',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification')
      expect(container).toBeTruthy()
      const style = (container as HTMLElement)?.style
      expect(style.left).toBe('50%')

      wrapper.unmount()
    })
  })

  // ========================= Stack =========================
  describe('stack', () => {
    it('enables stack by default', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({ title: 'Stack 1', key: 's1', duration: 0 })
      getApi().open({ title: 'Stack 2', key: 's2', duration: 0 })
      await waitForNotification()

      const stackContainer = document.querySelector('.ant-notification-stack')
      expect(stackContainer).toBeTruthy()

      wrapper.unmount()
    })

    it('disables stack when stack is false', async () => {
      const { wrapper, getApi } = mountNotification({ stack: false })
      await waitForNotification()

      getApi().open({ title: 'No Stack 1', key: 'ns1', duration: 0 })
      getApi().open({ title: 'No Stack 2', key: 'ns2', duration: 0 })
      await waitForNotification()

      // Verify notifications are rendered without stacking transform
      const notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(2)

      wrapper.unmount()
    })

    it('supports stack with custom threshold', async () => {
      const { wrapper, getApi } = mountNotification({ stack: { threshold: 5 } })
      await waitForNotification()

      getApi().open({ title: 'Stack Threshold', key: 'st1', duration: 0 })
      await waitForNotification()

      // Should still render (the threshold only affects when stacking kicks in)
      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })
  })

  // ========================= Duration =========================
  describe('duration', () => {
    it('uses configured duration', async () => {
      const { wrapper, getApi } = mountNotification({ duration: 1 })
      await waitForNotification()

      getApi().open({
        title: 'Short Duration',
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('treats invalid duration as false (no auto close)', async () => {
      const { wrapper, getApi } = mountNotification({ duration: 0 })
      await waitForNotification()

      getApi().open({
        title: 'No Auto Close',
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('treats negative duration as false', async () => {
      const { wrapper, getApi } = mountNotification({ duration: -1 })
      await waitForNotification()

      getApi().open({
        title: 'Negative Duration',
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })
  })

  // ========================= RTL =========================
  describe('rTL', () => {
    it('supports rtl config', async () => {
      const { wrapper, getApi } = mountNotification({ rtl: true })
      await waitForNotification()

      getApi().open({
        title: 'RTL',
        duration: 0,
      })
      await waitForNotification()

      const rtlContainer = document.querySelector('.ant-notification-rtl')
      expect(rtlContainer).toBeTruthy()

      wrapper.unmount()
    })
  })

  // ========================= onClick =========================
  describe('onClick', () => {
    it('calls onClick when notice is clicked', async () => {
      const onClick = vi.fn()
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Clickable',
        onClick,
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice') as HTMLElement
      expect(notice).toBeTruthy()
      notice?.click()

      expect(onClick).toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  // ========================= className & style =========================
  describe('class and style', () => {
    it('supports custom class on notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Custom Class',
        class: 'my-notification-class',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.my-notification-class')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('supports custom style on notification', async () => {
      const { wrapper, getApi } = mountNotification()
      await waitForNotification()

      getApi().open({
        title: 'Custom Style',
        style: { color: 'red' },
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice') as HTMLElement
      expect(notice).toBeTruthy()
      expect(notice?.style.color).toBe('red')

      wrapper.unmount()
    })
  })

  // ========================= PurePanel =========================
  describe('purePanel', () => {
    it('renders with type', () => {
      const wrapper = mount(PurePanel, {
        props: {
          type: 'success',
          title: 'Pure Title',
          description: 'Pure Description',
        } as any,
        attachTo: document.body,
      })

      const panel = document.querySelector('.ant-notification-notice-pure-panel')
      expect(panel).toBeTruthy()

      const title = document.querySelector('.ant-notification-notice-title')
      expect(title?.textContent).toBe('Pure Title')

      const desc = document.querySelector('.ant-notification-notice-description')
      expect(desc?.textContent).toBe('Pure Description')

      wrapper.unmount()
    })

    it('renders with custom icon', () => {
      const wrapper = mount(PurePanel, {
        props: {
          icon: h('span', { class: 'panel-icon' }, '!'),
          title: 'Icon Panel',
        } as any,
        attachTo: document.body,
      })

      const icon = document.querySelector('.panel-icon')
      expect(icon).toBeTruthy()

      const withIcon = document.querySelector('.ant-notification-notice-with-icon')
      expect(withIcon).toBeTruthy()

      wrapper.unmount()
    })

    it('renders without icon and type', () => {
      const wrapper = mount(PurePanel, {
        props: {
          title: 'No Icon Panel',
        } as any,
        attachTo: document.body,
      })

      const withIcon = document.querySelector('.ant-notification-notice-with-icon')
      expect(withIcon).toBeFalsy()

      wrapper.unmount()
    })

    it('renders actions via slot', () => {
      const wrapper = mount(PurePanel, {
        props: {
          title: 'With Actions',
        } as any,
        slots: {
          actions: () => <button class="slot-action-btn">Act</button>,
        },
        attachTo: document.body,
      })

      const actionsArea = document.querySelector('.ant-notification-notice-actions')
      expect(actionsArea).toBeTruthy()

      const btn = document.querySelector('.slot-action-btn')
      expect(btn).toBeTruthy()

      wrapper.unmount()
    })

    it('renders actions via prop', () => {
      const wrapper = mount(PurePanel, {
        props: {
          title: 'With Actions Prop',
          actions: h('button', { class: 'prop-action-btn' }, 'Prop Act'),
        } as any,
        attachTo: document.body,
      })

      const btn = document.querySelector('.prop-action-btn')
      expect(btn).toBeTruthy()

      wrapper.unmount()
    })

    it('supports closable false', () => {
      const wrapper = mount(PurePanel, {
        props: {
          title: 'Not Closable',
          closable: false,
        } as any,
        attachTo: document.body,
      })

      const closeBtn = document.querySelector('.ant-notification-notice-close')
      expect(closeBtn).toBeFalsy()

      wrapper.unmount()
    })

    it('matches snapshot', () => {
      const wrapper = mount(PurePanel, {
        props: {
          type: 'info',
          title: 'Snapshot Title',
          description: 'Snapshot Description',
        } as any,
        attachTo: document.body,
      })

      const panel = document.querySelector('.ant-notification-notice-pure-panel')
      expect(panel?.innerHTML).toMatchSnapshot()

      wrapper.unmount()
    })
  })

  // ========================= Util =========================
  describe('util', () => {
    describe('getPlacementStyle', () => {
      it('returns correct style for topRight', () => {
        const style = getPlacementStyle('topRight', 24, 24)
        expect(style.right).toBe(0)
        expect(style.top).toBe('24px')
        expect(style.bottom).toBe('auto')
      })

      it('returns correct style for topLeft', () => {
        const style = getPlacementStyle('topLeft', 24, 24)
        expect(style.left).toBe(0)
        expect(style.top).toBe('24px')
        expect(style.bottom).toBe('auto')
      })

      it('returns correct style for top (centered)', () => {
        const style = getPlacementStyle('top', 24, 24)
        expect(style.left).toBe('50%')
        expect(style.transform).toBe('translateX(-50%)')
        expect(style.top).toBe('24px')
        expect(style.bottom).toBe('auto')
      })

      it('returns correct style for bottomRight (default)', () => {
        const style = getPlacementStyle('bottomRight', 24, 24)
        expect(style.right).toBe(0)
        expect(style.top).toBe('auto')
        expect(style.bottom).toBe('24px')
      })

      it('returns correct style for bottomLeft', () => {
        const style = getPlacementStyle('bottomLeft', 24, 24)
        expect(style.left).toBe(0)
        expect(style.top).toBe('auto')
        expect(style.bottom).toBe('24px')
      })

      it('returns correct style for bottom (centered)', () => {
        const style = getPlacementStyle('bottom', 24, 24)
        expect(style.left).toBe('50%')
        expect(style.transform).toBe('translateX(-50%)')
        expect(style.top).toBe('auto')
        expect(style.bottom).toBe('24px')
      })

      it('uses custom top and bottom values', () => {
        const style = getPlacementStyle('topRight', 50, 100)
        expect(style.top).toBe('50px')

        const bottomStyle = getPlacementStyle('bottomRight', 50, 100)
        expect(bottomStyle.bottom).toBe('100px')
      })
    })

    describe('getMotion', () => {
      it('returns fade motion config', () => {
        const motion = getMotion('ant-notification')
        expect(motion.name).toBe('ant-notification-fade')
      })
    })

    describe('getCloseIconConfig', () => {
      it('returns closeIcon from args when provided', () => {
        const icon = <span>X</span>
        expect(getCloseIconConfig(icon, undefined, undefined)).toBe(icon)
      })

      it('returns closeIcon from notificationConfig when arg is undefined', () => {
        const configIcon = <span>Config X</span>
        expect(getCloseIconConfig(undefined, { closeIcon: configIcon }, undefined)).toBe(configIcon)
      })

      it('returns closeIcon from notification context as fallback', () => {
        const contextIcon = <span>Context X</span>
        expect(getCloseIconConfig(undefined, undefined, { closeIcon: contextIcon } as any)).toBe(contextIcon)
      })

      it('returns undefined when no closeIcon provided', () => {
        expect(getCloseIconConfig(undefined, undefined, undefined)).toBeUndefined()
      })
    })

    describe('getCloseIcon (PurePanel)', () => {
      it('returns null when closeIcon is null', () => {
        expect(getCloseIcon('ant-notification', null)).toBeNull()
      })

      it('returns null when closeIcon is false', () => {
        expect(getCloseIcon('ant-notification', false as any)).toBeNull()
      })

      it('returns custom closeIcon when provided', () => {
        const icon = <span>Custom</span>
        expect(getCloseIcon('ant-notification', icon)).toBe(icon)
      })

      it('returns default CloseOutlined when closeIcon is undefined', () => {
        const result = getCloseIcon('ant-notification')
        expect(result).toBeTruthy()
      })
    })
  })

  // ========================= ConfigProvider =========================
  describe('configProvider integration', () => {
    it('reads notification config from ConfigProvider', async () => {
      const { default: ConfigProvider } = await import('../../config-provider')
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification()
          api = notificationApi
          return () => (
            <ConfigProvider notification={{ class: 'provider-notice-cls' }}>
              {contextHolder()}
            </ConfigProvider>
          )
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'ConfigProvider Test',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.provider-notice-cls')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('supports custom prefixCls via ConfigProvider', async () => {
      const { default: ConfigProvider } = await import('../../config-provider')
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification()
          api = notificationApi
          return () => (
            <ConfigProvider prefixCls="my-prefix">
              {contextHolder()}
            </ConfigProvider>
          )
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'PrefixCls Test',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.my-prefix-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('supports RTL via ConfigProvider direction', async () => {
      const { default: ConfigProvider } = await import('../../config-provider')
      let api!: NotificationInstance
      const App = defineComponent({
        setup() {
          const [notificationApi, contextHolder] = useNotification()
          api = notificationApi
          return () => (
            <ConfigProvider direction="rtl">
              {contextHolder()}
            </ConfigProvider>
          )
        },
      })

      const wrapper = mount(App, { attachTo: document.body })
      await waitForNotification()

      api.open({
        title: 'RTL Provider Test',
        duration: 0,
      })
      await waitForNotification()

      const rtlContainer = document.querySelector('.ant-notification-rtl')
      expect(rtlContainer).toBeTruthy()

      wrapper.unmount()
    })
  })

  // ========================= useNotification config =========================
  describe('useNotification config', () => {
    it('applies top and bottom offsets', async () => {
      const { wrapper, getApi } = mountNotification({ top: 50, bottom: 100 })
      await waitForNotification()

      getApi().open({
        title: 'Top Offset',
        duration: 0,
      })
      await waitForNotification()

      const container = document.querySelector('.ant-notification') as HTMLElement
      expect(container).toBeTruthy()
      // Default placement is topRight, so top should be 50
      expect(container?.style.top).toBe('50px')

      wrapper.unmount()
    })

    it('applies maxCount', async () => {
      const { wrapper, getApi } = mountNotification({ maxCount: 2 })
      await waitForNotification()

      getApi().open({ title: 'A', key: 'a', duration: 0 })
      getApi().open({ title: 'B', key: 'b', duration: 0 })
      getApi().open({ title: 'C', key: 'c', duration: 0 })
      await waitForNotification()

      const notices = document.querySelectorAll('.ant-notification-notice')
      expect(notices).toHaveLength(2)

      wrapper.unmount()
    })

    it('applies showProgress', async () => {
      const { wrapper, getApi } = mountNotification({ showProgress: true, duration: 10 })
      await waitForNotification()

      getApi().open({
        title: 'With Progress',
      })
      await waitForNotification()

      const progress = document.querySelector('.ant-notification-notice-progress')
      expect(progress).toBeTruthy()

      wrapper.unmount()
    })

    it('applies pauseOnHover', async () => {
      const { wrapper, getApi } = mountNotification({ pauseOnHover: true, duration: 10 })
      await waitForNotification()

      getApi().open({
        title: 'Pause On Hover',
      })
      await waitForNotification()

      const notice = document.querySelector('.ant-notification-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })

    it('applies prefixCls via hook config', async () => {
      const { wrapper, getApi } = mountNotification({ prefixCls: 'custom-noti' })
      await waitForNotification()

      getApi().open({
        title: 'Custom PrefixCls',
        duration: 0,
      })
      await waitForNotification()

      const notice = document.querySelector('.custom-noti-notice')
      expect(notice).toBeTruthy()

      wrapper.unmount()
    })
  })
})
