import type { MessageInstance } from '../interface'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useMessage } from '..'
import PurePanel from '../PurePanel'
import { mount } from '/@tests/utils'

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

    const content = document.querySelector('.ant-message-custom-content.ant-message-info')
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

    const content = document.querySelector('.ant-message-custom-content.ant-message-success')
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

    const content = document.querySelector('.ant-message-custom-content.ant-message-error')
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

    const content = document.querySelector('.ant-message-custom-content.ant-message-warning')
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

    const content = document.querySelector('.ant-message-custom-content.ant-message-loading')
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
    expect(notices[0].textContent).toContain('First')

    getApi().info({ content: 'Updated', key: 'update-key', duration: 0 })
    await nextTick()
    await nextTick()

    notices = document.querySelectorAll('.ant-message-notice')
    expect(notices.length).toBe(1)
    expect(notices[0].textContent).toContain('Updated')

    wrapper.unmount()
  })

  // ========================= onClose =========================
  it('calls onClose callback', async () => {
    const onClose = vi.fn()
    const { wrapper, getApi } = mountMessage()
    await nextTick()
    await nextTick()

    getApi().info({ content: 'Will Close', key: 'close-key', onClose, duration: 0 })
    await nextTick()
    await nextTick()

    getApi().destroy('close-key')
    await nextTick()
    await nextTick()

    expect(onClose).toHaveBeenCalled()

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

    const content = document.querySelector('.ant-message-custom-content.ant-message-warning')
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

    const content = document.querySelector('.ant-message-custom-content.ant-message-error')
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
