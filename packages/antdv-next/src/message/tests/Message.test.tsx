import type { MessageInstance } from '../interface'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import { useMessage } from '..'
import PurePanel from '../PurePanel'
import { DOMWrapper, mount } from '/@tests/utils'

function mountMessage(config?: any) {
  let api!: MessageInstance
  const App = defineComponent({
    setup() {
      const [messageApi, contextHolder] = useMessage(config)
      api = messageApi
      return () => contextHolder()
    },
  })
  const wrapper = mount(App, { attachTo: document.body })
  return { wrapper, getApi: () => api }
}

describe('message', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ========================= Types =========================
  it('renders info message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info('Hello Info')
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-info .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Hello Info')

    wrapper.unmount()
  })

  it('renders success message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().success('Success!')
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-success .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Success!')

    wrapper.unmount()
  })

  it('renders error message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().error('Error!')
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-error .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Error!')

    wrapper.unmount()
  })

  it('renders warning message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().warning('Warning!')
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-warning .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Warning!')

    wrapper.unmount()
  })

  it('renders loading message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().loading('Loading...')
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-loading .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Loading...')

    wrapper.unmount()
  })

  // ========================= Content =========================
  it('shows custom JSX content', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info(<span class="custom-msg">Custom JSX</span>)
    await nextTick()
    await nextTick()

    const el = document.querySelector('.custom-msg')
    expect(el).toBeTruthy()
    expect(el?.textContent).toBe('Custom JSX')

    wrapper.unmount()
  })

  // ========================= Icon =========================
  it('supports custom icon', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().open({
      content: 'With Icon',
      icon: <span class="my-icon">*</span>,
    })
    await nextTick()
    await nextTick()

    const icon = document.querySelector('.my-icon')
    expect(icon).toBeTruthy()
    expect(icon?.textContent).toBe('*')

    wrapper.unmount()
  })

  // ========================= Key =========================
  it('supports key to update message', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'First', key: 'update-key', duration: 0 })
    await nextTick()
    await nextTick()

    let notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(1)
    expect(notices[0]!.textContent).toContain('First')

    getApi().info({ content: 'Updated', key: 'update-key', duration: 0 })
    await nextTick()
    await nextTick()

    notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(1)
    expect(notices[0]!.textContent).toContain('Updated')

    wrapper.unmount()
  })

  // ========================= onClose =========================
  it('calls onClose callback', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Will Close', key: 'close-key', onClose, duration: 0.01 })
    await nextTick()
    await nextTick()

    vi.advanceTimersByTime(20)
    await nextTick()
    await nextTick()
    await nextTick()

    expect(onClose).toHaveBeenCalled()

    vi.useRealTimers()
    wrapper.unmount()
  })

  // ========================= Destroy =========================
  it('destroys message by key', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Destroy Me', key: 'destroy-key', duration: 0 })
    await nextTick()
    await nextTick()

    let notice = document.querySelector('.ant-message-notice')
    expect(notice).toBeTruthy()

    getApi().destroy('destroy-key')
    await nextTick()
    await nextTick()
    await nextTick()

    notice = document.querySelector('.ant-message-notice')
    expect(notice).toBeNull()

    wrapper.unmount()
  })

  it('destroys all messages', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Msg 1', key: 'k1', duration: 0 })
    getApi().info({ content: 'Msg 2', key: 'k2', duration: 0 })
    await nextTick()
    await nextTick()

    let notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(2)

    getApi().destroy()
    await nextTick()
    await nextTick()
    await nextTick()

    notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(0)

    wrapper.unmount()
  })

  // ========================= Open API =========================
  it('supports open API with type', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().open({ content: 'Open API', type: 'warning' })
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-warning .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Open API')

    wrapper.unmount()
  })

  // ========================= Object form =========================
  it('supports object form in type methods', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().error({ content: 'Object Form Error' })
    await nextTick()
    await nextTick()

    const content = document.querySelector('.ant-message-notice-error .ant-message-notice-title')
    expect(content).toBeTruthy()
    expect(content?.textContent).toContain('Object Form Error')

    wrapper.unmount()
  })

  // ========================= Duration as function =========================
  it('supports duration as function (onClose shorthand)', async () => {
    const onClose = vi.fn()
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info('Quick', onClose)
    await nextTick()
    await nextTick()

    const notice = document.querySelector('.ant-message-notice')
    expect(notice).toBeTruthy()
    expect(notice?.textContent).toContain('Quick')

    wrapper.unmount()
  })

  // ========================= Multiple messages =========================
  it('shows multiple messages', async () => {
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Msg A', key: 'a', duration: 0 })
    getApi().success({ content: 'Msg B', key: 'b', duration: 0 })
    getApi().error({ content: 'Msg C', key: 'c', duration: 0 })
    await nextTick()
    await nextTick()

    const notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(3)

    wrapper.unmount()
  })

  it('supports stack config', async () => {
    const { wrapper, getApi } = mountMessage({ stack: true })
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Stacked', duration: 0 })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.ant-message-stack')).toBeTruthy()

    wrapper.unmount()
  })

  it('disables stack when stack is false', async () => {
    const { wrapper, getApi } = mountMessage({ stack: false })
    await nextTick()
    await nextTick()

    getApi().info({ content: 'No Stack 1', key: 'ns1', duration: 0 })
    getApi().info({ content: 'No Stack 2', key: 'ns2', duration: 0 })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.ant-message-stack')).toBeFalsy()
    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(2)

    wrapper.unmount()
  })

  it('supports stack with custom threshold', async () => {
    const { wrapper, getApi } = mountMessage({ stack: { threshold: 2 } })
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Stack 1', key: 'st1', duration: 0 })
    getApi().info({ content: 'Stack 2', key: 'st2', duration: 0 })
    getApi().info({ content: 'Stack 3', key: 'st3', duration: 0 })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.ant-message-stack')).toBeTruthy()
    expect(document.querySelectorAll('.ant-message-notice-stack-in-threshold')).toHaveLength(2)

    wrapper.unmount()
  })

  it('reacts to config changes', async () => {
    const config = reactive({
      prefixCls: 'first-message',
    })
    let api!: MessageInstance
    const App = defineComponent({
      setup() {
        const [messageApi, contextHolder] = useMessage(config)
        api = messageApi
        return () => contextHolder()
      },
    })
    const wrapper = mount(App, { attachTo: document.body })

    await nextTick()
    await nextTick()
    api.info({ content: 'First', key: 'first', duration: 0 })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.first-message-notice')).toBeTruthy()

    config.prefixCls = 'second-message'
    await nextTick()
    await nextTick()
    api.info({ content: 'Second', key: 'second', duration: 0 })
    await nextTick()
    await nextTick()

    expect(document.querySelector('.second-message-notice')).toBeTruthy()

    wrapper.unmount()
  })

  it('applies reactive duration config to new messages', async () => {
    vi.useFakeTimers()
    const config = reactive({ duration: 1 })
    const { wrapper, getApi } = mountMessage(config)
    await nextTick()
    await nextTick()

    const firstClose = vi.fn()
    getApi().info({ content: 'One second', key: 'one-second', onClose: firstClose })
    await nextTick()
    await nextTick()

    vi.advanceTimersByTime(1100)
    await nextTick()

    expect(firstClose).toHaveBeenCalledTimes(1)

    config.duration = 2
    await nextTick()

    const secondClose = vi.fn()
    getApi().info({ content: 'Two seconds', key: 'two-seconds', onClose: secondClose })
    await nextTick()
    await nextTick()

    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(secondClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1100)
    await nextTick()
    expect(secondClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('applies reactive maxCount config when opening messages', async () => {
    const config = reactive({ maxCount: 3 })
    const { wrapper, getApi } = mountMessage(config)
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Message A', key: 'max-a', duration: 0 })
    getApi().info({ content: 'Message B', key: 'max-b', duration: 0 })
    getApi().info({ content: 'Message C', key: 'max-c', duration: 0 })
    await nextTick()
    await nextTick()
    await nextTick()

    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(3)

    config.maxCount = 1
    await nextTick()

    getApi().info({ content: 'Message D', key: 'max-d', duration: 0 })
    await nextTick()
    await nextTick()
    await nextTick()

    const notices = document.querySelectorAll('.ant-message-notice')
    expect(notices).toHaveLength(1)
    expect(notices[0]?.textContent).toContain('Message D')

    wrapper.unmount()
  })

  it('applies reactive pauseOnHover config to new messages', async () => {
    vi.useFakeTimers()
    const config = reactive({ duration: 0.1, pauseOnHover: false })
    const { wrapper, getApi } = mountMessage(config)
    await nextTick()
    await nextTick()

    const notPausedClose = vi.fn()
    getApi().info({ content: 'Not paused', onClose: notPausedClose })
    await nextTick()
    await nextTick()

    let notice = Array.from(document.querySelectorAll<HTMLElement>('.ant-message-notice'))
      .find(item => item.textContent?.includes('Not paused'))
    expect(notice).toBeTruthy()
    await new DOMWrapper(notice!).trigger('mouseenter')
    vi.advanceTimersByTime(200)
    await nextTick()

    expect(notPausedClose).toHaveBeenCalledTimes(1)

    config.pauseOnHover = true
    await nextTick()

    const pausedClose = vi.fn()
    getApi().info({ content: 'Paused', onClose: pausedClose })
    await nextTick()
    await nextTick()

    notice = Array.from(document.querySelectorAll<HTMLElement>('.ant-message-notice'))
      .find(item => item.textContent?.includes('Paused'))
    expect(notice).toBeTruthy()
    await new DOMWrapper(notice!).trigger('mouseenter')
    vi.advanceTimersByTime(200)
    await nextTick()

    expect(pausedClose).not.toHaveBeenCalled()

    await new DOMWrapper(notice!).trigger('mouseleave')
    vi.advanceTimersByTime(200)
    await nextTick()

    expect(pausedClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  // ========================= Snapshot =========================
  it('purePanel matches snapshot', () => {
    const wrapper = mount(PurePanel, {
      props: { type: 'info', content: 'Snapshot Content' } as any,
      attachTo: document.body,
    })
    const notice = document.querySelector('.ant-message-notice')
    expect(notice?.innerHTML).toMatchSnapshot()
    wrapper.unmount()
  })
})
