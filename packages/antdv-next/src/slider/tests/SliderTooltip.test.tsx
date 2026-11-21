import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import SliderTooltip from '../SliderTooltip'

const rafMock = vi.hoisted(() => {
  let id = 0
  const pending = new Map<number, () => void>()
  const raf = vi.fn((cb: () => void) => {
    id += 1
    pending.set(id, cb)
    return id
  }) as any
  raf.cancel = vi.fn((rafId: number) => {
    pending.delete(rafId)
  })
  return { raf, pending }
})

vi.mock('@v-c/util/dist/raf', () => ({ default: rafMock.raf }))

async function flush() {
  await nextTick()
  await nextTick()
}

describe('slider tooltip', () => {
  it('cancels the pending align frame when the tooltip closes', async () => {
    const open = ref(false)
    const wrapper = mount({
      render: () => (
        <SliderTooltip open={open.value} title="1" value={1}>
          <span class="handle" />
        </SliderTooltip>
      ),
    }, { attachTo: document.body })

    await flush()
    open.value = true
    await flush()
    // Opened tooltip has a pending align frame
    expect(rafMock.pending.size).toBe(1)
    rafMock.raf.mockClear()
    rafMock.raf.cancel.mockClear()

    open.value = false
    await flush()

    // Closing must not schedule a new align frame, and the pending one is cancelled
    expect(rafMock.raf).not.toHaveBeenCalled()
    expect(rafMock.raf.cancel).toHaveBeenCalled()
    expect(rafMock.pending.size).toBe(0)

    wrapper.unmount()
  })

  it('schedules an align frame when opened', async () => {
    const open = ref(false)
    const wrapper = mount({
      render: () => (
        <SliderTooltip open={open.value} title="1" value={1}>
          <span class="handle" />
        </SliderTooltip>
      ),
    }, { attachTo: document.body })

    await flush()
    rafMock.raf.mockClear()

    open.value = true
    await flush()

    expect(rafMock.raf).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    expect(rafMock.pending.size).toBe(0)
  })
})
