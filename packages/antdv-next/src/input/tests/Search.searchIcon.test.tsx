import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Input from '..'
import { mount } from '/@tests/utils'

describe('input.Search searchIcon', () => {
  it('renders the default SearchOutlined when enterButton is boolean and no searchIcon is supplied', () => {
    const wrapper = mount(Input.Search, { props: { enterButton: true } })
    // SearchOutlined renders an <svg> inside the search button.
    const trigger = wrapper.find('.ant-input-search-btn')
    expect(trigger.exists()).toBe(true)
    expect(trigger.find('svg').exists()).toBe(true)
  })

  it('replaces the icon when searchIcon is supplied as a VNode', () => {
    const wrapper = mount(Input.Search, {
      props: { enterButton: true, searchIcon: h('span', { class: 'custom-search-icon' }, '🔍') },
    })
    expect(wrapper.find('.ant-input-search-btn .custom-search-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-input-search-btn .custom-search-icon').text()).toBe('🔍')
  })

  it('does not render an icon when enterButton is a non-boolean node', () => {
    const wrapper = mount(Input.Search, {
      props: { enterButton: 'Search now', searchIcon: h('span', { class: 'custom-search-icon' }) },
    })
    // When enterButton is a custom string, searchIcon is intentionally suppressed.
    expect(wrapper.find('.custom-search-icon').exists()).toBe(false)
  })

  it('renders the searchIcon slot (slot wins over prop and default)', () => {
    const wrapper = mount(Input.Search, {
      props: { enterButton: true, searchIcon: h('span', { class: 'from-prop' }, 'P') },
      slots: { searchIcon: () => h('span', { class: 'from-slot' }, 'S') },
    })
    expect(wrapper.find('.ant-input-search-btn .from-slot').exists()).toBe(true)
    expect(wrapper.find('.ant-input-search-btn .from-prop').exists()).toBe(false)
  })
})
