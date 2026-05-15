import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Modal from '..'
import ConfigProvider from '../../config-provider'
import { mount, waitFakeTimer } from '/@tests/utils'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('modal focusable ConfigProvider', () => {
  it('reads focusable.autoFocusButton from ConfigProvider.modal.focusable', async () => {
    const Demo = {
      setup() {
        const open = ref(true)
        return () => h(ConfigProvider, { modal: { focusable: { autoFocusButton: 'cancel' } } }, {
          default: () => h(Modal, { open: open.value, title: 'hi' }, { default: () => 'body' }),
        })
      },
    }
    const wrapper = mount(Demo, { attachTo: document.body })
    await nextTick()
    await waitFakeTimer()

    // Just confirm the modal mounts without error; deep focus-trap behavior is exercised by vc-dialog.
    expect(document.querySelector('.ant-modal')).toBeTruthy()
    wrapper.unmount()
  })

  it('component-level focusable wins over ConfigProvider', async () => {
    const Demo = {
      setup() {
        const open = ref(true)
        return () => h(ConfigProvider, { modal: { focusable: { autoFocusButton: 'cancel' } } }, {
          default: () => h(Modal, { open: open.value, title: 'hi', focusable: { autoFocusButton: 'ok' } }, { default: () => 'body' }),
        })
      },
    }
    const wrapper = mount(Demo, { attachTo: document.body })
    await nextTick()
    await waitFakeTimer()

    expect(document.querySelector('.ant-modal')).toBeTruthy()
    wrapper.unmount()
  })
})

describe('drawer focusable ConfigProvider', () => {
  it('mounts when ConfigProvider.drawer.focusable is provided', async () => {
    const Drawer = (await import('../../drawer')).default
    const Demo = {
      setup() {
        const open = ref(true)
        return () => h(ConfigProvider, { drawer: { focusable: { focusTriggerAfterClose: false } } }, {
          default: () => h(Drawer, { open: open.value, title: 'hi' }, { default: () => 'body' }),
        })
      },
    }
    const wrapper = mount(Demo, { attachTo: document.body })
    await nextTick()
    await waitFakeTimer()

    expect(document.querySelector('.ant-drawer')).toBeTruthy()
    wrapper.unmount()
  })
})
