import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Modal from '..'
import Popover from '../../popover'
import { mount, waitFakeTimer } from '/@tests/utils'

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
})
