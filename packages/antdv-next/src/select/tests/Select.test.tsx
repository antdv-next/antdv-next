import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Select, { SelectOption } from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('select', () => {
  rtlTest(() => h(Select, { options: [{ value: 'test', label: 'Test' }] }))

  it('should render correctly', () => {
    const wrapper = mount(Select, {
      props: {
        options: [{ value: 'test', label: 'Test' }],
      },
    })
    expect(wrapper.find('.ant-select').exists()).toBe(true)
    expect(wrapper.find('.ant-select-single').exists()).toBe(true)
  })

  it('should support options prop', async () => {
    const wrapper = mount(Select, {
      props: {
        options: [
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'tom', label: 'Tom' },
        ],
        open: true,
      },
      attachTo: document.body,
    })

    await nextTick()
    const options = document.querySelectorAll('.ant-select-item-option')
    expect(options.length).toBe(3)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support v-model:value', async () => {
    const value = ref<string | undefined>(undefined)
    const wrapper = mount(() => (
      <Select
        v-model:value={value.value}
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
        ]}
        open
      />
    ), { attachTo: document.body })

    await nextTick()
    const options = document.querySelectorAll('.ant-select-item-option')
    ;(options[0] as HTMLElement).click()
    await nextTick()

    expect(value.value).toBe('jack')
    wrapper.unmount()
  })

  it('should support placeholder', () => {
    const wrapper = mount(Select, {
      props: {
        placeholder: 'Select a person',
      },
    })
    expect(wrapper.find('.ant-select-placeholder').exists()).toBe(true)
    expect(wrapper.find('.ant-select-placeholder').text()).toBe('Select a person')
  })

  it('should support disabled', () => {
    const wrapper = mount(Select, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('.ant-select-disabled').exists()).toBe(true)
  })

  it('should support allowClear', async () => {
    const wrapper = mount(Select, {
      props: {
        allowClear: true,
        value: 'test',
        options: [{ value: 'test', label: 'Test' }],
      },
    })
    expect(wrapper.find('.ant-select-clear').exists()).toBe(true)
  })

  it('should trigger onClear when clear button is clicked', async () => {
    const onClear = vi.fn()
    const wrapper = mount(Select, {
      props: {
        allowClear: true,
        value: 'test',
        options: [{ value: 'test', label: 'Test' }],
        onClear,
      },
    })

    await wrapper.find('.ant-select-clear').trigger('mousedown')
    expect(onClear).toHaveBeenCalled()
  })

  it('should support status prop', () => {
    const wrapper = mount(Select, {
      props: {
        status: 'error',
      },
    })
    expect(wrapper.find('.ant-select-status-error').exists()).toBe(true)
  })

  it('should support warning status', () => {
    const wrapper = mount(Select, {
      props: {
        status: 'warning',
      },
    })
    expect(wrapper.find('.ant-select-status-warning').exists()).toBe(true)
  })

  it('should support multiple mode', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: 'multiple',
        options: [
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
        ],
        open: true,
      },
      attachTo: document.body,
    })

    expect(wrapper.find('.ant-select-multiple').exists()).toBe(true)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support tags mode', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: 'tags',
        options: [{ value: 'test', label: 'Test' }],
      },
    })

    expect(wrapper.find('.ant-select-multiple').exists()).toBe(true)
  })

  it('should support size prop', () => {
    const wrapperLarge = mount(Select, {
      props: { size: 'large' },
    })
    expect(wrapperLarge.find('.ant-select-lg').exists()).toBe(true)

    const wrapperSmall = mount(Select, {
      props: { size: 'small' },
    })
    expect(wrapperSmall.find('.ant-select-sm').exists()).toBe(true)
  })

  it('should support onChange event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Select, {
      props: {
        options: [{ value: 'test', label: 'Test' }],
        open: true,
        onChange,
      },
      attachTo: document.body,
    })

    await nextTick()
    const option = document.querySelector('.ant-select-item-option')
    ;(option as HTMLElement)?.click()
    await nextTick()

    expect(onChange).toHaveBeenCalled()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support onSelect event', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Select, {
      props: {
        options: [{ value: 'test', label: 'Test' }],
        open: true,
        onSelect,
      },
      attachTo: document.body,
    })

    await nextTick()
    const option = document.querySelector('.ant-select-item-option')
    ;(option as HTMLElement)?.click()
    await nextTick()

    expect(onSelect).toHaveBeenCalled()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support onBlur and onFocus', async () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(Select, {
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

  it('should support defaultValue', () => {
    const wrapper = mount(Select, {
      props: {
        defaultValue: 'test',
        options: [{ value: 'test', label: 'Test' }],
      },
    })
    expect(wrapper.find('.ant-select-content-has-value').text()).toBe('Test')
  })

  it('should support id prop', () => {
    const wrapper = mount(Select, {
      props: {
        id: 'test-id',
      },
    })
    expect(wrapper.find('#test-id').exists()).toBe(true)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Select
        data-test="test-id"
        data-id="12345"
      />
    ))
    const select = wrapper.find('.ant-select')
    expect(select.attributes('data-test')).toBe('test-id')
    expect(select.attributes('data-id')).toBe('12345')
  })

  it('should support Option children', () => {
    const wrapper = mount(Select, {
      slots: {
        default: () => [
          h(SelectOption, { value: 'test1' }, () => 'Test 1'),
          h(SelectOption, { value: 'test2' }, () => 'Test 2'),
        ],
      },
    })
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('should support OptGroup', async () => {
    const wrapper = mount(Select, {
      props: {
        open: true,
        options: [
          {
            label: 'Group 1',
            options: [
              { value: 'test1', label: 'Test 1' },
            ],
          },
        ],
      },
      attachTo: document.body,
    })

    await nextTick()
    expect(document.querySelector('.ant-select-item-group')).toBeTruthy()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support showSearch', async () => {
    const wrapper = mount(Select, {
      props: {
        showSearch: true,
        options: [
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
        ],
      },
    })
    expect(wrapper.find('.ant-select-show-search').exists()).toBe(true)
  })

  it('should support prefix', () => {
    const wrapper = mount(Select, {
      props: {
        prefix: 'Icon',
      },
    })
    expect(wrapper.find('.ant-select-prefix').exists()).toBe(true)
  })

  it('should support variant prop', () => {
    const wrapperOutlined = mount(Select, {
      props: { variant: 'outlined' },
    })
    expect(wrapperOutlined.find('.ant-select-outlined').exists()).toBe(true)

    const wrapperFilled = mount(Select, {
      props: { variant: 'filled' },
    })
    expect(wrapperFilled.find('.ant-select-filled').exists()).toBe(true)

    const wrapperBorderless = mount(Select, {
      props: { variant: 'borderless' },
    })
    expect(wrapperBorderless.find('.ant-select-borderless').exists()).toBe(true)
  })

  it('should support maxCount in multiple mode', async () => {
    const value = ref(['jack'])
    const wrapper = mount(() => (
      <Select
        v-model:value={value.value}
        mode="multiple"
        maxCount={2}
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'tom', label: 'Tom' },
        ]}
      />
    ))

    expect(wrapper.find('.ant-select-multiple').exists()).toBe(true)
  })
})
