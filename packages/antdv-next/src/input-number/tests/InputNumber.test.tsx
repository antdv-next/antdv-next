import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import InputNumber from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('inputNumber', () => {
  rtlTest(() => h(InputNumber))

  it('should render correctly', () => {
    const wrapper = mount(InputNumber)
    expect(wrapper.find('.ant-input-number').exists()).toBe(true)
  })

  it('should support v-model:value', async () => {
    const value = ref<number | null>(null)
    const wrapper = mount(() => (
      <InputNumber v-model:value={value.value} />
    ))

    const input = wrapper.find('input')
    await input.setValue('123')
    await nextTick()

    expect(value.value).toBe(123)
  })

  it('should support defaultValue', () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: 10,
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('10')
  })

  it('should support disabled', () => {
    const wrapper = mount(InputNumber, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-input-number-disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('should support readOnly', () => {
    const wrapper = mount(InputNumber, {
      props: {
        readOnly: true,
      },
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('should support min and max', () => {
    const wrapper = mount(InputNumber, {
      props: {
        min: 0,
        max: 10,
      },
    })
    expect(wrapper.find('.ant-input-number').exists()).toBe(true)
  })

  it('should support step', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: 0,
        step: 0.1,
        controls: true,
      },
    })

    const actionsElement = wrapper.find('.ant-input-number-actions')
    expect(actionsElement.exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(InputNumber, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-input-number-lg').exists()).toBe(true)

    const wrapperSmall = mount(InputNumber, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-input-number-sm').exists()).toBe(true)
  })

  it('should support status prop', () => {
    const wrapperError = mount(InputNumber, {
      props: { status: 'error' },
    })
    expect(wrapperError.find('.ant-input-number-status-error').exists()).toBe(true)

    const wrapperWarning = mount(InputNumber, {
      props: { status: 'warning' },
    })
    expect(wrapperWarning.find('.ant-input-number-status-warning').exists()).toBe(true)
  })

  it('should support variant prop', () => {
    const wrapperOutlined = mount(InputNumber, {
      props: { variant: 'outlined' },
    })
    expect(wrapperOutlined.find('.ant-input-number-outlined').exists()).toBe(true)

    const wrapperFilled = mount(InputNumber, {
      props: { variant: 'filled' },
    })
    expect(wrapperFilled.find('.ant-input-number-filled').exists()).toBe(true)

    const wrapperBorderless = mount(InputNumber, {
      props: { variant: 'borderless' },
    })
    expect(wrapperBorderless.find('.ant-input-number-borderless').exists()).toBe(true)
  })

  it('should support prefix and suffix', () => {
    const wrapper = mount(InputNumber, {
      props: {
        prefix: '$',
        suffix: 'RMB',
      },
    })
    expect(wrapper.find('.ant-input-number-prefix').exists()).toBe(true)
    expect(wrapper.find('.ant-input-number-suffix').exists()).toBe(true)
  })

  it('should support controls prop', () => {
    const wrapperWithControls = mount(InputNumber, {
      props: { controls: true },
    })
    expect(wrapperWithControls.find('.ant-input-number-actions').exists()).toBe(true)

    const wrapperWithoutControls = mount(InputNumber, {
      props: { controls: false },
    })
    expect(wrapperWithoutControls.find('.ant-input-number-without-controls').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(InputNumber, {
      props: {
        onChange,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('123')
    await nextTick()

    expect(onChange).toHaveBeenCalled()
  })

  it('should support onFocus and onBlur events', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(InputNumber, {
      props: {
        onFocus,
        onBlur,
      },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    input.element.focus()
    await nextTick()
    expect(onFocus).toHaveBeenCalled()

    input.element.blur()
    await nextTick()
    expect(onBlur).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('should support id prop', () => {
    const wrapper = mount(InputNumber, {
      props: {
        id: 'test-input-number',
      },
    })
    expect(wrapper.find('#test-input-number').exists()).toBe(true)
  })

  it('should support data attributes on input', () => {
    const wrapper = mount(InputNumber, {
      attrs: {
        'data-test': 'test-id',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('data-test')).toBe('test-id')
  })

  it('should support precision', () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: 1.234,
        precision: 2,
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('1.23')
  })

  it('should support formatter and parser', () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: 1000,
        formatter: (value: string) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value: string | undefined) => value?.replace(/\$\s?|(,*)/g, '') ?? '',
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('$ 1,000')
  })

  it('should support keyboard prop', () => {
    const wrapper = mount(InputNumber, {
      props: {
        keyboard: false,
      },
    })
    expect(wrapper.find('.ant-input-number').exists()).toBe(true)
  })

  it('should support stringMode', () => {
    const wrapper = mount(InputNumber, {
      props: {
        stringMode: true,
        value: '1.0000000000000001',
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('1.0000000000000001')
  })
})
