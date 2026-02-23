import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Card, { CardGrid, CardMeta } from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('card', () => {
  rtlTest(() => h(Card, null, { default: () => 'Card content' }))

  it('should render basic card', () => {
    const wrapper = mount(Card, {
      slots: { default: () => 'Card content' },
    })
    expect(wrapper.find('.ant-card').exists()).toBe(true)
    expect(wrapper.find('.ant-card-body').exists()).toBe(true)
    expect(wrapper.find('.ant-card-body').text()).toBe('Card content')
  })

  it('should render title and extra via props', () => {
    const wrapper = mount(Card, {
      props: { title: 'Card Title', extra: 'Extra' },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-head').exists()).toBe(true)
    expect(wrapper.find('.ant-card-head-title').text()).toBe('Card Title')
    expect(wrapper.find('.ant-card-extra').text()).toBe('Extra')
  })

  it('should render title and extra via slots', () => {
    const wrapper = mount(Card, {
      slots: {
        default: () => 'content',
        title: () => 'Slot Title',
        extra: () => 'Slot Extra',
      },
    })
    expect(wrapper.find('.ant-card-head-title').text()).toBe('Slot Title')
    expect(wrapper.find('.ant-card-extra').text()).toBe('Slot Extra')
  })

  it('should not render head when no title or extra', () => {
    const wrapper = mount(Card, {
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-head').exists()).toBe(false)
  })

  it('should render bordered card by default', () => {
    const wrapper = mount(Card, {
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-bordered').exists()).toBe(true)
  })

  it('should support variant borderless', () => {
    const wrapper = mount(Card, {
      props: { variant: 'borderless' },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-bordered').exists()).toBe(false)
  })

  it('should support loading state', () => {
    const wrapper = mount(Card, {
      props: { loading: true },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-loading').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
  })

  it('should support hoverable', () => {
    const wrapper = mount(Card, {
      props: { hoverable: true },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-hoverable').exists()).toBe(true)
  })

  it('should support size small', () => {
    const wrapper = mount(Card, {
      props: { size: 'small' },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-small').exists()).toBe(true)
  })

  it('should support type inner', () => {
    const wrapper = mount(Card, {
      props: { type: 'inner' },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-type-inner').exists()).toBe(true)
  })

  it('should render cover via prop', () => {
    const wrapper = mount(Card, {
      props: { cover: h('img', { src: 'test.jpg', alt: 'cover' }) },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-cover').exists()).toBe(true)
    expect(wrapper.find('.ant-card-cover img').exists()).toBe(true)
  })

  it('should render cover via slot', () => {
    const wrapper = mount(Card, {
      slots: {
        default: () => 'content',
        cover: () => h('img', { src: 'test.jpg', alt: 'cover' }),
      },
    })
    expect(wrapper.find('.ant-card-cover').exists()).toBe(true)
  })

  it('should render actions via prop', () => {
    const wrapper = mount(Card, {
      props: {
        actions: [h('span', 'Action1'), h('span', 'Action2')],
      },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-actions').exists()).toBe(true)
    const items = wrapper.findAll('.ant-card-actions li')
    expect(items).toHaveLength(2)
    expect(items[0].attributes('style')).toContain('width: 50%')
  })

  it('should render actions via slot', () => {
    const wrapper = mount(Card, {
      slots: {
        default: () => 'content',
        actions: () => [h('span', 'A1'), h('span', 'A2'), h('span', 'A3')],
      },
    })
    expect(wrapper.find('.ant-card-actions').exists()).toBe(true)
    const items = wrapper.findAll('.ant-card-actions li')
    expect(items).toHaveLength(3)
  })

  it('should support id prop', () => {
    const wrapper = mount(Card, {
      props: { id: 'my-card' },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('#my-card').exists()).toBe(true)
  })

  // ============ Tab tests ============

  it('should render tabs from tabList', () => {
    const wrapper = mount(Card, {
      props: {
        tabList: [
          { key: 'tab1', label: 'Tab 1' },
          { key: 'tab2', label: 'Tab 2' },
        ],
      },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-card-contain-tabs').exists()).toBe(true)
    expect(wrapper.find('.ant-card-head').exists()).toBe(true)
    expect(wrapper.find('.ant-tabs').exists()).toBe(true)
  })

  it('should support deprecated tab property in tabList', () => {
    const wrapper = mount(Card, {
      props: {
        tabList: [
          { key: 'tab1', tab: 'Old Tab 1' },
          { key: 'tab2', tab: 'Old Tab 2' },
        ],
      },
      slots: { default: () => 'content' },
    })
    expect(wrapper.find('.ant-tabs').exists()).toBe(true)
  })

  it('should emit tabChange when tab changes', async () => {
    const onTabChange = vi.fn()
    const wrapper = mount(Card, {
      props: {
        activeTabKey: 'tab1',
        tabList: [
          { key: 'tab1', label: 'Tab 1' },
          { key: 'tab2', label: 'Tab 2' },
        ],
        onTabChange,
      },
      slots: { default: () => 'content' },
    })
    const tabs = wrapper.findAll('.ant-tabs-tab')
    expect(tabs.length).toBeGreaterThan(1)
    await tabs[1].trigger('click')
    expect(onTabChange).toHaveBeenCalledWith('tab2')
  })

  it('should emit update:activeTabKey when tab changes', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Card, {
      props: {
        activeTabKey: 'tab1',
        tabList: [
          { key: 'tab1', label: 'Tab 1' },
          { key: 'tab2', label: 'Tab 2' },
        ],
        'onUpdate:activeTabKey': onUpdate,
      },
      slots: { default: () => 'content' },
    })
    const tabs = wrapper.findAll('.ant-tabs-tab')
    await tabs[1].trigger('click')
    expect(onUpdate).toHaveBeenCalledWith('tab2')
  })

  it('should support defaultActiveTabKey', () => {
    const wrapper = mount(Card, {
      props: {
        defaultActiveTabKey: 'tab2',
        tabList: [
          { key: 'tab1', label: 'Tab 1' },
          { key: 'tab2', label: 'Tab 2' },
        ],
      },
      slots: { default: () => 'content' },
    })
    const activeTab = wrapper.find('.ant-tabs-tab-active')
    expect(activeTab.exists()).toBe(true)
    expect(activeTab.text()).toBe('Tab 2')
  })

  // ============ Card.Grid tests ============

  it('should render Card.Grid', () => {
    const wrapper = mount(Card, {
      slots: {
        default: () => [
          h(CardGrid, null, { default: () => 'Grid 1' }),
          h(CardGrid, null, { default: () => 'Grid 2' }),
        ],
      },
    })
    expect(wrapper.find('.ant-card-contain-grid').exists()).toBe(true)
    expect(wrapper.findAll('.ant-card-grid')).toHaveLength(2)
  })

  it('should render Card.Grid with hoverable', () => {
    const wrapper = mount(CardGrid, {
      slots: { default: () => 'Grid content' },
    })
    expect(wrapper.find('.ant-card-grid').exists()).toBe(true)
    expect(wrapper.find('.ant-card-grid-hoverable').exists()).toBe(true)
  })

  it('should render Card.Grid without hoverable', () => {
    const wrapper = mount(CardGrid, {
      props: { hoverable: false },
      slots: { default: () => 'Grid content' },
    })
    expect(wrapper.find('.ant-card-grid-hoverable').exists()).toBe(false)
  })

  // ============ Snapshots ============

  it('should match snapshot - basic', () => {
    const wrapper = mount(() => (
      <Card title="Card Title" extra="Extra">
        Card content
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - loading', () => {
    const wrapper = mount(() => (
      <Card title="Card Title" loading>
        Card content
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with cover and actions', () => {
    const wrapper = mount(() => (
      <Card
        title="Card Title"
        cover={<img src="test.jpg" alt="cover" />}
        actions={[<span>Action1</span>, <span>Action2</span>]}
      >
        Card content
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with Card.Meta', () => {
    const wrapper = mount(() => (
      <Card>
        <CardMeta
          avatar={<span>A</span>}
          title="Meta Title"
          description="Meta Description"
        />
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with Card.Grid', () => {
    const wrapper = mount(() => (
      <Card title="Card Title">
        <Card.Grid>Grid 1</Card.Grid>
        <Card.Grid>Grid 2</Card.Grid>
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - small size inner type', () => {
    const wrapper = mount(() => (
      <Card title="Card Title" size="small" type="inner">
        Card content
      </Card>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
