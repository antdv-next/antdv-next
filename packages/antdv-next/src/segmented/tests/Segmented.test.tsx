import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Segmented from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-segmented'

describe('segmented', () => {
  mountTest(() => h(Segmented, { options: [] }))
  rtlTest(() => h(Segmented, { options: [] }))

  it('should render empty segmented', () => {
    const wrapper = mount(Segmented, {
      props: { options: [] },
    })
    expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render segmented with string options', () => {
    const wrapper = mount(Segmented, {
      props: { options: ['Daily', 'Weekly', 'Monthly'] },
    })
    expect(wrapper.element).toMatchSnapshot()
    const items = wrapper.findAll(`.${prefixCls}-item`)
    expect(items).toHaveLength(3)
  })

  it('should render segmented with labeled options', () => {
    const wrapper = mount(Segmented, {
      props: {
        options: [
          { label: 'Daily', value: 'Daily' },
          { label: 'Weekly', value: 'Weekly' },
        ],
      },
    })
    const items = wrapper.findAll(`.${prefixCls}-item`)
    expect(items).toHaveLength(2)
  })

  it('should render segmented with numeric options', () => {
    const wrapper = mount(Segmented, {
      props: { options: [1, 2, 3] },
    })
    const items = wrapper.findAll(`.${prefixCls}-item`)
    expect(items).toHaveLength(3)
  })

  it('should render segmented with mixed options', () => {
    const wrapper = mount(Segmented, {
      props: {
        options: ['Daily', { label: 'Weekly', value: 'Weekly' }, 'Monthly'],
      },
    })
    const items = wrapper.findAll(`.${prefixCls}-item`)
    expect(items).toHaveLength(3)
    expect(wrapper.element).toMatchSnapshot()
  })

  // ===================== Props =====================

  describe('block prop', () => {
    it('should add block class when block is true', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], block: true },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-block`)
    })

    it('should not have block class by default', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-block`)
    })
  })

  describe('size prop', () => {
    it('should add sm class when size is small', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], size: 'small' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-sm`)
    })

    it('should add lg class when size is large', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], size: 'large' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-lg`)
    })

    it('should not add size class when size is middle (default)', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], size: 'middle' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-sm`)
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-lg`)
    })
  })

  describe('shape prop', () => {
    it('should add round class when shape is round', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], shape: 'round' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-shape-round`)
    })

    it('should not add shape class when shape is default', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], shape: 'default' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-shape-default`)
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-shape-round`)
    })
  })

  describe('vertical / orientation prop', () => {
    it('should add vertical class when vertical is true', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], vertical: true },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-vertical`)
    })

    it('should add vertical class when orientation is vertical', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], orientation: 'vertical' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-vertical`)
    })

    it('orientation takes priority over vertical', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], vertical: true, orientation: 'horizontal' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-vertical`)
    })

    it('should not have vertical class by default', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-vertical`)
    })
  })

  describe('disabled prop', () => {
    it('should add disabled class when disabled', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], disabled: true },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-disabled`)
    })

    it('should support individual option disabled', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            'A',
            { label: 'B', value: 'B', disabled: true },
            'C',
          ],
        },
      })
      const items = wrapper.findAll(`.${prefixCls}-item`)
      expect(items[1]!.classes()).toContain(`${prefixCls}-item-disabled`)
    })
  })

  describe('defaultValue prop', () => {
    it('should select the item matching defaultValue', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B', 'C'], defaultValue: 'B' },
      })
      const items = wrapper.findAll(`.${prefixCls}-item`)
      expect(items[1]!.classes()).toContain(`${prefixCls}-item-selected`)
    })
  })

  describe('name prop', () => {
    it('should set name attribute on radio inputs', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], name: 'my-group' },
      })
      const inputs = wrapper.findAll('input[type="radio"]')
      inputs.forEach((input) => {
        expect(input.attributes('name')).toBe('my-group')
      })
    })

    it('should auto-generate name when not provided', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
      })
      const inputs = wrapper.findAll('input[type="radio"]')
      expect(inputs[0]!.attributes('name')).toBeTruthy()
    })
  })

  describe('rootClass prop', () => {
    it('should apply rootClass to root element', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'], rootClass: 'custom-root' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('custom-root')
    })
  })

  // ===================== Icon =====================

  describe('icon rendering', () => {
    it('should render icon when option has icon property', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'List', icon: h('span', { class: 'test-icon' }, 'icon') },
            { value: 'Kanban', label: 'Kanban', icon: h('span', { class: 'test-icon2' }, 'icon2') },
          ],
        },
      })
      expect(wrapper.findAll(`.${prefixCls}-item-icon`)).toHaveLength(2)
      expect(wrapper.find('.test-icon').exists()).toBe(true)
      expect(wrapper.find('.test-icon2').exists()).toBe(true)
    })

    it('should render label alongside icon when both provided', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'List', label: 'List', icon: h('span', 'ic') },
          ],
        },
      })
      expect(wrapper.find(`.${prefixCls}-item-icon`).exists()).toBe(true)
      expect(wrapper.text()).toContain('List')
    })

    it('should render icon only when label is not provided', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'List', icon: h('span', 'ic') },
          ],
        },
      })
      expect(wrapper.find(`.${prefixCls}-item-icon`).exists()).toBe(true)
    })
  })

  // ===================== Slots =====================

  describe('slots', () => {
    it('should support iconRender slot', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
          ],
        },
        slots: {
          iconRender: (option: any) => h('span', { class: 'slot-icon' }, option.value),
        },
      })
      expect(wrapper.findAll('.slot-icon')).toHaveLength(2)
      expect(wrapper.findAll(`.${prefixCls}-item-icon`)).toHaveLength(2)
    })

    it('should support labelRender slot', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
          ],
        },
        slots: {
          labelRender: (option: any) => h('span', { class: 'slot-label' }, `custom-${option.value}`),
        },
      })
      expect(wrapper.findAll('.slot-label')).toHaveLength(2)
      expect(wrapper.text()).toContain('custom-A')
    })

    it('iconRender slot takes priority over iconRender prop', () => {
      // when option has NO icon, iconRender slot provides the icon
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'A', label: 'A' },
          ],
          iconRender: () => h('span', { class: 'prop-fn-icon' }, 'fn'),
        },
        slots: {
          iconRender: () => h('span', { class: 'slot-icon' }, 'slot'),
        },
      })
      expect(wrapper.find('.slot-icon').exists()).toBe(true)
      expect(wrapper.find('.prop-fn-icon').exists()).toBe(false)
    })

    it('option.icon takes priority over iconRender slot', () => {
      // when option HAS icon, option.icon is used instead of iconRender slot
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'A', icon: h('span', { class: 'prop-icon' }, 'prop') },
          ],
        },
        slots: {
          iconRender: () => h('span', { class: 'slot-icon' }, 'slot'),
        },
      })
      expect(wrapper.find('.prop-icon').exists()).toBe(true)
    })
  })

  // ===================== Emits =====================

  describe('emits', () => {
    it('should emit change when clicking an item', async () => {
      const onChange = vi.fn()
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B', 'C'], onChange },
      })
      const el = wrapper.findAll(`.${prefixCls}-item-input`)[2]!.element as HTMLInputElement
      el.checked = true
      el.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()
      expect(onChange).toHaveBeenCalledWith('C')
    })

    it('should emit update:value when clicking an item', async () => {
      const onUpdate = vi.fn()
      const wrapper = mount(Segmented, {
        props: { 'options': ['A', 'B', 'C'], 'onUpdate:value': onUpdate },
      })
      const el = wrapper.findAll(`.${prefixCls}-item-input`)[1]!.element as HTMLInputElement
      el.checked = true
      el.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()
      expect(onUpdate).toHaveBeenCalledWith('B')
    })

    it('should not emit change when clicking disabled item', async () => {
      const onChange = vi.fn()
      const wrapper = mount(Segmented, {
        props: {
          options: ['A', { label: 'B', value: 'B', disabled: true }, 'C'],
          onChange,
        },
      })
      const el = wrapper.findAll(`.${prefixCls}-item-input`)[1]!.element as HTMLInputElement
      el.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  // ===================== Attrs =====================

  describe('attrs passthrough', () => {
    it('should pass data-* attributes', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
        attrs: { 'data-testid': 'seg' },
      })
      expect(wrapper.find(`.${prefixCls}`).attributes('data-testid')).toBe('seg')
    })

    it('should merge attrs.style onto root', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
        attrs: { style: 'margin: 8px' },
      })
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('margin: 8px')
    })

    it('should merge attrs.class onto root', () => {
      const wrapper = mount(Segmented, {
        props: { options: ['A', 'B'] },
        attrs: { class: 'my-cls' },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('my-cls')
    })
  })

  // ===================== Semantic classes/styles =====================

  describe('semantic classes and styles', () => {
    it('should apply classes.root to root element', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: ['A', 'B'],
          classes: { root: 'c-root' },
        },
      })
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain('c-root')
    })

    it('should apply styles.root to root element', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: ['A', 'B'],
          styles: { root: { color: 'rgb(255, 0, 0)' } },
        },
      })
      expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(255, 0, 0)')
    })

    it('should apply icon semantic class and style', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'A', icon: h('span', 'ic'), label: 'A' },
          ],
          classes: { icon: 'c-icon' },
          styles: { icon: { padding: '2px' } },
        },
      })
      const iconEl = wrapper.find(`.${prefixCls}-item-icon`)
      expect(iconEl.classes()).toContain('c-icon')
      expect(iconEl.attributes('style')).toContain('padding: 2px')
    })
  })

  // ===================== ConfigProvider =====================

  describe('configProvider integration', () => {
    // Note: Segmented defaults `size: 'middle'`, so ConfigProvider componentSize
    // is overridden by the default value (uses ?? operator in useSize)

    it('component size prop overrides ConfigProvider componentSize', () => {
      const wrapper = mount(() => (
        <ConfigProvider componentSize="small">
          <Segmented options={['A', 'B']} size="large" />
        </ConfigProvider>
      ))
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-lg`)
      expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-sm`)
    })

    it('should respect direction from ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Segmented options={['A', 'B']} />
        </ConfigProvider>
      ))
      expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-rtl`)
    })

    // Note: segmented is NOT in PASSED_PROPS, so ConfigProvider segmented-specific
    // classes/styles are not forwarded through the config context
  })

  // ===================== Tooltip =====================

  describe('tooltip in options', () => {
    it('should render without error when tooltip is a string', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { label: 'A', value: 'A', tooltip: 'Hello A' },
            'B',
          ],
        },
      })
      // tooltip wraps item via itemRender; content is in portal (not in wrapper HTML)
      expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true)
      expect(wrapper.findAll(`.${prefixCls}-item`)).toHaveLength(2)
    })

    it('should render without error when tooltip is an object', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { label: 'A', value: 'A', tooltip: { title: 'Obj Tooltip' } },
            'B',
          ],
        },
      })
      expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true)
      expect(wrapper.findAll(`.${prefixCls}-item`)).toHaveLength(2)
    })
  })

  // ===================== Dynamic =====================

  describe('dynamic update', () => {
    it('should update when value changes', async () => {
      const value = ref('A')
      const wrapper = mount(() => (
        <Segmented options={['A', 'B', 'C']} value={value.value} />
      ))
      expect(wrapper.findAll(`.${prefixCls}-item`)[0]!.classes()).toContain(`${prefixCls}-item-selected`)

      value.value = 'C'
      await nextTick()
      expect(wrapper.findAll(`.${prefixCls}-item`)[2]!.classes()).toContain(`${prefixCls}-item-selected`)
    })
  })

  // ===================== Snapshot =====================

  describe('snapshot', () => {
    it('should match snapshot with various options', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            'Daily',
            { label: 'Weekly', value: 'Weekly' },
            { label: 'Monthly', value: 'Monthly', disabled: true },
          ],
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should match snapshot with icon options', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: [
            { value: 'List', icon: h('span', { class: 'icon-list' }, 'L'), label: 'List' },
            { value: 'Grid', icon: h('span', { class: 'icon-grid' }, 'G'), label: 'Grid' },
          ],
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should match snapshot with block and size', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: ['A', 'B', 'C'],
          block: true,
          size: 'small',
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should match snapshot with round shape', () => {
      const wrapper = mount(Segmented, {
        props: {
          options: ['A', 'B'],
          shape: 'round',
        },
      })
      expect(wrapper.element).toMatchSnapshot()
    })
  })
})
