import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Input from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const { TextArea } = Input as any

describe('textArea', () => {
  rtlTest(() => h(TextArea))

  it('should render correctly', () => {
    const wrapper = mount(TextArea)
    expect(wrapper.find('.ant-input').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should support v-model:value', async () => {
    const value = ref('')
    const wrapper = mount(() => (
      <TextArea v-model:value={value.value} />
    ))

    const textarea = wrapper.find('textarea')
    await textarea.setValue('test content')
    expect(value.value).toBe('test content')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(TextArea, {
      props: {
        defaultValue: 'default text',
      },
    })
    expect(wrapper.find('textarea').element.value).toBe('default text')
  })

  it('should support placeholder', () => {
    const wrapper = mount(TextArea, {
      props: {
        placeholder: 'Enter text',
      },
    })
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text')
  })

  it('should support disabled', () => {
    const wrapper = mount(TextArea, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-input-disabled').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('should support readonly', () => {
    const wrapper = mount(TextArea, {
      props: {
        readonly: true,
      },
    })
    expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('should support allowClear', async () => {
    const wrapper = mount(TextArea, {
      props: {
        allowClear: true,
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-input-clear-icon').exists()).toBe(true)
  })

  it('should support status prop', () => {
    const wrapper = mount(TextArea, {
      props: {
        status: 'error',
      },
    })
    expect(wrapper.find('.ant-input-status-error').exists()).toBe(true)
  })

  it('should support warning status', () => {
    const wrapper = mount(TextArea, {
      props: {
        status: 'warning',
      },
    })
    expect(wrapper.find('.ant-input-status-warning').exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(TextArea, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-input-lg').exists()).toBe(true)

    const wrapperSmall = mount(TextArea, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-input-sm').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(TextArea, {
      props: {
        onChange,
      },
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('test')
    expect(onChange).toHaveBeenCalled()
  })

  it('should support onBlur and onFocus', async () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(TextArea, {
      props: {
        onBlur,
        onFocus,
      },
      attachTo: document.body,
    })

    const textarea = wrapper.find('textarea')
    textarea.element.focus()
    await nextTick()
    expect(onFocus).toHaveBeenCalled()

    textarea.element.blur()
    await nextTick()
    expect(onBlur).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should support onPressEnter', async () => {
    const onPressEnter = vi.fn()
    const wrapper = mount(TextArea, {
      props: {
        onPressEnter,
      },
    })

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(onPressEnter).toHaveBeenCalled()
  })

  it('should support variant prop', () => {
    const wrapperOutlined = mount(TextArea, {
      props: { variant: 'outlined' },
    })
    expect(wrapperOutlined.find('.ant-input-outlined').exists()).toBe(true)

    const wrapperFilled = mount(TextArea, {
      props: { variant: 'filled' },
    })
    expect(wrapperFilled.find('.ant-input-filled').exists()).toBe(true)

    const wrapperBorderless = mount(TextArea, {
      props: { variant: 'borderless' },
    })
    expect(wrapperBorderless.find('.ant-input-borderless').exists()).toBe(true)
  })

  it('should support rows prop', () => {
    const wrapper = mount(TextArea, {
      props: {
        rows: 5,
      },
    })
    expect(wrapper.find('textarea').attributes('rows')).toBe('5')
  })

  it('should support maxlength', () => {
    const wrapper = mount(TextArea, {
      props: {
        maxlength: 100,
      },
    })
    expect(wrapper.find('textarea').attributes('maxlength')).toBe('100')
  })

  it('should support showCount', () => {
    const wrapper = mount(TextArea, {
      props: {
        showCount: true,
        maxlength: 100,
        value: 'test',
      },
    })
    expect(wrapper.find('.ant-input-textarea-show-count').exists()).toBe(true)
  })

  it('should support autoSize', () => {
    const wrapper = mount(TextArea, {
      props: {
        autoSize: true,
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should support autoSize with min and max rows', () => {
    const wrapper = mount(TextArea, {
      props: {
        autoSize: { minRows: 2, maxRows: 6 },
      },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })
})
