import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Checkbox, { CheckboxGroup } from '..'
import ConfigProvider from '../../config-provider'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('checkbox', () => {
  rtlTest(() => h(Checkbox))

  // ============ Basic rendering ============

  it('should render correctly', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.find('.ant-checkbox-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-checkbox').exists()).toBe(true)
    expect(wrapper.find('.ant-checkbox-input').exists()).toBe(true)
  })

  it('should render with label', () => {
    const wrapper = mount(Checkbox, {
      slots: { default: () => 'Checkbox' },
    })
    expect(wrapper.find('.ant-checkbox-label').exists()).toBe(true)
    expect(wrapper.find('.ant-checkbox-label').text()).toBe('Checkbox')
  })

  it('should not render label when no children', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.find('.ant-checkbox-label').exists()).toBe(false)
  })

  // ============ Checked ============

  it('should support checked prop', () => {
    const wrapper = mount(Checkbox, {
      props: { checked: true },
    })
    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)
  })

  it('should support defaultChecked', () => {
    const wrapper = mount(Checkbox, {
      props: { defaultChecked: true },
    })
    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)
  })

  it('should emit update:checked when clicked', async () => {
    const onUpdateChecked = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        'onUpdate:checked': onUpdateChecked,
      },
      slots: { default: () => 'Checkbox' },
    })

    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(onUpdateChecked).toHaveBeenCalled()
  })

  it('should emit change event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Checkbox, {
      props: { onChange },
      slots: { default: () => 'Checkbox' },
    })

    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(onChange).toHaveBeenCalled()
  })

  it('should keep checked state when controlled checked is provided', async () => {
    const onUpdateChecked = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        checked: true,
        'onUpdate:checked': onUpdateChecked,
      },
      slots: { default: () => 'Checkbox' },
    })

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)

    const input = wrapper.find('input').element as HTMLInputElement
    input.checked = false
    await wrapper.find('input').trigger('change')
    await nextTick()

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)
    expect(onUpdateChecked).toHaveBeenCalled()
  })

  it('should manage checked state internally when checked is undefined', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        checked: undefined,
      },
      slots: { default: () => 'Checkbox' },
    })

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(false)

    const input = wrapper.find('input').element as HTMLInputElement
    input.checked = true
    await wrapper.find('input').trigger('change')
    await nextTick()

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)

    input.checked = false
    await wrapper.find('input').trigger('change')
    await nextTick()

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(false)
  })

  it('should clear checked state when controlled checked path becomes undefined', async () => {
    const data = ref<Record<string, any>>({ checked: true })
    const wrapper = mount(() => (
      <Checkbox
        checked={data.value.checked}
        defaultChecked
        {...{
          'onUpdate:checked': (val: any) => {
            data.value.checked = val
          },
        }}
      >
        Checkbox
      </Checkbox>
    ))

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(true)

    data.value = {}
    await nextTick()

    expect(wrapper.find('.ant-checkbox-wrapper-checked').exists()).toBe(false)
  })

  // ============ Disabled ============

  it('should support disabled', () => {
    const wrapper = mount(Checkbox, {
      props: { disabled: true },
    })
    expect(wrapper.find('.ant-checkbox-wrapper-disabled').exists()).toBe(true)
    expect(wrapper.find('.ant-checkbox-disabled').exists()).toBe(true)
  })

  // ============ Indeterminate ============

  it('should support indeterminate', () => {
    const wrapper = mount(Checkbox, {
      props: { indeterminate: true },
    })
    expect(wrapper.find('.ant-checkbox-indeterminate').exists()).toBe(true)
  })

  // ============ Custom values ============

  it('should support checkedValue and unCheckedValue', async () => {
    const onUpdateChecked = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        'checked': true,
        'checkedValue': 'yes',
        'unCheckedValue': 'no',
        'onUpdate:checked': onUpdateChecked,
      },
      slots: { default: () => 'Checkbox' },
    })

    // Uncheck: should emit unCheckedValue 'no'
    const input = wrapper.find('input').element as HTMLInputElement
    input.checked = false
    await wrapper.find('input').trigger('change')
    await nextTick()
    expect(onUpdateChecked).toHaveBeenCalledWith('no')
  })

  // ============ RTL ============

  it('should render rtl class', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Checkbox, null, { default: () => 'Checkbox' }),
      },
    })
    expect(wrapper.find('.ant-checkbox-rtl').exists()).toBe(true)
  })

  // ============ Expose ============

  it('should expose focus and blur methods', () => {
    const wrapper: any = mount(Checkbox)
    expect(typeof wrapper.vm.focus).toBe('function')
    expect(typeof wrapper.vm.blur).toBe('function')
  })

  it('should expose input ref', () => {
    const wrapper: any = mount(Checkbox)
    expect(wrapper.vm.input).toBeDefined()
  })

  // ============ Mouse events ============

  it('should emit mouseenter and mouseleave events', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const wrapper = mount(Checkbox, {
      props: { onMouseenter, onMouseleave },
    })

    await wrapper.find('label').trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalled()

    await wrapper.find('label').trigger('mouseleave')
    expect(onMouseleave).toHaveBeenCalled()
  })

  // ============ Snapshots ============

  it('should match snapshot - basic', () => {
    const wrapper = mount(() => <Checkbox>Checkbox</Checkbox>)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - checked', () => {
    const wrapper = mount(() => <Checkbox checked>Checkbox</Checkbox>)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - disabled', () => {
    const wrapper = mount(() => <Checkbox disabled>Checkbox</Checkbox>)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - indeterminate', () => {
    const wrapper = mount(() => <Checkbox indeterminate>Checkbox</Checkbox>)
    expect(wrapper.html()).toMatchSnapshot()
  })
})

// ============ CheckboxGroup tests ============

describe('checkboxGroup', () => {
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ]

  it('should render correctly', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options },
    })
    expect(wrapper.find('.ant-checkbox-group').exists()).toBe(true)
    const items = wrapper.findAll('.ant-checkbox-wrapper')
    expect(items.length).toBe(3)
  })

  it('should render string options', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options: ['Apple', 'Pear', 'Orange'] },
    })
    const items = wrapper.findAll('.ant-checkbox-wrapper')
    expect(items.length).toBe(3)
    expect(items![0]!.text()).toBe('Apple')
  })

  it('should render number options', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options: [1, 2, 3] },
    })
    const items = wrapper.findAll('.ant-checkbox-wrapper')
    expect(items.length).toBe(3)
    expect(items![0]!.text()).toBe('1')
  })

  it('should support value prop', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options, value: ['Apple'] },
    })
    const checkedItems = wrapper.findAll('.ant-checkbox-wrapper-checked')
    expect(checkedItems.length).toBe(1)
  })

  it('should support defaultValue', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options, defaultValue: ['Apple', 'Pear'] },
    })
    const checkedItems = wrapper.findAll('.ant-checkbox-wrapper-checked')
    expect(checkedItems.length).toBe(2)
  })

  it('should support disabled', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options, disabled: true },
    })
    const disabledItems = wrapper.findAll('.ant-checkbox-wrapper-disabled')
    expect(disabledItems.length).toBe(3)
  })

  it('should support individual option disabled', () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        options: [
          { label: 'Apple', value: 'Apple' },
          { label: 'Pear', value: 'Pear', disabled: true },
          { label: 'Orange', value: 'Orange' },
        ],
      },
    })
    const disabledItems = wrapper.findAll('.ant-checkbox-wrapper-disabled')
    expect(disabledItems.length).toBe(1)
  })

  it('should emit update:value when option toggled', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(CheckboxGroup, {
      props: {
        'options': options,
        'onUpdate:value': onUpdateValue,
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs![0]!.trigger('change')
    await nextTick()

    expect(onUpdateValue).toHaveBeenCalled()
  })

  it('should emit change event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckboxGroup, {
      props: { options, onChange },
    })

    const inputs = wrapper.findAll('input')
    await inputs![0]!.trigger('change')
    await nextTick()

    expect(onChange).toHaveBeenCalled()
  })

  it('should clear checked values when controlled value path becomes undefined', async () => {
    const data = ref<Record<string, any>>({ value: ['Apple'] })
    const wrapper = mount(() => (
      <CheckboxGroup
        options={options}
        value={data.value.value}
        defaultValue={['Apple']}
        {...{
          'onUpdate:value': (val: any[]) => {
            data.value.value = val
          },
        }}
      />
    ))

    expect(wrapper.findAll('.ant-checkbox-wrapper-checked').length).toBe(1)

    data.value = {}
    await nextTick()

    expect(wrapper.findAll('.ant-checkbox-wrapper-checked').length).toBe(0)
  })

  it('should still toggle using internal state when onUpdate:value exists but value becomes undefined', async () => {
    const data = ref<Record<string, any>>({ value: ['Apple'] })
    const wrapper = mount(() => (
      <CheckboxGroup
        options={options}
        value={data.value.value}
        {...{
          'onUpdate:value': (val: any[]) => {
            data.value.value = val
          },
        }}
      />
    ))

    expect(wrapper.findAll('.ant-checkbox-wrapper-checked').length).toBe(1)

    data.value = {}
    await nextTick()
    expect(wrapper.findAll('.ant-checkbox-wrapper-checked').length).toBe(0)

    const inputs = wrapper.findAll('input')
    await inputs![1]!.trigger('change')
    await nextTick()

    expect(wrapper.findAll('.ant-checkbox-wrapper-checked').length).toBe(1)
    expect(wrapper.findAll('.ant-checkbox-wrapper-checked')[0]?.text()).toContain('Pear')
  })

  it('should support name prop', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options, name: 'fruits' },
    })
    // Name is passed to internal Checkbox components via group context
    const checkboxes = wrapper.findAll('.ant-checkbox-wrapper')
    expect(checkboxes.length).toBe(3)
    // Verify group renders all checkboxes correctly
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect(inputs.length).toBe(3)
  })

  it('should render with children slots', () => {
    const wrapper = mount(CheckboxGroup, {
      slots: {
        default: () => [
          h(Checkbox, { value: 'A' }, { default: () => 'A' }),
          h(Checkbox, { value: 'B' }, { default: () => 'B' }),
        ],
      },
    })
    const items = wrapper.findAll('.ant-checkbox-wrapper')
    expect(items.length).toBe(2)
  })

  it('should render rtl class', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(CheckboxGroup, { options }),
      },
    })
    expect(wrapper.find('.ant-checkbox-group-rtl').exists()).toBe(true)
  })

  it('should support role prop', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { options, role: 'group' },
    })
    expect(wrapper.find('.ant-checkbox-group').attributes('role')).toBe('group')
  })

  // ============ Group Snapshots ============

  it('should match snapshot - basic group', () => {
    const wrapper = mount(() => (
      <CheckboxGroup options={options} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - group with value', () => {
    const wrapper = mount(() => (
      <CheckboxGroup options={options} value={['Apple', 'Pear']} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - disabled group', () => {
    const wrapper = mount(() => (
      <CheckboxGroup options={options} disabled />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
