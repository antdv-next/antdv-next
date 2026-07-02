import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Modal from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

// The portal scroll-locker injects a `<style>html body { overflow-y: hidden }</style>`
// into the document head rather than mutating `document.body.style` directly.
function hasScrollLockStyle() {
  return Array.from(document.querySelectorAll('style')).some(s =>
    (s.textContent || '').includes('overflow-y: hidden'),
  )
}

// https://github.com/ant-design/ant-design/pull/58256
describe('modal scrollLock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  function mountModal(props: Record<string, any>) {
    const Demo = {
      setup() {
        const open = ref(true)
        return () => h(Modal, { open: open.value, ...props }, { default: () => 'body' })
      },
    }
    return mount(Demo, { attachTo: document.body })
  }

  it('locks body scroll by default', async () => {
    const wrapper = mountModal({})
    await nextTick()
    await waitFakeTimer()

    expect(hasScrollLockStyle()).toBe(true)
    wrapper.unmount()
  })

  it('does not lock body scroll when scrollLock is false', async () => {
    const wrapper = mountModal({ scrollLock: false })
    await nextTick()
    await waitFakeTimer()

    expect(hasScrollLockStyle()).toBe(false)
    wrapper.unmount()
  })
})
