import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const data = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
]

describe('table semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // ====================== Classes as Object ======================
  it('should apply semantic classes as object', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        classes: {
          root: 'c-root',
        },
      },
    })
    expect(wrapper.find('.ant-table-wrapper').classes()).toContain('c-root')
  })

  it('should apply section class', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        classes: {
          section: 'c-section',
        },
      },
    })
    // section maps to table content container
    expect(wrapper.html()).toContain('c-section')
  })

  it('should apply title and footer semantic classes', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        classes: {
          title: 'c-title',
          footer: 'c-footer',
        },
      },
      slots: {
        title: () => 'Title',
        footer: () => 'Footer',
      },
    })
    expect(wrapper.html()).toContain('c-title')
    expect(wrapper.html()).toContain('c-footer')
  })

  // ====================== Styles as Object ======================
  it('should apply semantic styles as object', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        styles: {
          root: { padding: '10px' },
        },
      },
    })
    expect(wrapper.find('.ant-table-wrapper').attributes('style')).toContain('padding: 10px')
  })

  // ====================== Classes as Function ======================
  it('should apply semantic classes as function', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        bordered: true,
        classes: ((info: any) => ({
          root: info?.props?.bordered ? 'bordered-root' : 'normal-root',
        })) as any,
      },
    })
    expect(wrapper.find('.ant-table-wrapper').classes()).toContain('bordered-root')
  })

  // ====================== Styles as Function ======================
  it('should apply semantic styles as function', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        size: 'small',
        styles: ((info: any) => ({
          root: { opacity: info?.props?.size === 'small' ? '0.8' : '1' },
        })) as any,
      },
    })
    expect(wrapper.find('.ant-table-wrapper').attributes('style')).toContain('opacity: 0.8')
  })

  // ====================== ConfigProvider Merging ======================
  it('should merge ConfigProvider and component classes', () => {
    const wrapper = mount(() => (
      <ConfigProvider table={{ classes: { root: 'ctx-root' }, styles: { root: { margin: '1px' } } }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          classes={{ root: 'comp-root' }}
          styles={{ root: { padding: '2px' } }}
        />
      </ConfigProvider>
    ))
    const root = wrapper.find('.ant-table-wrapper')
    expect(root.classes()).toContain('ctx-root')
    expect(root.classes()).toContain('comp-root')
    expect(root.attributes('style')).toContain('margin: 1px')
    expect(root.attributes('style')).toContain('padding: 2px')
  })

  // ====================== Header/Body Sub-Semantic ======================
  it('should support header sub-semantic classNames', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        classes: {
          header: { wrapper: 'h-wrapper' },
        },
      },
    })
    expect(wrapper.html()).toContain('h-wrapper')
  })

  it('should support body sub-semantic classNames', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        classes: {
          body: { wrapper: 'b-wrapper' },
        },
      },
    })
    expect(wrapper.html()).toContain('b-wrapper')
  })
})
