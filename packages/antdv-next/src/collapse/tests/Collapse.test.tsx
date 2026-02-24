import type { CollapseItemType } from '../Collapse'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Collapse from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const basicItems: CollapseItemType[] = [
  { key: '1', label: 'Panel 1', content: h('p', 'Content 1') },
  { key: '2', label: 'Panel 2', content: h('p', 'Content 2') },
]

describe('collapse', () => {
  mountTest(Collapse)
  rtlTest(() => h(Collapse))

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ==================== Basic Rendering ====================
  it('should render correctly with ant-collapse class', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
  })

  it('should render items as panels', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    expect(wrapper.findAll('.ant-collapse-item').length).toBe(2)
  })

  // ==================== expandIconPlacement ====================
  it('should default expandIconPlacement to start', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-start')
  })

  it('should support expandIconPlacement=end', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, expandIconPlacement: 'end' } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-icon-position-end')
  })

  // ==================== bordered ====================
  it('should have border by default (no borderless class)', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    expect(wrapper.find('.ant-collapse').classes()).not.toContain('ant-collapse-borderless')
  })

  it('should support bordered=false', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, bordered: false } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-borderless')
  })

  // ==================== ghost ====================
  it('should support ghost mode', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, ghost: true } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-ghost')
  })

  it('should not have ghost class when ghost=false', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, ghost: false } })
    expect(wrapper.find('.ant-collapse').classes()).not.toContain('ant-collapse-ghost')
  })

  // ==================== size ====================
  it('should support size=small', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, size: 'small' } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-small')
  })

  it('should support size=large', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, size: 'large' } })
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-large')
  })

  it('should not add size class when size=middle (default)', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems, size: 'middle' } })
    expect(wrapper.find('.ant-collapse').classes()).not.toContain('ant-collapse-middle')
  })

  // ==================== defaultActiveKey / activeKey ====================
  it('should expand panel with defaultActiveKey', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, defaultActiveKey: ['1'] },
    })
    const panelItems = wrapper.findAll('.ant-collapse-item')
    expect(panelItems[0]!.classes()).toContain('ant-collapse-item-active')
    expect(panelItems[1]!.classes()).not.toContain('ant-collapse-item-active')
  })

  it('should control active panel via activeKey', () => {
    const activeKey = ref<string[]>([])
    const wrapper = mount(() => (
      <Collapse items={basicItems} activeKey={activeKey.value} />
    ))
    expect(wrapper.find('.ant-collapse-item-active').exists()).toBe(false)
    activeKey.value = ['2']
    return nextTick().then(() => {
      const panelItems = wrapper.findAll('.ant-collapse-item')
      expect(panelItems[1]!.classes()).toContain('ant-collapse-item-active')
    })
  })

  // ==================== expand icon ====================
  it('should render default expand icon with aria-label=collapsed', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    const arrow = wrapper.find('.ant-collapse-arrow')
    expect(arrow.exists()).toBe(true)
    expect(arrow.attributes('aria-label')).toBe('collapsed')
  })

  it('should show aria-label=expanded when panel is active', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, defaultActiveKey: ['1'] },
    })
    const arrow = wrapper.findAll('.ant-collapse-arrow')[0]!
    expect(arrow.attributes('aria-label')).toBe('expanded')
  })

  it('should rotate arrow 90deg when active (LTR)', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, defaultActiveKey: ['1'] },
    })
    // The rotation style is applied to the SVG element inside the arrow span
    expect(wrapper.find('[style*="rotate(90deg)"]').exists()).toBe(true)
  })

  it('should rotate arrow -90deg when active (RTL)', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Collapse items={basicItems} defaultActiveKey={['1']} />
      </ConfigProvider>
    ))
    expect(wrapper.find('[style*="rotate(-90deg)"]').exists()).toBe(true)
  })

  it('should not rotate arrow when inactive', () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    expect(wrapper.find('[style*="rotate"]').exists()).toBe(false)
  })

  it('should support custom expandIcon prop', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: basicItems,
        expandIcon: () => h('span', { class: 'custom-icon' }, '▶'),
      },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    // Default RightOutlined SVG should not be rendered
    expect(wrapper.find('[data-icon="right"]').exists()).toBe(false)
  })

  it('should keep expandIcon class after custom icon', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: basicItems,
        expandIcon: () => h('span', { class: 'my-icon' }, '▶'),
      },
    })
    // cloneElement merges ant-collapse-arrow onto custom icon
    expect(wrapper.find('.my-icon').classes()).toContain('ant-collapse-arrow')
  })

  it('should support expandIcon slot (takes precedence over prop)', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: basicItems,
        expandIcon: () => h('span', { class: 'prop-icon' }),
      },
      slots: {
        expandIcon: () => h('span', { class: 'slot-icon' }),
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
  })

  // ==================== labelRender / contentRender ====================
  it('should support labelRender prop to override item label', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Original', content: h('p', 'body') }],
        labelRender: ({ item }) => h('strong', `Custom: ${item.label}`),
      },
    })
    expect(wrapper.find('strong').text()).toBe('Custom: Original')
  })

  it('should support contentRender prop to override item content', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Panel', content: h('p', 'Original') }],
        defaultActiveKey: ['1'],
        contentRender: () => h('div', { class: 'custom-content' }, 'Custom'),
      },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('should support labelRender slot (takes precedence over prop)', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Original', content: h('p', 'body') }],
        labelRender: () => h('span', { class: 'prop-label' }),
      },
      slots: {
        labelRender: () => h('span', { class: 'slot-label' }),
      },
    })
    expect(wrapper.find('.slot-label').exists()).toBe(true)
    expect(wrapper.find('.prop-label').exists()).toBe(false)
  })

  it('should support contentRender slot (takes precedence over prop)', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Panel', content: h('p', 'body') }],
        defaultActiveKey: ['1'],
        contentRender: () => h('div', { class: 'prop-content' }),
      },
      slots: {
        contentRender: () => h('div', { class: 'slot-content' }),
      },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.find('.prop-content').exists()).toBe(false)
  })

  // ==================== accordion ====================
  it('should support accordion mode (only one panel open at a time)', async () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, accordion: true },
    })
    const headers = wrapper.findAll('.ant-collapse-header')
    await headers[0]!.trigger('click')
    await headers[1]!.trigger('click')
    await nextTick()
    const accordionItems = wrapper.findAll('.ant-collapse-item')
    expect(accordionItems[0]!.classes()).not.toContain('ant-collapse-item-active')
    expect(accordionItems[1]!.classes()).toContain('ant-collapse-item-active')
  })

  // ==================== collapsible ====================
  it('should support collapsible=disabled', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, collapsible: 'disabled' },
    })
    const item = wrapper.find('.ant-collapse-item')
    expect(item.classes()).toContain('ant-collapse-item-disabled')
    expect(wrapper.find('.ant-collapse-header').attributes('aria-disabled')).toBe('true')
  })

  // ==================== showArrow (via item + CollapsePanel) ====================
  it('should hide expand icon when item showArrow=false', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Panel', content: h('p', 'Body'), showArrow: false }],
      },
    })
    // Arrow icon should not be rendered when showArrow=false
    const iconWrapper = wrapper.find('.ant-collapse-expand-icon')
    expect(iconWrapper.exists()).toBe(false)
  })

  // Note: ant-collapse-no-arrow class is added by antdv-next's CollapsePanel wrapper,
  // but the items API renders @v-c/collapse's Panel directly (bypassing the wrapper),
  // so that class never appears in the DOM. No test for it here.
  it('collapsePanel: showArrow=true (default) renders expand icon', () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Panel', content: h('p', 'Body'), showArrow: true }],
      },
    })
    expect(wrapper.find('.ant-collapse-expand-icon').exists()).toBe(true)
  })

  // ==================== change emit ====================
  it('should emit change when panel is toggled', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Collapse, {
      props: { items: basicItems, onChange },
    })
    await wrapper.find('.ant-collapse-header').trigger('click')
    expect(onChange).toHaveBeenCalledWith(['1'])
  })

  it('should emit change via v-on:change', async () => {
    const wrapper = mount(Collapse, { props: { items: basicItems } })
    await wrapper.find('.ant-collapse-header').trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([['1']])
  })

  // ==================== rootClass ====================
  it('should support rootClass prop', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, rootClass: 'my-collapse' },
    })
    expect(wrapper.find('.ant-collapse').classes()).toContain('my-collapse')
  })

  // ==================== attrs passthrough ====================
  it('should pass class attr to root element', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems },
      attrs: { class: 'extra-class' },
    })
    expect(wrapper.find('.ant-collapse').classes()).toContain('extra-class')
  })

  it('should pass style attr to root element', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems },
      attrs: { style: { color: 'red' } },
    })
    expect(wrapper.find('.ant-collapse').attributes('style')).toContain('color: red')
  })

  it('should pass data-* attrs', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems },
      attrs: { 'data-testid': 'my-collapse' },
    })
    expect(wrapper.find('[data-testid="my-collapse"]').exists()).toBe(true)
  })

  // ==================== semantic classes/styles ====================
  it('should apply semantic classes.root', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, classes: { root: 'c-root' } },
    })
    expect(wrapper.find('.ant-collapse').classes()).toContain('c-root')
  })

  it('should apply semantic styles.root', () => {
    const wrapper = mount(Collapse, {
      props: { items: basicItems, styles: { root: { color: 'red' } } },
    })
    expect(wrapper.find('.ant-collapse').attributes('style')).toContain('color: red')
  })

  // ==================== ConfigProvider ====================
  it('should inherit size from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="large">
        <Collapse items={basicItems} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-large')
  })

  it('should prefer component size over ConfigProvider size', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="large">
        <Collapse items={basicItems} size="small" />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-small')
    expect(wrapper.find('.ant-collapse').classes()).not.toContain('ant-collapse-large')
  })

  // ==================== RTL ====================
  it('should add rtl class in RTL direction', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Collapse items={basicItems} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-collapse').classes()).toContain('ant-collapse-rtl')
  })

  // ==================== dynamic updates ====================
  it('should update when items prop changes', async () => {
    const wrapper = mount(Collapse, {
      props: {
        items: [{ key: '1', label: 'Panel 1', content: h('p', 'Body') }],
      },
    })
    expect(wrapper.findAll('.ant-collapse-item').length).toBe(1)
    await wrapper.setProps({
      items: [
        { key: '1', label: 'Panel 1', content: h('p', 'Body') },
        { key: '2', label: 'Panel 2', content: h('p', 'Body 2') },
      ],
    })
    expect(wrapper.findAll('.ant-collapse-item').length).toBe(2)
  })

  // ==================== snapshot ====================
  it('should match snapshot', () => {
    const wrapper = mount(Collapse, {
      props: {
        defaultActiveKey: ['1'],
        items: [
          { key: '1', label: 'Panel 1', content: h('p', 'Content 1') },
          { key: '2', label: 'Panel 2', content: h('p', 'Content 2') },
        ],
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
