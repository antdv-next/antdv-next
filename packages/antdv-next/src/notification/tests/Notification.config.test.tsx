import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import notification, { actDestroy } from '..'
import { waitFakeTimer } from '/@tests/utils'

describe('notification.config', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    notification.destroy()
    notification.config({
      top: undefined,
      bottom: undefined,
      maxCount: undefined,
      getContainer: undefined,
      duration: undefined,
      showProgress: undefined,
      pauseOnHover: undefined,
      placement: undefined,
      rtl: undefined,
      prefixCls: undefined,
    })
    actDestroy()
    await waitFakeTimer(1, 5)
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('updates the holder when config changes after it is mounted', async () => {
    notification.config({ top: 10 })
    notification.open({
      title: 'first',
      duration: 0,
    })
    await waitFakeTimer(1, 5)

    const container = document.querySelector('.ant-notification') as HTMLElement
    expect(container).toBeTruthy()
    expect(container.style.getPropertyValue('--notification-top')).toBe('10px')

    notification.config({ top: 200 })
    notification.open({
      title: 'second',
      key: 'second',
      duration: 0,
    })
    await waitFakeTimer(1, 5)

    expect(document.querySelector('.ant-notification')).toBe(container)
    expect(container.style.getPropertyValue('--notification-top')).toBe('200px')
  })
})
