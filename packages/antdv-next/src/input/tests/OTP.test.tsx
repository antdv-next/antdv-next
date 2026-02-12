import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Input from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const { OTP } = Input as any

describe('otp', () => {
  rtlTest(() => h(OTP))

  it('should render correctly', () => {
    const wrapper = mount(OTP)
    expect(wrapper.find('.ant-otp').exists()).toBe(true)
  })

  it('should render default 6 inputs', () => {
    const wrapper = mount(OTP)
    const inputs = wrapper.findAll('.ant-otp-input')
    expect(inputs.length).toBe(6)
  })

  it('should support custom length', () => {
    const wrapper = mount(OTP, {
      props: {
        length: 4,
      },
    })
    const inputs = wrapper.findAll('.ant-otp-input')
    expect(inputs.length).toBe(4)
  })

  it('should support v-model:value', async () => {
    const value = ref('')
    const wrapper = mount(() => (
      <OTP v-model:value={value.value} length={4} />
    ))

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('1')
    await inputs[1]!.setValue('2')
    await inputs[2]!.setValue('3')
    await inputs[3]!.setValue('4')

    expect(value.value).toBe('1234')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(OTP, {
      props: {
        defaultValue: '123456',
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[0]!.element.value).toBe('1')
    expect(inputs[1]!.element.value).toBe('2')
    expect(inputs[2]!.element.value).toBe('3')
  })

  it('should support disabled', () => {
    const wrapper = mount(OTP, {
      props: {
        disabled: true,
      },
    })
    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  it('should support status prop', () => {
    const wrapper = mount(OTP, {
      props: {
        status: 'error',
      },
    })
    expect(wrapper.find('.ant-input-status-error').exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(OTP, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-otp-lg').exists()).toBe(true)

    const wrapperSmall = mount(OTP, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-otp-sm').exists()).toBe(true)
  })

  it('should support variant prop', () => {
    const wrapperOutlined = mount(OTP, {
      props: { variant: 'outlined' },
    })
    expect(wrapperOutlined.find('.ant-input-outlined').exists()).toBe(true)

    const wrapperFilled = mount(OTP, {
      props: { variant: 'filled' },
    })
    expect(wrapperFilled.find('.ant-input-filled').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(OTP, {
      props: {
        length: 4,
        onChange,
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('1')
    await inputs[1]!.setValue('2')
    await inputs[2]!.setValue('3')
    await inputs[3]!.setValue('4')

    expect(onChange).toHaveBeenCalledWith('1234')
  })

  it('should support onInput event', async () => {
    const onInput = vi.fn()
    const wrapper = mount(OTP, {
      props: {
        length: 4,
        onInput,
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('1')

    expect(onInput).toHaveBeenCalled()
  })

  it('should support mask', () => {
    const wrapper = mount(OTP, {
      props: {
        mask: true,
        value: '123456',
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[0]!.attributes('type')).toBe('password')
  })

  it('should support custom mask character', () => {
    const wrapper = mount(OTP, {
      props: {
        mask: '*',
        value: '123456',
      },
    })
    expect(wrapper.find('.ant-otp-mask-icon').exists()).toBe(true)
  })

  it('should support separator', () => {
    const wrapper = mount(OTP, {
      props: {
        separator: '-',
        length: 4,
      },
    })
    const separators = wrapper.findAll('.ant-otp-separator')
    expect(separators.length).toBe(3)
    expect(separators[0]!.text()).toBe('-')
  })

  it('should support separator as function', () => {
    const wrapper = mount(OTP, {
      props: {
        separator: ({ index }: { index: number }) => (index === 1 ? '-' : ''),
        length: 4,
      },
    })
    const separators = wrapper.findAll('.ant-otp-separator')
    expect(separators.length).toBe(1)
  })

  it('should support formatter', async () => {
    const formatter = (value: string) => value.toUpperCase()
    const value = ref('')
    const wrapper = mount(() => (
      <OTP v-model:value={value.value} formatter={formatter} length={4} />
    ))

    const inputs = wrapper.findAll('input')
    await inputs[0]!.setValue('a')

    expect(value.value).toBe('A')
  })

  it('should auto focus next input', async () => {
    const wrapper = mount(OTP, {
      props: {
        length: 4,
      },
      attachTo: document.body,
    })

    const inputs = wrapper.findAll('input')
    inputs[0]!.element.focus()
    await inputs[0]!.setValue('1')
    await nextTick()

    // The focus should move to the next input
    expect(document.activeElement).toBe(inputs[1]!.element)
    wrapper.unmount()
  })

  it('should support autoFocus', () => {
    const wrapper = mount(OTP, {
      props: {
        autoFocus: true,
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0]!.attributes('autofocus')).toBe('true')
  })
})
