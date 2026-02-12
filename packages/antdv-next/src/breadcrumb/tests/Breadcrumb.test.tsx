import { HomeOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Breadcrumb from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount } from '../../../../../tests/utils'

describe('breadcrumb', () => {
  rtlTest(() => h(Breadcrumb, { items: [{ title: 'Home' }, { title: 'Current' }] }))

  it('should render basic items', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home' },
          { title: 'Application' },
          { title: 'Current' },
        ],
      },
    })
    expect(wrapper.find('.ant-breadcrumb').exists()).toBe(true)
    expect(wrapper.findAll('.ant-breadcrumb-link').length).toBe(3)
  })

  it('should render separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home' },
          { title: 'Current' },
        ],
      },
    })
    expect(wrapper.find('.ant-breadcrumb-separator').exists()).toBe(true)
    expect(wrapper.find('.ant-breadcrumb-separator').text()).toBe('/')
  })

  it('should render custom separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '>',
        items: [
          { title: 'Home' },
          { title: 'Current' },
        ],
      },
    })
    expect(wrapper.find('.ant-breadcrumb-separator').text()).toBe('>')
  })

  it('should render item with href as link', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Current' },
        ],
      },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/')
  })

  it('should render item with path', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', path: '/home' },
          { title: 'Detail', path: '/detail' },
        ],
      },
    })
    const links = wrapper.findAll('a')
    expect(links.length).toBe(2)
    expect(links[0].attributes('href')).toBe('#/home')
    expect(links[1].attributes('href')).toBe('#/home/detail')
  })

  it('should support onClick on items', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', onClick },
          { title: 'Current' },
        ],
      },
    })
    await wrapper.find('.ant-breadcrumb-link').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should render with BreadcrumbItem children', () => {
    const wrapper = mount(() => (
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Application</Breadcrumb.Item>
      </Breadcrumb>
    ))
    expect(wrapper.find('.ant-breadcrumb').exists()).toBe(true)
  })

  it('should render with custom BreadcrumbSeparator', () => {
    const wrapper = mount(() => (
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Separator>-</Breadcrumb.Separator>
        <Breadcrumb.Item>Current</Breadcrumb.Item>
      </Breadcrumb>
    ))
    expect(wrapper.text()).toContain('-')
  })

  it('should render with icon in title', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: h(HomeOutlined) },
          { title: 'Current' },
        ],
      },
    })
    expect(wrapper.find('.anticon-home').exists()).toBe(true)
  })

  it('should support itemRender', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Current' },
        ],
        itemRender: ({ title, href }: any) => {
          return href ? h('a', { href, class: 'custom-link' }, title) : h('span', title)
        },
      },
    })
    expect(wrapper.find('.custom-link').exists()).toBe(true)
  })

  it('should render item with menu dropdown', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home' },
          {
            title: 'Application',
            menu: {
              items: [
                { key: '1', label: 'App1' },
                { key: '2', label: 'App2' },
              ],
            },
          },
          { title: 'Current' },
        ],
      },
    })
    expect(wrapper.find('.ant-breadcrumb').exists()).toBe(true)
    expect(wrapper.findAll('.ant-breadcrumb-link').length).toBe(3)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Breadcrumb data-test="breadcrumb-test" items={[{ title: 'Home' }]} />
    ))
    expect(wrapper.find('[data-test="breadcrumb-test"]').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Breadcrumb
        items={[
          { title: 'Home', href: '/' },
          { title: 'Application', href: '/app' },
          { title: 'Current' },
        ]}
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match separator snapshot', () => {
    const wrapper = mount(() => (
      <Breadcrumb
        separator=">"
        items={[
          { title: 'Home' },
          { title: 'Current' },
        ]}
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
