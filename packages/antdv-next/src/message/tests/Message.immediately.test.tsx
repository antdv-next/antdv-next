import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import message, { actDestroy } from '..'
import { waitFakeTimer } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59942
describe('message call close immediately', () => {
  beforeEach(() => {
    actDestroy()
    vi.useFakeTimers()
  })

  afterEach(async () => {
    message.destroy()
    actDestroy()
    await waitFakeTimer(1, 5)
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  it('open', async () => {
    const closeFn = message.open({ content: '' })
    const onSettled = vi.fn()
    closeFn.then(onSettled)
    closeFn()

    await waitFakeTimer(1, 5)

    expect(onSettled).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(0)
  })

  it('info', async () => {
    const closeFn = message.info('Message1', 0)
    const onSettled = vi.fn()
    closeFn.then(onSettled)
    closeFn()

    await waitFakeTimer(1, 5)

    expect(onSettled).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('.ant-message-notice')).toHaveLength(0)
  })
})
