import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConfigProvider from '..'
import message, { actDestroy as destroyMessageInstance } from '../../message'
import Modal from '../../modal'
import notification, { actDestroy as destroyNotificationInstance } from '../../notification'
import { waitFakeTimer } from '/@tests/utils'

describe('config-provider static methods', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    message.destroy()
    notification.destroy()
    Modal.destroyAll()
    ConfigProvider.config({ holderRender: undefined })
    destroyMessageInstance()
    destroyNotificationInstance()
    await waitFakeTimer(1, 5)
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
})
