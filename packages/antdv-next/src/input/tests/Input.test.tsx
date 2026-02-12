import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Input from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('input', () => {
  rtlTest(() => h(Input))

  it('should render correctly', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('.ant-input').exists()).toBe(true)
  })

  it('should support v-model:value', async () => {
    const value = ref('')
    const wrapper = mount(() => (
      <Input v-model:value={value.value} />
    ))

    const input = wrapper.find('input')
    await input.setValue('test')
    expect(value.value).toBe('test')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(Input, {
      props: {
        defaultValue: 'default text',
      },
    })
    expect(wrapper.find('input').element.value).toBe('default text')
  })

  it('should support placeholder', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: 'Enter text',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
  })

  it('should support disabled', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-input-disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('should support readonly', () => {
    const wrapper = mount(Input, {
      props: {
        readonly: true,
      },
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('should support allowClear', async () => {
    const wrapper = mount(Input, {
      props: {
        allowClear: true,
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-input-clear-icon').exists()).toBe(true)
  })

  it('should trigger onClear when clear button is clicked', async () => {
    const onClear = vi.fn()
    const wrapper = mount(Input, {
      props: {
        allowClear: true,
        value: 'test',
        onClear,
      },
    })

    await wrapper.find('.ant-input-clear-icon').trigger('click')
    expect(onClear).toHaveBeenCalled()
  })

  it('should support status prop', () => {
    const wrapper = mount(Input, {
      props: {
        status: 'error',
      },
    })
    expect(wrapper.find('.ant-input-status-error').exists()).toBe(true)
  })

  it('should support warning status', () => {
    const wrapper = mount(Input, {
      props: {
        status: 'warning',
      },
    })
    expect(wrapper.find('.ant-input-status-warning').exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(Input, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-input-lg').exists()).toBe(true)

    const wrapperSmall = mount(Input, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-input-sm').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Input, {
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
    const wrapper = mount(Input, {
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

  it('should support onPressEnter', async () => {
    const onPressEnter = vi.fn()
    const wrapper = mount(Input, {
      props: {
        onPressEnter,
      },
    })

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(onPressEnter).toHaveBeenCalled()
  })

  it('should support id prop', () => {
    const wrapper = mount(Input, {
      props: {
        id: 'test-id',
      },
    })
    expect(wrapper.find('#test-id').exists()).toBe(true)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Input
        data-test="test-id"
        data-id="12345"
      />
    ))
    const input = wrapper.find('.ant-input')
    expect(input.attributes('data-test')).toBe('test-id')
    expect(input.attributes('data-id')).toBe('12345')
  })

  it('should support variant prop', () => {
    const wrapperOutlined = mount(Input, {
      props: { variant: 'outlined' },
    })
    expect(wrapperOutlined.find('.ant-input-outlined').exists()).toBe(true)

    const wrapperFilled = mount(Input, {
      props: { variant: 'filled' },
    })
    expect(wrapperFilled.find('.ant-input-filled').exists()).toBe(true)

    const wrapperBorderless = mount(Input, {
      props: { variant: 'borderless' },
    })
    expect(wrapperBorderless.find('.ant-input-borderless').exists()).toBe(true)
  })

  it('should support prefix and suffix', () => {
    const wrapper = mount(Input, {
      props: {
        prefix: 'Icon',
        suffix: 'Suffix',
      },
    })
    expect(wrapper.find('.ant-input-prefix').exists()).toBe(true)
    expect(wrapper.find('.ant-input-suffix').exists()).toBe(true)
  })

  it('should support maxlength', () => {
    const wrapper = mount(Input, {
      props: {
        maxlength: 10,
      },
    })
    expect(wrapper.find('input').attributes('maxlength')).toBe('10')
  })

  it('should support showCount', () => {
    const wrapper = mount(Input, {
      props: {
        showCount: true,
        maxlength: 10,
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-input-show-count-suffix').exists()).toBe(true)
  })

  it('should support type prop', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'email',
      },
    })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('should support autoFocus', () => {
    const wrapper = mount(Input, {
      props: {
        autoFocus: true,
      },
    })
    expect(wrapper.find('input').attributes('autofocus')).toBe('true')
  })
})
