import type { Tab } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Tabs from '..'
import ConfigProvider from '../../config-provider'
import TabPane from '../TabPane'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const defaultItems: Tab[] = [
  { key: '1', label: 'Tab 1', content: 'Content 1' },
  { key: '2', label: 'Tab 2', content: 'Content 2' },
  { key: '3', label: 'Tab 3', content: 'Content 3' },
]

describe('tabs', () => {
  mountTest(() => h(Tabs, { items: defaultItems }))
  rtlTest(() => h(Tabs, { items: defaultItems }))

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ========================= Basic Rendering =========================
  describe('basic', () => {
    it('renders items correctly', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attachTo: document.body,
      })
      const tabs = document.querySelectorAll('.ant-tabs-tab')
      expect(tabs.length).toBe(3)
      expect(tabs[0]?.textContent).toContain('Tab 1')
      expect(tabs[1]?.textContent).toContain('Tab 2')
      expect(tabs[2]?.textContent).toContain('Tab 3')
      wrapper.unmount()
    })

    it('renders with default activeKey', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, defaultActiveKey: '2' },
        attachTo: document.body,
      })
      const activeTab = document.querySelector('.ant-tabs-tab-active')
      expect(activeTab?.textContent).toContain('Tab 2')
      wrapper.unmount()
    })

    it('renders with controlled activeKey', async () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, activeKey: '3' },
        attachTo: document.body,
      })
      const activeTab = document.querySelector('.ant-tabs-tab-active')
      expect(activeTab?.textContent).toContain('Tab 3')
      wrapper.unmount()
    })

    it('renders content for active tab', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, defaultActiveKey: '1' },
        attachTo: document.body,
      })
      const content = document.querySelector('.ant-tabs-tabpane-active')
      expect(content?.textContent).toContain('Content 1')
      wrapper.unmount()
    })

    it('renders with no items', () => {
      const wrapper = mount(Tabs, {
        props: { items: [] },
        attachTo: document.body,
      })
      expect(document.querySelectorAll('.ant-tabs-tab').length).toBe(0)
      wrapper.unmount()
    })
  })

  // ========================= TabPane (legacy) =========================
  describe('tabPane', () => {
    it('renders TabPane children as tabs', () => {
      const wrapper = mount({
        render() {
          return (
            <Tabs>
              <TabPane key="1" tab="Tab 1">Content 1</TabPane>
              <TabPane key="2" tab="Tab 2">Content 2</TabPane>
            </Tabs>
          )
        },
      }, { attachTo: document.body })
      const tabs = document.querySelectorAll('.ant-tabs-tab')
      expect(tabs.length).toBe(2)
      expect(tabs[0]?.textContent).toContain('Tab 1')
      wrapper.unmount()
    })

    it('filters non-TabPane children', () => {
      const wrapper = mount({
        render() {
          return (
            <Tabs>
              <TabPane key="1" tab="Tab 1">Content 1</TabPane>
              {null}
              {undefined}
              {false}
              <div>not a tab</div>
            </Tabs>
          )
        },
      }, { attachTo: document.body })
      expect(document.querySelectorAll('.ant-tabs-tab').length).toBe(1)
      wrapper.unmount()
    })

    it('supports tabKey prop on TabPane', () => {
      const wrapper = mount({
        render() {
          return (
            <Tabs defaultActiveKey="custom-key">
              <TabPane tabKey="custom-key" tab="Custom">Content</TabPane>
            </Tabs>
          )
        },
      }, { attachTo: document.body })
      const activeTab = document.querySelector('.ant-tabs-tab-active')
      expect(activeTab?.textContent).toContain('Custom')
      wrapper.unmount()
    })
  })

  // ========================= Type =========================
  describe('type', () => {
    it('applies line type by default', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      // line type has no special class like -card
      expect(root?.classList.contains('ant-tabs-card')).toBe(false)
      expect(root?.classList.contains('ant-tabs-editable-card')).toBe(false)
      wrapper.unmount()
    })

    it('applies card type', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'card' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-card')).toBe(true)
      wrapper.unmount()
    })

    it('applies editable-card type with add button', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-card')).toBe(true)
      expect(root?.classList.contains('ant-tabs-editable-card')).toBe(true)
      const addBtn = document.querySelector('.ant-tabs-nav-add')
      expect(addBtn).toBeTruthy()
      wrapper.unmount()
    })

    it('hideAdd hides add button in editable-card', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card', hideAdd: true },
        attachTo: document.body,
      })
      const addBtn = document.querySelector('.ant-tabs-nav-add')
      expect(addBtn).toBeFalsy()
      wrapper.unmount()
    })
  })

  // ========================= Size =========================
  describe('size', () => {
    it('applies small size class', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, size: 'small' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-small')).toBe(true)
      wrapper.unmount()
    })

    it('applies large size class', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, size: 'large' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-large')).toBe(true)
      wrapper.unmount()
    })

    it('inherits size from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider componentSize="small">
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-small')).toBe(true)
      wrapper.unmount()
    })
  })

  // ========================= Centered =========================
  it('applies centered class', () => {
    const wrapper = mount(Tabs, {
      props: { items: defaultItems, centered: true },
      attachTo: document.body,
    })
    const root = document.querySelector('.ant-tabs')
    expect(root?.classList.contains('ant-tabs-centered')).toBe(true)
    wrapper.unmount()
  })

  // ========================= Placement =========================
  describe('placement', () => {
    it('renders top by default', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-top')).toBe(true)
      wrapper.unmount()
    })

    it('renders bottom placement', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabPlacement: 'bottom' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-bottom')).toBe(true)
      wrapper.unmount()
    })

    it('maps start to left in LTR', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabPlacement: 'start' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-left')).toBe(true)
      wrapper.unmount()
    })

    it('maps end to right in LTR', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabPlacement: 'end' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-right')).toBe(true)
      wrapper.unmount()
    })

    it('maps start to right in RTL', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs items={defaultItems} tabPlacement="start" />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-right')).toBe(true)
      wrapper.unmount()
    })

    it('maps end to left in RTL', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs items={defaultItems} tabPlacement="end" />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-left')).toBe(true)
      wrapper.unmount()
    })

    it('tabPlacement takes priority over tabPosition', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs items={defaultItems} tabPlacement="end" tabPosition="right" />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const root = document.querySelector('.ant-tabs')
      // tabPlacement='end' in RTL → left
      expect(root?.classList.contains('ant-tabs-left')).toBe(true)
      wrapper.unmount()
    })

    it('supports legacy tabPosition', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabPosition: 'left' } as any,
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-left')).toBe(true)
      wrapper.unmount()
    })
  })

  // ========================= Editable Card =========================
  describe('editable-card', () => {
    it('emits edit with add action when add button clicked', async () => {
      const onEdit = vi.fn()
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card', onEdit },
        attachTo: document.body,
      })
      const addBtn = document.querySelector('.ant-tabs-nav-add')!
      await (addBtn as HTMLElement).click()
      await nextTick()
      expect(onEdit).toHaveBeenCalled()
      expect(onEdit.mock.calls[0]![1]).toBe('add')
      wrapper.unmount()
    })

    it('emits edit with remove action when close icon clicked', async () => {
      const onEdit = vi.fn()
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card', onEdit },
        attachTo: document.body,
      })
      const closeBtn = document.querySelector('.ant-tabs-tab-remove')!
      await (closeBtn as HTMLElement).click()
      await nextTick()
      expect(onEdit).toHaveBeenCalled()
      expect(onEdit.mock.calls[0]![1]).toBe('remove')
      wrapper.unmount()
    })

    it('does not show remove button when tab is not closable', () => {
      const items: Tab[] = [
        { key: '1', label: 'Tab 1', content: 'Content 1', closable: false },
        { key: '2', label: 'Tab 2', content: 'Content 2' },
      ]
      const wrapper = mount(Tabs, {
        props: { items, type: 'editable-card' },
        attachTo: document.body,
      })
      const tabs = document.querySelectorAll('.ant-tabs-tab')
      // first tab should not have remove button
      expect(tabs[0]?.querySelector('.ant-tabs-tab-remove')).toBeFalsy()
      // second tab should have it
      expect(tabs[1]?.querySelector('.ant-tabs-tab-remove')).toBeTruthy()
      wrapper.unmount()
    })
  })

  // ========================= Events =========================
  describe('events', () => {
    it('emits change and update:activeKey on tab click', async () => {
      const onChange = vi.fn()
      const onUpdateActiveKey = vi.fn()
      const wrapper = mount(Tabs, {
        props: {
          items: defaultItems,
          onChange,
          'onUpdate:activeKey': onUpdateActiveKey,
        },
        attachTo: document.body,
      })
      const tabs = document.querySelectorAll('.ant-tabs-tab')
      await (tabs[1] as HTMLElement).click()
      await nextTick()
      expect(onChange).toHaveBeenCalledWith('2')
      expect(onUpdateActiveKey).toHaveBeenCalledWith('2')
      wrapper.unmount()
    })

    it('emits tabClick on tab click', async () => {
      const onTabClick = vi.fn()
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, onTabClick },
        attachTo: document.body,
      })
      const tab = document.querySelector('.ant-tabs-tab')!
      await (tab as HTMLElement).click()
      await nextTick()
      expect(onTabClick).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  // ========================= Disabled =========================
  it('renders disabled tab', () => {
    const items: Tab[] = [
      { key: '1', label: 'Tab 1', content: 'C1' },
      { key: '2', label: 'Tab 2', content: 'C2', disabled: true },
    ]
    const wrapper = mount(Tabs, {
      props: { items },
      attachTo: document.body,
    })
    const tabs = document.querySelectorAll('.ant-tabs-tab')
    expect(tabs[1]?.classList.contains('ant-tabs-tab-disabled')).toBe(true)
    wrapper.unmount()
  })

  // ========================= Animated =========================
  describe('animated', () => {
    it('disables all animation when animated=false', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, animated: false },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      // When animation is disabled, there should be no animated class
      expect(root?.querySelector('.ant-tabs-ink-bar-animated')).toBeFalsy()
      wrapper.unmount()
    })

    it('enables all animation when animated=true', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, animated: true },
        attachTo: document.body,
      })
      const inkBar = document.querySelector('.ant-tabs-ink-bar')
      expect(inkBar?.classList.contains('ant-tabs-ink-bar-animated')).toBe(true)
      wrapper.unmount()
    })

    it('supports animated object config', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, animated: { inkBar: false, tabPane: true } },
        attachTo: document.body,
      })
      const inkBar = document.querySelector('.ant-tabs-ink-bar')
      expect(inkBar?.classList.contains('ant-tabs-ink-bar-animated')).toBe(false)
      wrapper.unmount()
    })
  })

  // ========================= Indicator =========================
  describe('indicator', () => {
    it('passes indicator config to VcTabs', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, indicator: { size: 20 } },
        attachTo: document.body,
      })
      // indicator is passed to @v-c/tabs; just verify it renders
      expect(document.querySelector('.ant-tabs-ink-bar')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports indicator.align', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, indicator: { align: 'center' } },
        attachTo: document.body,
      })
      expect(document.querySelector('.ant-tabs')).toBeTruthy()
      wrapper.unmount()
    })

    it('merges indicator from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{ indicator: { size: 12 } }}>
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      // ConfigProvider indicator is merged and passed to VcTabs
      expect(document.querySelector('.ant-tabs-ink-bar')).toBeTruthy()
      wrapper.unmount()
    })

    it('component indicator overrides ConfigProvider indicator', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider tabs={{ indicator: { size: 12 } }}>
              <Tabs items={defaultItems} indicator={{ size: 4 }} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      expect(document.querySelector('.ant-tabs-ink-bar')).toBeTruthy()
      wrapper.unmount()
    })
  })

  // ========================= Destroy On Hidden =========================
  describe('destroyOnHidden', () => {
    it('supports destroyOnHidden prop', async () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, destroyOnHidden: true, defaultActiveKey: '1' },
        attachTo: document.body,
      })
      // only the active tabpane should be in the DOM
      const panes = document.querySelectorAll('.ant-tabs-tabpane')
      const visiblePanes = Array.from(panes).filter(p => p.textContent?.trim())
      expect(visiblePanes.length).toBe(1)
      wrapper.unmount()
    })

    it('supports deprecated destroyInactiveTabPane', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, destroyInactiveTabPane: true, defaultActiveKey: '1' } as any,
        attachTo: document.body,
      })
      const panes = document.querySelectorAll('.ant-tabs-tabpane')
      const visiblePanes = Array.from(panes).filter(p => p.textContent?.trim())
      expect(visiblePanes.length).toBe(1)
      wrapper.unmount()
    })
  })

  // ========================= Slots =========================
  describe('slots', () => {
    it('supports addIcon slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card' },
        slots: {
          addIcon: () => <span class="custom-add">ADD</span>,
        },
        attachTo: document.body,
      })
      const addBtn = document.querySelector('.ant-tabs-nav-add')
      expect(addBtn?.querySelector('.custom-add')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports removeIcon slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card' },
        slots: {
          removeIcon: () => <span class="custom-remove">X</span>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.custom-remove')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports moreIcon slot', () => {
      // Create many items to trigger more dropdown
      const manyItems: Tab[] = Array.from({ length: 30 }, (_, i) => ({
        key: String(i),
        label: `Tab ${i}`,
        content: `Content ${i}`,
      }))
      const wrapper = mount(Tabs, {
        props: { items: manyItems },
        slots: {
          moreIcon: () => <span class="custom-more">...</span>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.custom-more')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports rightExtra slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        slots: {
          rightExtra: () => <span class="right-extra">Extra Right</span>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.right-extra')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports leftExtra slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        slots: {
          leftExtra: () => <span class="left-extra">Extra Left</span>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.left-extra')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports both leftExtra and rightExtra slots', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        slots: {
          leftExtra: () => <span class="left-extra">Left</span>,
          rightExtra: () => <span class="right-extra">Right</span>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.left-extra')).toBeTruthy()
      expect(document.querySelector('.right-extra')).toBeTruthy()
      wrapper.unmount()
    })

    it('tabBarExtraContent prop takes priority over slots', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabBarExtraContent: 'prop extra' },
        slots: {
          rightExtra: () => <span class="right-extra">Slot Extra</span>,
        },
        attachTo: document.body,
      })
      // When tabBarExtraContent prop is set, the slot is ignored (L381-383)
      expect(document.querySelector('.right-extra')).toBeFalsy()
      const navWrap = document.querySelector('.ant-tabs-nav')
      expect(navWrap?.textContent).toContain('prop extra')
      wrapper.unmount()
    })

    it('supports renderTabBar slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        slots: {
          renderTabBar: () => <div class="custom-tab-bar">Custom Bar</div>,
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.custom-tab-bar')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports renderTabBar prop', () => {
      const wrapper = mount(Tabs, {
        props: {
          items: defaultItems,
          renderTabBar: () => {
            return <div class="prop-tab-bar">Prop Bar</div>
          },
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.prop-tab-bar')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports labelRender slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        slots: {
          labelRender: ({ item }: { item: Tab }) => (
            <span class="custom-label">
              {item.label}
              {' '}
              !
            </span>
          ),
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.custom-label')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports contentRender slot', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, defaultActiveKey: '1' },
        slots: {
          contentRender: ({ item }: { item: Tab }) => (
            <div class="custom-content">
              Custom
              {item.key}
            </div>
          ),
        },
        attachTo: document.body,
      })
      expect(document.querySelector('.custom-content')).toBeTruthy()
      wrapper.unmount()
    })
  })

  // ========================= Props =========================
  describe('props', () => {
    it('supports addIcon prop', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card', addIcon: <span class="prop-add-icon">+</span> },
        attachTo: document.body,
      })
      expect(document.querySelector('.prop-add-icon')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports removeIcon prop', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, type: 'editable-card', removeIcon: <span class="prop-remove-icon">x</span> },
        attachTo: document.body,
      })
      expect(document.querySelector('.prop-remove-icon')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports moreIcon prop', () => {
      const manyItems: Tab[] = Array.from({ length: 30 }, (_, i) => ({
        key: String(i),
        label: `Tab ${i}`,
        content: `Content ${i}`,
      }))
      const wrapper = mount(Tabs, {
        props: { items: manyItems, moreIcon: <span class="prop-more-icon">M</span> },
        attachTo: document.body,
      })
      expect(document.querySelector('.prop-more-icon')).toBeTruthy()
      wrapper.unmount()
    })

    it('supports tabBarGutter prop', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabBarGutter: 16 },
        attachTo: document.body,
      })
      expect(document.querySelector('.ant-tabs')).toBeTruthy()
      wrapper.unmount()
    })
  })

  // ========================= Attrs Passthrough =========================
  describe('attrs passthrough', () => {
    it('passes class to root element', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attrs: { class: 'custom-class' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('custom-class')).toBe(true)
      wrapper.unmount()
    })

    it('passes style to root element', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attrs: { style: { color: 'red' } },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs') as HTMLElement
      expect(root?.style.color).toBe('red')
      wrapper.unmount()
    })

    it('passes data-* attrs', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attrs: { 'data-testid': 'my-tabs' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.getAttribute('data-testid')).toBe('my-tabs')
      wrapper.unmount()
    })

    it('supports rootClass prop', () => {
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, rootClass: 'root-cls' },
        attachTo: document.body,
      })
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('root-cls')).toBe(true)
      wrapper.unmount()
    })
  })

  // ========================= RTL =========================
  describe('rTL', () => {
    it('renders in rtl direction', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      const root = document.querySelector('.ant-tabs')
      // VcTabs handles RTL via direction prop
      expect(root).toBeTruthy()
      wrapper.unmount()
    })
  })

  // ========================= Item class =========================
  it('passes class on Tab item to VcTabs as className', () => {
    const items: Tab[] = [
      { key: '1', label: 'Tab 1', content: 'C1', class: 'custom-tab-cls' },
    ]
    const wrapper = mount(Tabs, {
      props: { items },
      attachTo: document.body,
    })
    // Tab.class is mapped to VcTab.className in convertItem (useLegacyItems L25)
    // VcTabs applies it to the tab element
    const html = wrapper.html()
    expect(html).toContain('custom-tab-cls')
    wrapper.unmount()
  })

  // ========================= Ref =========================
  it('supports ref with nativeElement', async () => {
    const refValue = { value: null as any }
    const wrapper = mount({
      setup() {
        return () => (
          <Tabs
            ref={(el: any) => {
              refValue.value = el
            }}
            items={defaultItems}
          />
        )
      },
    }, { attachTo: document.body })
    await nextTick()
    expect(refValue.value).toBeTruthy()
    expect(refValue.value.nativeElement).toBeInstanceOf(HTMLElement)
    wrapper.unmount()
  })

  // ========================= ConfigProvider =========================
  describe('configProvider', () => {
    it('uses prefixCls from ConfigProvider', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider prefixCls="my">
              <Tabs items={defaultItems} />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      expect(document.querySelector('.my-tabs')).toBeTruthy()
      wrapper.unmount()
    })

    it('merges direction from ConfigProvider for RTL', () => {
      const wrapper = mount({
        render() {
          return (
            <ConfigProvider direction="rtl">
              <Tabs items={defaultItems} tabPlacement="start" />
            </ConfigProvider>
          )
        },
      }, { attachTo: document.body })
      // start → right in RTL
      const root = document.querySelector('.ant-tabs')
      expect(root?.classList.contains('ant-tabs-right')).toBe(true)
      wrapper.unmount()
    })
  })

  // ========================= Deprecated Warnings =========================
  describe('deprecated warnings', () => {
    it('warns about deprecated tabPosition', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, tabPosition: 'left' } as any,
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`tabPosition` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about deprecated popupClassName', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, popupClassName: 'old-popup' } as any,
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`popupClassName` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about deprecated indicatorSize', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, indicatorSize: 10 } as any,
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`indicatorSize` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about deprecated destroyInactiveTabPane', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: { items: defaultItems, destroyInactiveTabPane: true } as any,
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`destroyInactiveTabPane` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about deprecated Tabs.TabPane usage', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount({
        render() {
          return (
            <Tabs>
              <TabPane key="1" tab="Tab 1">Content</TabPane>
            </Tabs>
          )
        },
      }, { attachTo: document.body })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`Tabs.TabPane` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about destroyInactiveTabPane in items', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: {
          items: [
            { key: '1', label: 'Tab', content: 'C', destroyInactiveTabPane: true } as any,
          ],
        },
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`destroyInactiveTabPane` is deprecated'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })

    it('warns about deprecated onPrevClick/onNextClick', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mount(Tabs, {
        props: { items: defaultItems },
        attrs: { onPrevClick: () => {} },
        attachTo: document.body,
      })
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('`onPrevClick` and `onNextClick` has been removed'),
      )
      spy.mockRestore()
      wrapper.unmount()
    })
  })

  // ========================= useAnimateConfig =========================
  it('enables tabPane animation with animated.tabPane=true', () => {
    const wrapper = mount(Tabs, {
      props: { items: defaultItems, animated: { inkBar: true, tabPane: true } },
      attachTo: document.body,
    })
    // When tabPane animation is enabled, tabPaneMotion should be configured
    // Verify it renders correctly without errors
    expect(document.querySelector('.ant-tabs')).toBeTruthy()
    wrapper.unmount()
  })

  // ========================= Snapshot =========================
  it('matches snapshot', () => {
    const wrapper = mount(Tabs, {
      props: { items: defaultItems, defaultActiveKey: '1' },
      attachTo: document.body,
    })
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
})
