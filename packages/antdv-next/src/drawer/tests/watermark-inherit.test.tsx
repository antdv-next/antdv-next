/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Drawer from '..'
import { WatermarkContextProvider } from '../../watermark/context'
import { mount } from '/@tests/utils'

async function flush() {
  await nextTick()
  await new Promise(r => setTimeout(r, 0))
  await nextTick()
}

// Verifies whether the drawer's function ref resolves the exposed `panel` and
// registers it with a wrapping Watermark (via context). Under vue >=3.5.39 a
// broken function-ref resolve would leave `panel` null → `remove` instead of `add`.
describe('drawer watermark inheritance (#623)', () => {
  it('registers the drawer panel with the watermark context when open', async () => {
    const add = vi.fn()
    const remove = vi.fn()

    const wrapper = mount(
      () => h(WatermarkContextProvider, { add, remove }, {
        default: () => h(Drawer, { open: true, title: 'x' }, { default: () => 'content' }),
      }),
      { attachTo: document.body },
    )
    await flush()

    expect(add).toHaveBeenCalled()
    expect(add.mock.calls.at(-1)?.[0]).toBeTruthy()

    wrapper.unmount()
  })

  it('registers the drawer panel when opened AFTER mount (closed -> open)', async () => {
    const add = vi.fn()
    const remove = vi.fn()
    const open = ref(false)

    const wrapper = mount(
      () => h(WatermarkContextProvider, { add, remove }, {
        default: () => h(Drawer, { open: open.value, title: 'x' }, { default: () => 'content' }),
      }),
      { attachTo: document.body },
    )
    await flush()

    open.value = true
    await flush()

    expect(add).toHaveBeenCalled()
    expect(add.mock.calls.at(-1)?.[0]).toBeTruthy()

    wrapper.unmount()
  })
})
