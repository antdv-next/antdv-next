import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFakeTimer } from '/@tests/utils'

const counters = vi.hoisted(() => ({
  watch: 0,
  invoke: 0,
}))

vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>()
  return {
    ...vue,
    watch: (source: any, callback: any, options?: any) => {
      counters.watch += 1
      return vue.watch(source, (...args: any[]) => {
        counters.invoke += 1
        return callback(...args)
      }, options)
    },
  }
})

// Imported after the mock so the whole component graph uses the wrapped `watch`
const Modal = (await import('..')).default
const ConfigProvider = (await import('../../config-provider')).default
const { nextTick } = await import('vue')

describe('modal static confirm theme watcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(async () => {
    Modal.destroyAll()
    ConfigProvider.config({ theme: {} })
    await waitFakeTimer(1, 5)
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('registers one theme watcher per instance and stops it on destroy', async () => {
    counters.watch = 0
    counters.invoke = 0

    const afterClose = vi.fn()
    const modal = Modal.confirm({ title: 'test', afterClose })
    await waitFakeTimer(20, 10)

    const created = counters.watch

    modal.update({ title: 'updated' })
    await nextTick()
    modal.update({ content: 'updated again' })
    await nextTick()
    modal.destroy()
    await waitFakeTimer(20, 20)

    expect(afterClose).toHaveBeenCalled()
    expect(counters.watch - created).toBe(0)

    const invoked = counters.invoke
    ConfigProvider.config({ theme: { token: { colorPrimary: '#f00' } } })
    await nextTick()
    await nextTick()

    expect(counters.invoke - invoked).toBe(0)
  })

  it('updates the open dialog when the global theme changes', async () => {
    counters.invoke = 0

    const modal = Modal.confirm({ title: 'test' })
    await waitFakeTimer(20, 10)

    const invoked = counters.invoke
    ConfigProvider.config({ theme: { token: { colorPrimary: '#123456' } } })
    await nextTick()
    await nextTick()

    expect(counters.invoke).toBeGreaterThan(invoked)

    modal.destroy()
    await waitFakeTimer(20, 20)
  })
})
