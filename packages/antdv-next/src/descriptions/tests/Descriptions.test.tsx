import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Descriptions from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const basicItems = [
  { key: '1', label: 'Product', content: 'Cloud Database' },
  { key: '2', label: 'Billing', content: 'Prepaid' },
  { key: '3', label: 'Time', content: '18:00:00' },
]

describe('descriptions', () => {
  mountTest(Descriptions)
  rtlTest(() => h(Descriptions, { items: basicItems }))

  // ==================== Basic Rendering ====================
  it('renders basic descriptions with items', () => {
    const wrapper = mount(Descriptions, {
      props: { items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').exists()).toBe(true)
    expect(wrapper.findAll('.ant-descriptions-item')).toHaveLength(3)
  })

  it('renders empty without items', () => {
    const wrapper = mount(Descriptions, {
      props: { items: [] },
    })
    expect(wrapper.find('.ant-descriptions').exists()).toBe(true)
    expect(wrapper.findAll('.ant-descriptions-item')).toHaveLength(0)
  })

  it('renders item label and content', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud Database' }],
      },
    })
    expect(wrapper.find('.ant-descriptions-item-label').text()).toBe('Product')
    expect(wrapper.find('.ant-descriptions-item-content').text()).toBe('Cloud Database')
  })

  // ==================== Title & Extra ====================
  it('renders title from prop', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'User Info', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('User Info')
  })

  it('renders title from slot', () => {
    const wrapper = mount(Descriptions, {
      props: { items: basicItems },
      slots: { title: () => <span>Slot Title</span> },
    })
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('Slot Title')
  })

  it('renders extra from prop', () => {
    const wrapper = mount(Descriptions, {
      props: { extra: 'Edit', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-extra').text()).toBe('Edit')
  })

  it('renders extra from slot', () => {
    const wrapper = mount(Descriptions, {
      props: { items: basicItems },
      slots: { extra: () => <button>Action</button> },
    })
    expect(wrapper.find('.ant-descriptions-extra').find('button').exists()).toBe(true)
  })

  it('does not render header when title and extra are absent', () => {
    const wrapper = mount(Descriptions, {
      props: { items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(false)
  })

  it('renders header when only title is provided', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'My Title', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-extra').exists()).toBe(false)
  })

  it('renders header when only extra is provided', () => {
    const wrapper = mount(Descriptions, {
      props: { extra: 'Edit', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-title').exists()).toBe(false)
  })

  // ==================== Bordered ====================
  it('adds bordered class when bordered=true', () => {
    const wrapper = mount(Descriptions, {
      props: { bordered: true, items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-bordered').exists()).toBe(true)
  })

  it('does not add bordered class when bordered=false', () => {
    const wrapper = mount(Descriptions, {
      props: { bordered: false, items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-bordered').exists()).toBe(false)
  })

  it('renders th/td structure when bordered', () => {
    const wrapper = mount(Descriptions, {
      props: {
        bordered: true,
        items: [{ label: 'Product', content: 'Cloud Database' }],
      },
    })
    expect(wrapper.find('th.ant-descriptions-item-label').exists()).toBe(true)
    expect(wrapper.find('td.ant-descriptions-item-content').exists()).toBe(true)
  })

  it('renders td with container div when not bordered', () => {
    const wrapper = mount(Descriptions, {
      props: {
        bordered: false,
        items: [{ label: 'Product', content: 'Cloud Database' }],
      },
    })
    expect(wrapper.find('td.ant-descriptions-item').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-item-container').exists()).toBe(true)
  })

  // ==================== Size ====================
  it('adds size class for small', () => {
    const wrapper = mount(Descriptions, {
      props: { size: 'small', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-small').exists()).toBe(true)
  })

  it('adds size class for middle', () => {
    const wrapper = mount(Descriptions, {
      props: { size: 'middle', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-middle').exists()).toBe(true)
  })

  it('does not add size class for default', () => {
    const wrapper = mount(Descriptions, {
      props: { size: 'default', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-default').exists()).toBe(false)
  })

  // ==================== Layout ====================
  it('renders horizontal layout (default)', () => {
    const wrapper = mount(Descriptions, {
      props: { items: basicItems },
    })
    // Horizontal: 1 tr per column group
    const rows = wrapper.findAll('tr.ant-descriptions-row')
    expect(rows.length).toBeGreaterThanOrEqual(1)
  })

  it('renders vertical layout with separate label/content rows', () => {
    const wrapper = mount(Descriptions, {
      props: {
        layout: 'vertical',
        column: 3,
        items: basicItems,
      },
    })
    // Vertical: 2 rows (label row + content row) per item row
    const rows = wrapper.findAll('tr.ant-descriptions-row')
    expect(rows).toHaveLength(2)
  })

  it('renders horizontal layout explicitly', () => {
    const wrapper = mount(Descriptions, {
      props: {
        layout: 'horizontal',
        column: 3,
        items: basicItems,
      },
    })
    const rows = wrapper.findAll('tr.ant-descriptions-row')
    expect(rows).toHaveLength(1)
  })

  // ==================== Colon ====================
  it('shows colon by default', () => {
    const wrapper = mount(Descriptions, {
      props: { items: [{ label: 'Product', content: 'Cloud Database' }] },
    })
    expect(wrapper.find('.ant-descriptions-item-no-colon').exists()).toBe(false)
  })

  it('hides colon when colon=false', () => {
    const wrapper = mount(Descriptions, {
      props: {
        colon: false,
        items: [{ label: 'Product', content: 'Cloud Database' }],
      },
    })
    expect(wrapper.find('.ant-descriptions-item-no-colon').exists()).toBe(true)
  })

  // ==================== Column ====================
  it('renders correct rows with numeric column', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: '1', content: 'a' },
          { label: '2', content: 'b' },
          { label: '3', content: 'c' },
          { label: '4', content: 'd' },
        ],
      },
    })
    // 4 items with column=3: row1 has 3 items, row2 has 1 item
    const rows = wrapper.findAll('tr.ant-descriptions-row')
    expect(rows).toHaveLength(2)
  })

  it('fills remaining columns for last item in row', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 6,
        items: [
          { label: '0', content: '' },
          { label: '1', content: '', span: 2 },
        ],
      },
    })
    const items = wrapper.findAll('.ant-descriptions-item')
    expect(items[0]?.attributes('colspan')).toBe('1')
    // last item should be filled to remaining 5 columns
    expect(items[1]?.attributes('colspan')).toBe('5')
  })

  // ==================== Span ====================
  it('respects numeric span', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: '0', content: '', span: 2 },
          { label: '1', content: '', span: 1 },
        ],
      },
    })
    const items = wrapper.findAll('.ant-descriptions-item')
    expect(items[0]?.attributes('colspan')).toBe('2')
    expect(items[1]?.attributes('colspan')).toBe('1')
  })

  it('span=filled takes remaining columns in a row', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: '0', content: 'a', span: 2 },
          { label: '1', content: 'b', span: 'filled' },
          { label: '2', content: 'c' },
        ],
      },
    })
    const rows = wrapper.findAll('tr.ant-descriptions-row')
    // span=filled causes current row to end → new row starts for item '2'
    expect(rows).toHaveLength(2)
  })

  // ==================== Attrs Passthrough ====================
  it('renders id prop on root element', () => {
    const wrapper = mount(Descriptions, {
      props: { id: 'my-desc', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').attributes('id')).toBe('my-desc')
  })

  it('passes data-* attributes to root', () => {
    const wrapper = mount(Descriptions, {
      attrs: {
        'data-testid': 'desc-test',
        'data-id': '123',
      },
      props: { items: basicItems },
    })
    const root = wrapper.find('.ant-descriptions')
    expect(root.attributes('data-testid')).toBe('desc-test')
    expect(root.attributes('data-id')).toBe('123')
  })

  it('passes aria-* attributes to root', () => {
    const wrapper = mount(Descriptions, {
      attrs: { 'aria-label': 'User info' },
      props: { items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').attributes('aria-label')).toBe('User info')
  })

  it('passes class attribute to root', () => {
    const wrapper = mount(Descriptions, {
      attrs: { class: 'custom-class' },
      props: { items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').classes()).toContain('custom-class')
  })

  it('passes style attribute to root', () => {
    const wrapper = mount(Descriptions, {
      attrs: { style: 'background-color: rgb(232, 232, 232);' },
      props: { items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').attributes('style')).toContain('background-color: rgb(232, 232, 232)')
  })

  // ==================== rootClass ====================
  it('applies rootClass to root element', () => {
    const wrapper = mount(Descriptions, {
      props: { rootClass: 'my-root', items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions').classes()).toContain('my-root')
  })

  // ==================== RTL ====================
  it('adds rtl class when direction=rtl', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => <Descriptions items={basicItems} />,
      },
    })
    expect(wrapper.find('.ant-descriptions-rtl').exists()).toBe(true)
  })

  it('does not add rtl class when direction=ltr', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'ltr' },
      slots: {
        default: () => <Descriptions items={basicItems} />,
      },
    })
    expect(wrapper.find('.ant-descriptions-rtl').exists()).toBe(false)
  })

  // ==================== labelRender / contentRender ====================
  it('supports labelRender prop to customize label', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud Database' }],
        labelRender: ({ value }: any) => `[${value}]`,
      },
    })
    expect(wrapper.find('.ant-descriptions-item-label').text()).toBe('[Product]')
  })

  it('supports contentRender prop to customize content', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Price', content: '100' }],
        contentRender: ({ value }: any) => `$${value}`,
      },
    })
    expect(wrapper.find('.ant-descriptions-item-content').text()).toBe('$100')
  })

  it('supports labelRender slot to customize label', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud Database' }],
      },
      slots: {
        labelRender: ({ value }: any) => `[${value}]`,
      },
    })
    expect(wrapper.find('.ant-descriptions-item-label').text()).toBe('[Product]')
  })

  // ==================== number 0 edge case ====================
  it('renders label=0 and content=0 correctly', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 0 as any, content: 0 as any }],
      },
    })
    expect(wrapper.find('.ant-descriptions-item-label').text()).toBe('0')
    expect(wrapper.find('.ant-descriptions-item-content').text()).toBe('0')
  })

  // ==================== ConfigProvider ====================
  it('inherits size from ConfigProvider componentSize', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: {
        default: () => <Descriptions bordered items={basicItems} />,
      },
    })
    expect(wrapper.find('.ant-descriptions-small').exists()).toBe(true)
  })

  it('component size prop overrides ConfigProvider size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentSize: 'small' },
      slots: {
        default: () => <Descriptions size="middle" items={basicItems} />,
      },
    })
    expect(wrapper.find('.ant-descriptions-middle').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-small').exists()).toBe(false)
  })

  // ==================== Dynamic Props Update ====================
  it('updates when items prop changes', async () => {
    const wrapper = mount(Descriptions, {
      props: { items: [{ label: 'A', content: '1' }] },
    })
    expect(wrapper.findAll('.ant-descriptions-item')).toHaveLength(1)

    await wrapper.setProps({ items: [{ label: 'A', content: '1' }, { label: 'B', content: '2' }] })
    expect(wrapper.findAll('.ant-descriptions-item')).toHaveLength(2)
  })

  it('updates when bordered changes', async () => {
    const wrapper = mount(Descriptions, {
      props: { bordered: false, items: basicItems },
    })
    expect(wrapper.find('.ant-descriptions-bordered').exists()).toBe(false)

    await wrapper.setProps({ bordered: true })
    expect(wrapper.find('.ant-descriptions-bordered').exists()).toBe(true)
  })

  // ==================== Item class / style ====================
  it('applies class on description item', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud', class: 'my-item-class' }],
      },
    })
    // non-bordered: class goes to td element
    expect(wrapper.find('td.my-item-class').exists()).toBe(true)
  })

  // ==================== span exceed column ====================
  it('truncates span when it exceeds column', () => {
    // column=3, item0 span=2, item1 span=2 → item1 span truncated to 1
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: '0', content: 'a', span: 2 },
          { label: '1', content: 'b', span: 2 },
        ],
      },
    })
    // Both items should be rendered (even with truncation)
    expect(wrapper.findAll('.ant-descriptions-item')).toHaveLength(2)
  })

  // ==================== labelRender / contentRender empty fallback ====================
  it('labelRender falls back to original label when render result is empty', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud' }],
        labelRender: () => null,
      },
    })
    // Should fall back to original label 'Product'
    expect(wrapper.find('.ant-descriptions-item-label').text()).toBe('Product')
  })

  it('contentRender falls back to original content when render result is empty', () => {
    const wrapper = mount(Descriptions, {
      props: {
        items: [{ label: 'Product', content: 'Cloud' }],
        contentRender: () => null,
      },
    })
    // Should fall back to original content 'Cloud'
    expect(wrapper.find('.ant-descriptions-item-content').text()).toBe('Cloud')
  })

  // ==================== Snapshot ====================
  it('matches snapshot with basic props', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 'User Info',
        bordered: true,
        column: 2,
        items: [
          { label: 'Name', content: 'Zhou Maomao' },
          { label: 'Phone', content: '1810000000' },
          { label: 'Address', content: 'Hangzhou', span: 2 },
        ],
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('matches snapshot with vertical layout', () => {
    const wrapper = mount(Descriptions, {
      props: {
        layout: 'vertical',
        column: 3,
        items: basicItems,
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
