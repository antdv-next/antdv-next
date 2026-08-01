import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, onMounted } from 'vue'
import Modal from '..'
import App from '../../app'
import ConfigProvider from '../../config-provider'
import zhCN from '../../locale/zh_CN'
import Popover from '../../popover'
import { mount, waitFakeTimer } from '/@tests/utils'

describe('modal static', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Modal.destroyAll()
    ConfigProvider.config({ holderRender: undefined, locale: undefined })
    await waitFakeTimer(1, 5)
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('modal.info should not show cancel button by default', async () => {
    Modal.info({
      title: 'This is a notification message',
      content: 'some messages',
    })

    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn')).toHaveLength(1)
  })

  it('modal.confirm should show cancel button by default', async () => {
    Modal.confirm({
      title: 'This is a confirm message',
      content: 'some messages',
    })

    await waitFakeTimer(1, 5)

    expect(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn')).toHaveLength(2)
  })

  it('modal.confirm should support locale from holderRender config', async () => {
    ConfigProvider.config({
      holderRender: children => (
        <ConfigProvider locale={zhCN}>
          {children}
        </ConfigProvider>
      ),
    })

    Modal.confirm({
      title: '标题',
      content: '内容',
    })

    await waitFakeTimer(1, 5)

    const buttons = Array.from(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn'))
      .map(node => node.textContent?.replace(/\s+/g, '').trim())

    expect(buttons).toEqual(['取消', '确定'])
  })

  it('modal.confirm should support locale from global config', async () => {
    ConfigProvider.config({ locale: zhCN })

    Modal.confirm({
      title: '标题',
      content: '内容',
    })

    await waitFakeTimer(1, 5)

    const buttons = Array.from(document.querySelectorAll('.ant-modal-confirm-btns .ant-btn'))
      .map(node => node.textContent?.replace(/\s+/g, '').trim())

    expect(buttons).toEqual(['取消', '确定'])
  })

  it('bodyStyle should apply to confirm content instead of modal body', async () => {
    Modal.confirm({
      title: 'Bamboo',
      content: 'Little',
      bodyStyle: { width: '500px' },
    })

    await waitFakeTimer(1, 5)

    const content = document.querySelector<HTMLElement>('.ant-modal-confirm-content')!
    expect(content.style.width).toBe('500px')
    expect(document.querySelector<HTMLElement>('.ant-modal-body')!.style.width).toBe('')
  })

  it('styles.body should apply to confirm content instead of modal body', async () => {
    Modal.confirm({
      title: 'Bamboo',
      content: 'Little',
      styles: { body: { width: '500px' } },
    })

    await waitFakeTimer(1, 5)

    const content = document.querySelector<HTMLElement>('.ant-modal-confirm-content')!
    expect(content.style.width).toBe('500px')
    expect(document.querySelector<HTMLElement>('.ant-modal-body')!.style.width).toBe('')
  })

  it('styles function should apply body semantic config to confirm content', async () => {
    Modal.confirm({
      title: 'Bamboo',
      content: 'Little',
      styles: () => ({ body: { width: '500px' } }),
    })

    await waitFakeTimer(1, 5)

    const content = document.querySelector<HTMLElement>('.ant-modal-confirm-content')!
    expect(content.style.width).toBe('500px')
    expect(document.querySelector<HTMLElement>('.ant-modal-body')!.style.width).toBe('')
  })

  it('should apply body semantic config to confirm content in App.useApp modal method', async () => {
    const Confirm = defineComponent(() => {
      const { modal } = App.useApp()
      onMounted(() => {
        modal.confirm({
          title: 'Bamboo',
          content: 'Little',
        })
      })
      return () => null
    })

    mount(
      () => (
        <ConfigProvider
          modal={{
            classes: { body: 'custom-confirm-content' },
            styles: { body: { margin: '24px' } },
          }}
        >
          <App>
            <Confirm />
          </App>
        </ConfigProvider>
      ),
      { attachTo: document.body },
    )

    await waitFakeTimer()

    const modalBody = document.querySelector<HTMLElement>('.ant-modal-body')!
    const title = document.querySelector<HTMLElement>('.ant-modal-confirm-title')!
    const content = document.querySelector<HTMLElement>('.ant-modal-confirm-content')!

    expect(modalBody.classList.contains('custom-confirm-content')).toBe(false)
    expect(modalBody.style.margin).toBe('')
    expect(title.closest('.custom-confirm-content')).toBeFalsy()
    expect(content.classList.contains('custom-confirm-content')).toBe(true)
    expect(content.style.margin).toBe('24px')
  })

  it('should resolve confirm content body semantics with merged Modal props', async () => {
    const Confirm = defineComponent(() => {
      const { modal } = App.useApp()
      onMounted(() => {
        modal.confirm({
          title: 'Bamboo',
          content: 'Little',
        })
      })
      return () => null
    })

    mount(
      () => (
        <ConfigProvider
          modal={{
            classes: ({ props }: any) => ({
              body: props.focusable?.trap === false ? 'custom-focusable-content' : '',
            }),
            focusable: { trap: false },
            styles: ({ props }: any) => ({
              body: { width: props.focusable?.trap === false ? '500px' : '300px' },
            }),
          }}
        >
          <App>
            <Confirm />
          </App>
        </ConfigProvider>
      ),
      { attachTo: document.body },
    )

    await waitFakeTimer()

    const modalBody = document.querySelector<HTMLElement>('.ant-modal-body')!
    const content = document.querySelector<HTMLElement>('.ant-modal-confirm-content')!

    expect(modalBody.classList.contains('custom-focusable-content')).toBe(false)
    expect(modalBody.style.width).toBe('')
    expect(content.classList.contains('custom-focusable-content')).toBe(true)
    expect(content.style.width).toBe('500px')
  })
})

describe('modal integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    document.body.innerHTML = ''
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('keeps focus on a body-mounted popover input when modal is open', async () => {
    mount(Modal, {
      attachTo: document.body,
      props: {
        open: true,
        footer: null,
        title: 'Modal with Popover',
        styles: {
          wrapper: {
            position: 'fixed',
          },
        },
      },
      slots: {
        default: () => (
          <Popover
            open
            trigger="click"
            content={<input id="modal-popover-input" />}
          >
            <input id="modal-popover-trigger" readonly />
          </Popover>
        ),
      },
    })

    await waitFakeTimer(20, 10)

    const popupInput = document.getElementById('modal-popover-input') as HTMLInputElement | null
    const modalElement = document.querySelector('.ant-modal')
    expect(popupInput).not.toBeNull()
    expect(modalElement?.contains(popupInput!)).toBe(false)

    popupInput!.focus()
    await waitFakeTimer(1, 5)

    expect(document.activeElement).toBe(popupInput)
  })

  it('keeps focus on a click-triggered popover input when modal is open', async () => {
    mount(Modal, {
      attachTo: document.body,
      props: {
        open: true,
        footer: null,
        title: 'Modal with Click Popover',
        styles: {
          wrapper: {
            position: 'fixed',
          },
        },
      },
      slots: {
        default: () => (
          <Popover
            trigger="click"
            content={<input id="modal-click-popover-input" />}
          >
            <input id="modal-click-popover-trigger" readonly />
          </Popover>
        ),
      },
    })

    await waitFakeTimer(20, 10)
    const triggerInput = document.getElementById('modal-click-popover-trigger')
    expect(triggerInput).not.toBeNull()
    triggerInput!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await waitFakeTimer(20, 10)

    const popupInput = document.getElementById('modal-click-popover-input') as HTMLInputElement | null
    const modalElement = document.querySelector('.ant-modal')
    expect(popupInput).not.toBeNull()
    expect(modalElement?.contains(popupInput!)).toBe(false)

    popupInput!.focus()
    await waitFakeTimer(1, 5)

    expect(document.activeElement).toBe(popupInput)
  })

  it('should not invoke default slot while loading', async () => {
    const slotSpy = vi.fn(() => <div id="lazy-slot-content">Hello</div>)
    mount(Modal, {
      attachTo: document.body,
      props: {
        open: true,
        loading: true,
        title: 'Loading Modal',
      },
      slots: {
        default: slotSpy,
      },
    })

    await waitFakeTimer(20, 10)

    expect(document.querySelector('.ant-modal-body-skeleton')).not.toBeNull()
    expect(slotSpy).not.toHaveBeenCalled()
  })

  it('should render content when forceRender is true even if modal is closed', async () => {
    const wrapper = mount(Modal, {
      attachTo: document.body,
      props: {
        open: false,
        forceRender: true,
        title: 'Force Render Modal',
      },
      slots: {
        default: () => <div id="force-render-content">Hello</div>,
      },
    })

    await waitFakeTimer(20, 10)

    const content = document.getElementById('force-render-content')
    expect(content).not.toBeNull()
    expect(content!.textContent).toBe('Hello')

    wrapper.unmount()
  })
})
