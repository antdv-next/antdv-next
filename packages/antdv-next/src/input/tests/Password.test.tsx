import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Input from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const { Password } = Input as any

describe('password', () => {
  rtlTest(() => h(Password))

  it('should render correctly', () => {
    const wrapper = mount(Password)
    expect(wrapper.find('.ant-input-password').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('should support v-model:value', async () => {
    const value = ref('')
    const wrapper = mount(() => (
      <Password v-model:value={value.value} />
    ))

    const input = wrapper.find('input')
    await input.setValue('secret123')
    expect(value.value).toBe('secret123')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(Password, {
      props: {
        defaultValue: 'secret',
      },
    })
    expect(wrapper.find('input').element.value).toBe('secret')
  })

  it('should support placeholder', () => {
    const wrapper = mount(Password, {
      props: {
        placeholder: 'Enter password',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter password')
  })

  it('should support disabled', () => {
    const wrapper = mount(Password, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-input-disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('should toggle visibility on click', async () => {
    const wrapper = mount(Password, {
      props: {
        value: 'secret',
      },
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')

    await wrapper.find('.ant-input-password-icon').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.find('.ant-input-password-icon').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('should support visibilityToggle=false', () => {
    const wrapper = mount(Password, {
      props: {
        visibilityToggle: false,
      },
    })
    expect(wrapper.find('.ant-input-password-icon').exists()).toBe(false)
  })

  it('should support controlled visibility', async () => {
    const visible = ref(false)
    const wrapper = mount(() => (
      <Password
        value="secret"
        visibilityToggle={{ visible: visible.value, onVisibleChange: (v: boolean) => { visible.value = v } }}
      />
    ))

    expect(wrapper.find('input').attributes('type')).toBe('password')

    visible.value = true
    await nextTick()
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('should support action=hover', async () => {
    const wrapper = mount(Password, {
      props: {
        value: 'secret',
        action: 'hover',
      },
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')

    await wrapper.find('.ant-input-password-icon').trigger('mouseover')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('should support status prop', () => {
    const wrapper = mount(Password, {
      props: {
        status: 'error',
      },
    })
    expect(wrapper.find('.ant-input-status-error').exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(Password, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-input-password-large').exists()).toBe(true)

    const wrapperSmall = mount(Password, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-input-password-small').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Password, {
      props: {
        onChange,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    expect(onChange).toHaveBeenCalled()
  })

  it('should support onBlur and onFocus', async () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(Password, {
      props: {
        onBlur,
        onFocus,
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

  it('should support custom iconRender', () => {
    const wrapper = mount(Password, {
      props: {
        value: 'secret',
        iconRender: ({ visible }: { visible: boolean }) => (visible ? 'Show' : 'Hide'),
      },
    })
    expect(wrapper.find('.ant-input-password-icon').text()).toBe('Hide')
  })
})
