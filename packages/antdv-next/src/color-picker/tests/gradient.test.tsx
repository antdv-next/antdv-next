import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ColorPicker from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushColorPickerTimer() {
  await waitFakeTimer(150, 10)
  await nextTick()
}

describe('color-picker gradient', () => {
  let originOffsetParentDescriptor: PropertyDescriptor | undefined

  beforeAll(() => {
    originOffsetParentDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    if (originOffsetParentDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originOffsetParentDescriptor)
    }
  })

  it('switches single mode to gradient mode', async () => {
    const onChange = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: ['single', 'gradient'],
        defaultValue: '#123456',
        open: true,
        onChange,
      },
    })
    await flushColorPickerTimer()

    const gradientInput = document.querySelectorAll<HTMLElement>('.ant-segmented-item-input')[1]
    expect(gradientInput).toBeTruthy()
    gradientInput?.click()
    await flushColorPickerTimer()

    expect(onChange).toHaveBeenCalled()
    // @ts-expect-error esnext
    const cssValue = onChange.mock.calls.at(-1)?.[1]
    expect(String(cssValue)).toContain('linear-gradient')
  })

  it('switches gradient mode to single mode', async () => {
    const onChange = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: ['single', 'gradient'],
        defaultValue: [
          { color: '#FF0000', percent: 0 },
          { color: '#0000FF', percent: 100 },
        ],
        open: true,
        onChange,
      },
    })
    await flushColorPickerTimer()

    const singleInput = document.querySelector<HTMLElement>('.ant-segmented-item-input')
    expect(singleInput).toBeTruthy()
    singleInput?.click()
    await flushColorPickerTimer()

    expect(onChange).toHaveBeenCalled()
    // @ts-expect-error esnext
    const cssValue = onChange.mock.calls.at(-1)?.[1]
    expect(cssValue).toBe('rgb(255,0,0)')
  })

  it('removes active gradient point by keyboard delete', async () => {
    const onChange = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: ['single', 'gradient'],
        defaultValue: [
          { color: '#FF0000', percent: 0 },
          { color: '#00FF00', percent: 50 },
          { color: '#0000FF', percent: 100 },
        ],
        open: true,
        onChange,
      },
    })
    await flushColorPickerTimer()

    const handle = document.querySelector<HTMLElement>('.ant-slider-handle-1')
    expect(handle).toBeTruthy()
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
    await flushColorPickerTimer()

    expect(onChange).toHaveBeenCalled()
    // @ts-expect-error esnext
    const cssValue = String(onChange.mock.calls.at(-1)?.[1] ?? '')
    expect(cssValue).toContain('linear-gradient')
    expect(cssValue).toContain('rgb(0,255,0)')
  })

  // https://github.com/ant-design/ant-design/pull/59837
  it.each(['Delete', 'Backspace'])('keeps at least two gradient stops on %s', async (key) => {
    const onChange = vi.fn()
    const onChangeComplete = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: 'gradient',
        defaultValue: [
          { color: '#ff0000', percent: 0 },
          { color: '#0000ff', percent: 100 },
        ],
        open: true,
        onChange,
        onChangeComplete,
      },
    })
    await flushColorPickerTimer()

    document.querySelectorAll<HTMLElement>('.ant-color-picker-gradient-slider [role="slider"]').forEach((handle) => {
      handle.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    })
    await flushColorPickerTimer()

    expect(document.querySelectorAll('.ant-color-picker-gradient-slider [role="slider"]')).toHaveLength(2)
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeComplete).not.toHaveBeenCalled()
  })

  it('can delete the last of three stops and keep editing the remaining gradient', async () => {
    const onChange = vi.fn()
    const onChangeComplete = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: 'gradient',
        defaultValue: [
          { color: '#ff0000', percent: 0 },
          { color: '#00ff00', percent: 50 },
          { color: '#0000ff', percent: 100 },
        ],
        open: true,
        onChange,
        onChangeComplete,
      },
    })
    await flushColorPickerTimer()

    const lastHandle = document.querySelector<HTMLElement>('.ant-slider-handle-3')!
    lastHandle.focus()
    await flushColorPickerTimer()
    lastHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
    await flushColorPickerTimer()

    expect(document.querySelectorAll('.ant-color-picker-gradient-slider [role="slider"]')).toHaveLength(2)
    // @ts-expect-error esnext
    expect(onChange.mock.calls.at(-1)?.[1]).toBe('linear-gradient(90deg, rgb(255,0,0) 0%, rgb(0,255,0) 50%)')
    // @ts-expect-error esnext
    expect(onChangeComplete.mock.calls.at(-1)?.[0].getColors()).toHaveLength(2)

    const hexInput = document.querySelector<HTMLInputElement>('.ant-color-picker-hex-input input')!
    hexInput.value = 'ffffff'
    hexInput.dispatchEvent(new Event('input', { bubbles: true }))
    hexInput.dispatchEvent(new Event('change', { bubbles: true }))
    await flushColorPickerTimer()

    // @ts-expect-error esnext
    expect(onChange.mock.calls.at(-1)?.[1]).toBe('linear-gradient(90deg, rgb(255,0,0) 0%, rgb(255,255,255) 50%)')
  })

  it('falls back to gradient mode when only gradient is configured', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: ['gradient'],
        defaultValue: '#F00',
        open: true,
      },
    })
    await flushColorPickerTimer()

    expect(document.querySelector('.ant-color-picker-gradient-slider')).toBeTruthy()
  })

  it('does not crash with empty gradient value', async () => {
    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: {
        mode: ['single', 'gradient'],
        defaultValue: [],
        open: true,
      },
    })

    await flushColorPickerTimer()
    expect(document.querySelector('.ant-color-picker')).toBeTruthy()
    wrapper.unmount()
  })
})
