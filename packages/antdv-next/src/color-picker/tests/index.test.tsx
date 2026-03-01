import type { FormInstance } from '../../form'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive, shallowRef } from 'vue'
import ColorPicker from '..'
import Form, { FormItem } from '../../form'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushColorPickerTimer() {
  await waitFakeTimer(150, 10)
  await nextTick()
}

function expectColorPickerClosed() {
  const picker = document.querySelector<HTMLElement>('.ant-color-picker')
  if (!picker) {
    expect(picker).toBeNull()
    return
  }
  expect(getComputedStyle(picker).display).toBe('none')
}

describe('color-picker', () => {
  mountTest(ColorPicker)
  rtlTest(ColorPicker)

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

  it('renders trigger correctly', () => {
    const wrapper = mount(ColorPicker)
    expect(wrapper.find('.ant-color-picker-trigger').exists()).toBe(true)
  })

  it('supports defaultValue color', () => {
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#000000' },
    })
    const style = wrapper.find('.ant-color-picker-color-block-inner').attributes('style')
    expect(style).toContain('background: rgb(0, 0, 0)')
  })

  it('supports custom trigger slot', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      slots: {
        default: () => <span class="custom-trigger">open</span>,
      },
    })
    await flushColorPickerTimer()

    const customTrigger = document.querySelector<HTMLElement>('.custom-trigger')
    expect(customTrigger).toBeTruthy()
    customTrigger?.click()
    await flushColorPickerTimer()

    expect(document.querySelector('.ant-color-picker')).toBeTruthy()
  })

  it('supports controlled open state', async () => {
    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: false,
      },
    })
    await flushColorPickerTimer()

    expectColorPickerClosed()

    await wrapper.setProps({ open: true })
    await flushColorPickerTimer()
    expect(document.querySelector('.ant-color-picker')).toBeTruthy()

    await wrapper.setProps({ open: false })
    await flushColorPickerTimer()
    expectColorPickerClosed()
  })

  it('does not open popup when disabled', async () => {
    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: { disabled: true },
    })
    expect(wrapper.find('.ant-color-picker-trigger-disabled').exists()).toBe(true)

    await wrapper.find('.ant-color-picker-trigger').trigger('click')
    await flushColorPickerTimer()
    expect(document.querySelector('.ant-color-picker')).toBeFalsy()
  })

  it('supports allowClear and onClear', async () => {
    const onClear = vi.fn()
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        defaultValue: '#1677ff',
        allowClear: true,
        onClear,
      },
    })
    await flushColorPickerTimer()

    const clearBtn = document.querySelector<HTMLElement>('.ant-color-picker-operation .ant-color-picker-clear')
    expect(clearBtn).toBeTruthy()
    clearBtn?.click()
    await flushColorPickerTimer()

    expect(onClear).toHaveBeenCalledTimes(1)
    expect(
      document.querySelector<HTMLInputElement>('.ant-color-picker-alpha-input input')?.value,
    ).toContain('0')
  })

  it('switches format input by controlled format prop', async () => {
    const wrapper = mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        format: 'hex',
      },
    })
    await flushColorPickerTimer()
    expect(document.querySelector('.ant-color-picker-hex-input')).toBeTruthy()

    await wrapper.setProps({ format: 'hsb' })
    await nextTick()
    expect(document.querySelector('.ant-color-picker-hsb-input')).toBeTruthy()

    await wrapper.setProps({ format: 'rgb' })
    await nextTick()
    expect(document.querySelector('.ant-color-picker-rgb-input')).toBeTruthy()
  })

  it('supports showText as render function', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: '#1677ff',
        showText: (ctx: any) => {
          return ctx.color?.toHexString?.() || ctx.color?.color?.toHexString?.() || ''
        },
      },
    })

    expect(wrapper.find('.ant-color-picker-trigger-text').text()).toBe('#1677ff')
  })

  it('shows transparent text for null defaultValue', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: null,
        showText: true,
      },
    })

    expect(wrapper.find('.ant-color-picker-trigger-text').text()).toBe('Transparent')
  })

  it('updates showText when controlled format changes', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: '#1677ff',
        showText: true,
        format: 'hex',
      },
    })

    expect(wrapper.find('.ant-color-picker-trigger-text').text()).toBe('#1677FF')

    await wrapper.setProps({ format: 'rgb' })
    await nextTick()
    expect(wrapper.find('.ant-color-picker-trigger-text').text()).toBe('rgb(22,119,255)')

    await wrapper.setProps({ format: 'hsb' })
    await nextTick()
    expect(wrapper.find('.ant-color-picker-trigger-text').text()).toBe('hsb(215, 91%, 100%)')
  })

  it('supports size classes', () => {
    const lg = mount(ColorPicker, { props: { size: 'large' } })
    expect(lg.find('.ant-color-picker-lg').exists()).toBe(true)
    lg.unmount()

    const sm = mount(ColorPicker, { props: { size: 'small' } })
    expect(sm.find('.ant-color-picker-sm').exists()).toBe(true)
  })

  it('supports panelRender', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        panelRender: ({ panel }) => <div class="custom-panel">{panel}</div>,
      },
    })
    await flushColorPickerTimer()

    expect(document.querySelector('.custom-panel')).toBeTruthy()
    expect(document.querySelector('.ant-color-picker-inner-content')).toBeTruthy()
  })

  it('supports panelRender with components API', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        panelRender: ({ extra }) => (
          <div class="custom-panel-components">
            <extra.components.Picker />
            <extra.components.Presets />
          </div>
        ),
      },
    })
    await flushColorPickerTimer()

    expect(document.querySelector('.custom-panel-components')).toBeTruthy()
    expect(document.querySelector('.ant-color-picker-inner')).toBeTruthy()
    expect(document.querySelector('.ant-color-picker-inner-content')).toBeFalsy()
  })

  it('handles null value state and recovers alpha after valid hex input', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        defaultValue: null,
      },
    })
    await flushColorPickerTimer()

    const alphaInput = document.querySelector<HTMLInputElement>('.ant-color-picker-alpha-input input')
    const hexInput = document.querySelector<HTMLInputElement>('.ant-color-picker-hex-input input')
    expect(alphaInput?.value).toContain('0')
    expect(hexInput?.value.toLowerCase()).toContain('000000')

    if (hexInput) {
      hexInput.value = '#273B57'
      hexInput.dispatchEvent(new Event('input', { bubbles: true }))
      hexInput.dispatchEvent(new Event('change', { bubbles: true }))
    }
    await flushColorPickerTimer()

    expect(document.querySelector<HTMLInputElement>('.ant-color-picker-alpha-input input')?.value).toContain(
      '100',
    )
  })

  it('supports disabledAlpha', async () => {
    mount(ColorPicker, {
      attachTo: document.body,
      props: {
        open: true,
        disabledAlpha: true,
      },
    })
    await flushColorPickerTimer()

    expect(document.querySelector('.ant-color-picker-slider-group-disabled-alpha')).toBeTruthy()
    expect(document.querySelector('.ant-color-picker-slider-alpha')).toBeFalsy()
    expect(document.querySelector('.ant-color-picker-alpha-input')).toBeFalsy()
  })

  it('supports required validation in Form', async () => {
    const formRef = shallowRef<FormInstance>()
    const Demo = {
      setup() {
        const model = reactive<{ color: string | null }>({ color: null })
        return () => (
          <Form ref={formRef} model={model}>
            <FormItem
              name="color"
              label="ColorPicker"
              rules={[{ required: true, message: 'color is required!' }]}
            >
              <ColorPicker />
            </FormItem>
          </Form>
        )
      },
    }

    mount(Demo, { attachTo: document.body })
    await flushColorPickerTimer()

    let errorInfo: any
    try {
      await formRef.value?.validateFields([['color']])
    }
    catch (err) {
      errorInfo = err
    }
    expect(errorInfo?.errorFields?.[0]?.name).toEqual(['color'])
    expect(document.querySelector('.ant-form-item-explain-error')?.textContent).toBe(
      'color is required!',
    )
  })
})
