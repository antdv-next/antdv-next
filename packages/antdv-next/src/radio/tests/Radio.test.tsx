import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Radio, { RadioButton, RadioGroup } from '..'
import ConfigProvider from '../../config-provider'
import { useFormItemInputContextProvider } from '../../form/context'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-radio'
const groupPrefixCls = `${prefixCls}-group`

describe('radio', () => {
  mountTest(Radio)
  mountTest(RadioGroup)
  mountTest(RadioButton)
  rtlTest(() => h(Radio))
  rtlTest(() => h(RadioGroup))
  rtlTest(() => h(RadioButton))

  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  // ===================== Basic rendering =====================

  it('should render a label wrapper with radio input', () => {
    const wrapper = mount(Radio)
    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper`)
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
  })

  it('should render children in label span', () => {
    const wrapper = mount(Radio, {
      slots: { default: () => 'Option A' },
    })
    const label = wrapper.find(`.${prefixCls}-label`)
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Option A')
  })

  it('should not render label span when no children', () => {
    const wrapper = mount(Radio)
    expect(wrapper.find(`.${prefixCls}-label`).exists()).toBe(false)
  })

  it('should not render label span when children are empty', () => {
    const wrapper = mount(Radio, {
      slots: { default: () => '' },
    })
    expect(wrapper.find(`.${prefixCls}-label`).exists()).toBe(false)
  })

  // ===================== checked prop =====================

  it('should be checked when checked is true', () => {
    const wrapper = mount(Radio, {
      props: { checked: true },
    })
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  it('should not be checked when checked is false', () => {
    const wrapper = mount(Radio, {
      props: { checked: false },
    })
    expect(wrapper.find('label').classes()).not.toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== disabled prop =====================

  it('should add disabled class when disabled', () => {
    const wrapper = mount(Radio, {
      props: { disabled: true },
    })
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  it('should not be disabled by default', () => {
    const wrapper = mount(Radio)
    expect(wrapper.find('label').classes()).not.toContain(`${prefixCls}-wrapper-disabled`)
  })

  // ===================== DisabledContext =====================

  it('should inherit disabled from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentDisabled>
        <Radio>A</Radio>
      </ConfigProvider>
    ))
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  it('should use own disabled over context disabled', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentDisabled>
        <Radio disabled={false}>A</Radio>
      </ConfigProvider>
    ))
    expect(wrapper.find('label').classes()).not.toContain(`${prefixCls}-wrapper-disabled`)
  })

  // ===================== title prop =====================

  it('should set title attribute', () => {
    const wrapper = mount(Radio, {
      props: { title: 'my-title' },
    })
    expect(wrapper.find('label').attributes('title')).toBe('my-title')
  })

  // ===================== value prop =====================

  it('should use value to determine checked state in group', () => {
    const wrapper = mount(() => (
      <RadioGroup value="B">
        <Radio value="A">A</Radio>
        <Radio value="B">B</Radio>
      </RadioGroup>
    ))
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).not.toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== Events =====================

  it('should emit mouseenter and mouseleave events', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const wrapper = mount(Radio, {
      props: { onMouseenter, onMouseleave },
    })
    await wrapper.find('label').trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledTimes(1)

    await wrapper.find('label').trigger('mouseleave')
    expect(onMouseleave).toHaveBeenCalledTimes(1)
  })

  it('should emit change event', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Radio, {
      props: { onChange },
    })
    await wrapper.find('input').trigger('change')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  // ===================== rootClass =====================

  it('should apply rootClass', () => {
    const wrapper = mount(Radio, {
      props: { rootClass: 'custom-root' },
    })
    expect(wrapper.find('label').classes()).toContain('custom-root')
  })

  // ===================== Attrs passthrough =====================

  it('should pass style to label', () => {
    const wrapper = mount(() => <Radio style={{ color: 'red' }}>A</Radio>)
    expect(wrapper.find('label').attributes('style')).toContain('color: red')
  })

  it('should pass data attributes to label', () => {
    const wrapper = mount(() => <Radio data-testid="radio-1">A</Radio>)
    expect(wrapper.find('label').attributes('data-testid')).toBe('radio-1')
  })

  // ===================== RTL =====================

  it('should have rtl class in rtl direction', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Radio>A</Radio>
      </ConfigProvider>
    ))
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-rtl`)
  })

  // ===================== Form item context =====================

  it('should add in-form-item class when inside FormItem', () => {
    const FormItemProvider = defineComponent({
      setup(_, { slots }) {
        useFormItemInputContextProvider(ref({ isFormItemInput: true }))
        return () => slots.default?.()
      },
    })
    const wrapper = mount(() => (
      <FormItemProvider>
        <Radio>A</Radio>
      </FormItemProvider>
    ))
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-in-form-item`)
  })

  // ===================== expose =====================

  it('should expose focus and blur methods', () => {
    const wrapper = mount(Radio)
    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
  })

  // ===================== Static property =====================

  it('should have static __ANT_RADIO property', () => {
    expect((Radio as any).__ANT_RADIO).toBe(true)
  })

  it('should have static Button and Group properties', () => {
    expect((Radio as any).Button).toBe(RadioButton)
    expect((Radio as any).Group).toBe(RadioGroup)
  })

  // ===================== Snapshot =====================

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Radio value="A" checked>Option A</Radio>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})

describe('radio group', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  // ===================== Basic rendering =====================

  it('should render a div with group class', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.find('div').classes()).toContain(groupPrefixCls)
  })

  it('should render children radios', () => {
    const wrapper = mount(RadioGroup, {
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(2)
  })

  // ===================== defaultValue (uncontrolled) =====================

  it('should select radio matching defaultValue', () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'B' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).not.toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== value (controlled) =====================

  it('should be controlled by value prop', async () => {
    const wrapper = mount(RadioGroup, {
      props: { value: 'A' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).not.toContain(`${prefixCls}-wrapper-checked`)

    await wrapper.setProps({ value: 'B' })
    expect(labels[0].classes()).not.toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== change and update:value =====================

  it('should emit change and update:value when selecting a different radio', async () => {
    const onChange = vi.fn()
    const onUpdateValue = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { value: 'A', onChange, 'onUpdate:value': onUpdateValue },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    await inputs[1].trigger('change')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onUpdateValue).toHaveBeenCalledWith('B')
  })

  it('should not emit change when selecting the already selected radio', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { value: 'A', onChange },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('change')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should update internal value in uncontrolled mode', async () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'A' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    const labels = wrapper.findAll('label')

    await inputs[1].trigger('change')
    await nextTick()
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  it('should clear checked state when controlled value path becomes undefined', async () => {
    const data = ref<Record<string, any>>({ test: '1' })
    const wrapper = mount(() => (
      <RadioGroup
        value={data.value.test}
        defaultValue="1"
        {...{
          'onUpdate:value': (val: any) => {
            data.value.test = val
          },
        }}
      >
        <Radio value="1">One</Radio>
        <Radio value="2">Two</Radio>
      </RadioGroup>
    ))

    let labels = wrapper.findAll('label')
    expect(labels[0].classes()).toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).not.toContain(`${prefixCls}-wrapper-checked`)

    data.value = {}
    await nextTick()

    labels = wrapper.findAll('label')
    expect(labels[0].classes()).not.toContain(`${prefixCls}-wrapper-checked`)
    expect(labels[1].classes()).not.toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== disabled =====================

  it('should disable all radios when group is disabled', () => {
    const wrapper = mount(RadioGroup, {
      props: { disabled: true },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).toContain(`${prefixCls}-wrapper-disabled`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  // ===================== name =====================

  it('should pass name to all radios', () => {
    const wrapper = mount(RadioGroup, {
      props: { name: 'my-group' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    // VcCheckbox renders name on the wrapper span, not the native input
    wrapper.findAll(`.${prefixCls}`).forEach((radio) => {
      expect(radio.attributes('name')).toBe('my-group')
    })
  })

  // ===================== size =====================

  it.each(['large', 'small'] as const)('should apply %s size class', (size) => {
    const wrapper = mount(RadioGroup, {
      props: { size },
    })
    expect(wrapper.find('div').classes()).toContain(`${groupPrefixCls}-${size}`)
  })

  it('should inherit size from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="small">
        <RadioGroup>
          <Radio value="A">A</Radio>
        </RadioGroup>
      </ConfigProvider>
    ))
    expect(wrapper.find(`.${groupPrefixCls}`).classes()).toContain(`${groupPrefixCls}-small`)
  })

  // ===================== buttonStyle =====================

  it('should apply outline buttonStyle by default', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.find('div').classes()).toContain(`${groupPrefixCls}-outline`)
  })

  it('should apply solid buttonStyle', () => {
    const wrapper = mount(RadioGroup, {
      props: { buttonStyle: 'solid' },
    })
    expect(wrapper.find('div').classes()).toContain(`${groupPrefixCls}-solid`)
  })

  // ===================== optionType =====================

  it('should render button-style radios when optionType is button', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        optionType: 'button',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
        ],
      },
    })
    expect(wrapper.findAll(`.${prefixCls}-button-wrapper`).length).toBe(2)
  })

  // ===================== block =====================

  it('should apply block class', () => {
    const wrapper = mount(RadioGroup, {
      props: { block: true },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
        ],
      },
    })
    expect(wrapper.find('div').classes()).toContain(`${groupPrefixCls}-block`)
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-wrapper-block`)
  })

  // ===================== vertical =====================

  it('should apply vertical class', () => {
    const wrapper = mount(RadioGroup, {
      props: { vertical: true },
    })
    expect(wrapper.find('div').classes()).toContain(`${prefixCls}-group-vertical`)
  })

  // ===================== options prop =====================

  it('should render from string options', () => {
    const wrapper = mount(RadioGroup, {
      props: { options: ['Apple', 'Banana', 'Cherry'] },
    })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(3)
    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('Banana')
    expect(wrapper.text()).toContain('Cherry')
  })

  it('should render from number options', () => {
    const wrapper = mount(RadioGroup, {
      props: { options: [1, 2, 3] },
    })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(3)
  })

  it('should render from object options', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs.length).toBe(2)
    // Second option should be disabled
    const labels = wrapper.findAll('label')
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  it('should apply option style, class, title, id', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [
          { label: 'A', value: 'a', style: { color: 'red' }, class: 'opt-a', title: 'Option A', id: 'opt-a' },
        ],
      },
    })
    const label = wrapper.find('label')
    expect(label.attributes('style')).toContain('color: red')
    expect(label.classes()).toContain('opt-a')
    expect(label.attributes('title')).toBe('Option A')
  })

  it('should disable individual option when group is not disabled', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
        ],
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).not.toContain(`${prefixCls}-wrapper-disabled`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  it('should disable all options when group disabled overrides individual', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        disabled: true,
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: false },
        ],
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).toContain(`${prefixCls}-wrapper-disabled`)
    expect(labels[1].classes()).toContain(`${prefixCls}-wrapper-disabled`)
  })

  // ===================== labelRender =====================

  it('should support labelRender prop for object options', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        labelRender: ({ item, index }: { item: any, index: number }) => `Custom-${item.label}-${index}`,
      },
    })
    expect(wrapper.text()).toContain('Custom-A-0')
    expect(wrapper.text()).toContain('Custom-B-1')
  })

  it('should support labelRender prop for string options', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: ['X', 'Y'],
        labelRender: ({ item }: { item: any }) => `Prefix-${item.label}`,
      },
    })
    expect(wrapper.text()).toContain('Prefix-X')
    expect(wrapper.text()).toContain('Prefix-Y')
  })

  it('should support labelRender slot over prop', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        labelRender: () => 'FROM_PROP',
      },
      slots: {
        labelRender: ({ item }: { item: any }) => `FROM_SLOT_${item.label}`,
      },
    })
    expect(wrapper.text()).toContain('FROM_SLOT_A')
    expect(wrapper.text()).not.toContain('FROM_PROP')
  })

  // ===================== id =====================

  it('should apply id to the wrapper div', () => {
    const wrapper = mount(RadioGroup, {
      props: { id: 'my-radio-group' },
    })
    expect(wrapper.find('div').attributes('id')).toBe('my-radio-group')
  })

  // ===================== rootClass =====================

  it('should apply rootClass to the group', () => {
    const wrapper = mount(RadioGroup, {
      props: { rootClass: 'custom-group' },
    })
    expect(wrapper.find('div').classes()).toContain('custom-group')
  })

  // ===================== Attrs passthrough =====================

  it('should pass data and aria attributes', () => {
    const wrapper = mount(() => (
      <RadioGroup data-group="1" aria-label="radio group" />
    ))
    expect(wrapper.find('div').attributes('data-group')).toBe('1')
    expect(wrapper.find('div').attributes('aria-label')).toBe('radio group')
  })

  it('should pass style to the group div', () => {
    const wrapper = mount(() => (
      <RadioGroup style={{ marginTop: '10px' }} />
    ))
    expect(wrapper.find('div').attributes('style')).toContain('margin-top: 10px')
  })

  // ===================== RTL =====================

  it('should apply rtl class', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <RadioGroup>
          <Radio value="A">A</Radio>
        </RadioGroup>
      </ConfigProvider>
    ))
    expect(wrapper.find(`.${groupPrefixCls}`).classes()).toContain(`${groupPrefixCls}-rtl`)
  })

  // ===================== Events =====================

  it('should emit mouseenter and mouseleave', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { onMouseenter, onMouseleave },
    })
    await wrapper.find('div').trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledTimes(1)

    await wrapper.find('div').trigger('mouseleave')
    expect(onMouseleave).toHaveBeenCalledTimes(1)
  })

  it('should emit focus and blur', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { onFocus, onBlur },
    })
    await wrapper.find('div').trigger('focus')
    expect(onFocus).toHaveBeenCalledTimes(1)

    await wrapper.find('div').trigger('blur')
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  // ===================== value is null or undefined =====================

  it('should use defaultValue when value is undefined', () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'B' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    expect(wrapper.findAll('label')[1].classes()).toContain(`${prefixCls}-wrapper-checked`)
  })

  // ===================== Both radio and group onChange =====================

  it('should trigger both radio and group change events', async () => {
    const onRadioChange = vi.fn()
    const onGroupChange = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: { onChange: onGroupChange },
      slots: {
        default: () => [
          <Radio value="A" onChange={onRadioChange}>A</Radio>,
          <Radio value="B" onChange={onRadioChange}>B</Radio>,
        ],
      },
    })
    const inputs = wrapper.findAll('input')
    await inputs[1].trigger('change')
    expect(onRadioChange).toHaveBeenCalledTimes(1)
    expect(onGroupChange).toHaveBeenCalledTimes(1)
  })

  // ===================== Radio type should not be overridden =====================

  it('should always render input type as radio', () => {
    const wrapper = mount(RadioGroup, {
      slots: {
        default: () => [
          <Radio value="A" type="custom">A</Radio>,
        ],
      },
    })
    expect(wrapper.find('input').element.type).toBe('radio')
  })

  // ===================== only trigger once with options =====================

  it('should only trigger change once when using options', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RadioGroup, {
      props: {
        options: [{ label: 'Bamboo', value: 'Bamboo' }],
        onChange,
      },
    })
    await wrapper.find('input').trigger('change')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  // ===================== Snapshot =====================

  it('should match snapshot with options', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        value: 'B',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' },
        ],
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with children', () => {
    const wrapper = mount(RadioGroup, {
      props: { value: 'A' },
      slots: {
        default: () => [
          <Radio value="A">A</Radio>,
          <Radio value="B">B</Radio>,
        ],
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})

describe('radio button', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  // ===================== Basic rendering =====================

  it('should render as button type radio', () => {
    const wrapper = mount(() => (
      <RadioGroup>
        <RadioButton value="A">A</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.find(`.${prefixCls}-button-wrapper`).exists()).toBe(true)
  })

  it('should render children', () => {
    const wrapper = mount(() => (
      <RadioGroup>
        <RadioButton value="A">Option A</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.text()).toContain('Option A')
  })

  // ===================== Events =====================

  it('should trigger group onChange when button selected', async () => {
    const onChange = vi.fn()
    const wrapper = mount(() => (
      <RadioGroup onChange={onChange}>
        <RadioButton value="A">A</RadioButton>
        <RadioButton value="B">B</RadioButton>
      </RadioGroup>
    ))
    const inputs = wrapper.findAll('input')
    await inputs[1].trigger('change')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should forward attrs to inner Radio', () => {
    const wrapper = mount(() => (
      <RadioGroup>
        <RadioButton value="A" data-testid="btn-a">A</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.find('label').attributes('data-testid')).toBe('btn-a')
  })

  // ===================== Checked in group =====================

  it('should reflect group value', () => {
    const wrapper = mount(() => (
      <RadioGroup value="B">
        <RadioButton value="A">A</RadioButton>
        <RadioButton value="B">B</RadioButton>
      </RadioGroup>
    ))
    const labels = wrapper.findAll('label')
    expect(labels[0].classes()).not.toContain(`${prefixCls}-button-wrapper-checked`)
    expect(labels[1].classes()).toContain(`${prefixCls}-button-wrapper-checked`)
  })

  // ===================== Disabled =====================

  it('should be disabled when group is disabled', () => {
    const wrapper = mount(() => (
      <RadioGroup disabled>
        <RadioButton value="A">A</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.find('label').classes()).toContain(`${prefixCls}-button-wrapper-disabled`)
  })

  // ===================== Size =====================

  it.each(['large', 'small'] as const)('should reflect %s size from group', (size) => {
    const wrapper = mount(() => (
      <RadioGroup size={size}>
        <RadioButton value="A">A</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.find(`.${groupPrefixCls}`).classes()).toContain(`${groupPrefixCls}-${size}`)
  })

  // ===================== Solid style =====================

  it('should work with solid buttonStyle', () => {
    const wrapper = mount(() => (
      <RadioGroup buttonStyle="solid" value="A">
        <RadioButton value="A">A</RadioButton>
        <RadioButton value="B">B</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.find(`.${groupPrefixCls}`).classes()).toContain(`${groupPrefixCls}-solid`)
    expect(wrapper.findAll('label')[0].classes()).toContain(`${prefixCls}-button-wrapper-checked`)
  })

  // ===================== Snapshot =====================

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <RadioGroup value="A">
        <RadioButton value="A">A</RadioButton>
        <RadioButton value="B">B</RadioButton>
        <RadioButton value="C">C</RadioButton>
      </RadioGroup>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})
