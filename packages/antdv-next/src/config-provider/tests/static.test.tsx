import { StyleProvider } from '@antdv-next/cssinjs'
import { SmileOutlined } from '@antdv-next/icons'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '..'
import { ATTR_MARK } from '../../../../cssinjs/src/StyleContext'
import App from '../../app'
import message, { actDestroy as destroyMessageInstance } from '../../message'
import Modal from '../../modal'
import notification, { actDestroy as destroyNotificationInstance } from '../../notification'
import { waitFakeTimer } from '/@tests/utils'

describe('config-provider static methods', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.querySelectorAll(`style[${ATTR_MARK}]`).forEach(style => style.remove())
  })

  afterEach(async () => {
    message.destroy()
    notification.destroy()
    Modal.destroyAll()
    ConfigProvider.config({ holderRender: undefined })
    destroyMessageInstance()
    destroyNotificationInstance()
    await waitFakeTimer(1, 5)
    document.querySelectorAll(`style[${ATTR_MARK}]`).forEach(style => style.remove())
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('should apply holderRender to message, notification and modal static methods', async () => {
    const holderRender = vi.fn((children) => {
      return <div data-holder-render="true">{children}</div>
    })

    ConfigProvider.config({ holderRender })

    message.info({
      content: 'message content',
      duration: 0,
    })
    await waitFakeTimer(1, 5)

    const messageRenderCount = holderRender.mock.calls.length
    expect(messageRenderCount).toBeGreaterThan(0)
    expect(document.body.textContent).toContain('message content')

    notification.open({
      title: 'notification title',
      description: 'notification description',
      duration: 0,
    })
    await waitFakeTimer(1, 5)

    const notificationRenderCount = holderRender.mock.calls.length
    expect(notificationRenderCount).toBeGreaterThan(messageRenderCount)
    expect(document.body.textContent).toContain('notification title')
    expect(document.body.textContent).toContain('notification description')

    Modal.confirm({
      title: 'modal title',
      content: 'modal content',
    })
    await waitFakeTimer(1, 5)

    expect(holderRender.mock.calls.length).toBeGreaterThan(notificationRenderCount)
    expect(document.body.textContent).toContain('modal title')
    expect(document.body.textContent).toContain('modal content')
  })

  it('should register static modal icon styles inside layer when holderRender enables layer', async () => {
    ConfigProvider.config({
      holderRender: children => (
        <StyleProvider layer>
          <ConfigProvider>
            <App>
              {children}
            </App>
          </ConfigProvider>
        </StyleProvider>
      ),
    })

    Modal.confirm({
      title: 'modal title',
      content: 'modal content',
      icon: <SmileOutlined />,
    })

    await waitFakeTimer(1, 5)

    // https://github.com/ant-design/ant-design/pull/58559
    // Layer mode forces zeroRuntime: the icon package must not inject (or
    // rewrite) its global runtime style into `@layer antd` — demoting that
    // shared style would break icons rendered outside the layered subtree.
    const runtimeStyle = document.querySelector('style[vc-util-key="@ant-design-icons"]')
    if (runtimeStyle) {
      expect(runtimeStyle.innerHTML).not.toContain('@layer antd')
    }

    // The layered icon reset is served by cssinjs instead.
    expect(
      Array.from(document.querySelectorAll('style')).some(
        style => style.innerHTML.includes('@layer antd') && style.innerHTML.includes('.anticon'),
      ),
    ).toBeTruthy()
  })
})
