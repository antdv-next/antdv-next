import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Modal from '..'
import { waitFakeTimer } from '/@tests/utils'

describe('modal static', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Modal.destroyAll()
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
})
