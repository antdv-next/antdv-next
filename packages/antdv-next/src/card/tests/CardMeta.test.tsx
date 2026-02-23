import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { CardMeta } from '..'
import { mount } from '/@tests/utils'

describe('cardMeta', () => {
  it('should render basic CardMeta', () => {
    const wrapper = mount(CardMeta, {
      props: {
        title: 'Title',
        description: 'Description',
      },
    })
    expect(wrapper.find('.ant-card-meta').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-title').text()).toBe('Title')
    expect(wrapper.find('.ant-card-meta-description').text()).toBe('Description')
  })

  it('should render avatar prop', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: h('span', { class: 'avatar-icon' }, 'A'),
        title: 'Title',
      },
    })
    expect(wrapper.find('.ant-card-meta-avatar').exists()).toBe(true)
    expect(wrapper.find('.avatar-icon').exists()).toBe(true)
  })

  it('should render avatar, title, description via slots', () => {
    const wrapper = mount(CardMeta, {
      slots: {
        avatar: () => h('span', 'Avatar'),
        title: () => 'Slot Title',
        description: () => 'Slot Description',
      },
    })
    expect(wrapper.find('.ant-card-meta-avatar').text()).toBe('Avatar')
    expect(wrapper.find('.ant-card-meta-title').text()).toBe('Slot Title')
    expect(wrapper.find('.ant-card-meta-description').text()).toBe('Slot Description')
  })

  it('should render section when only title is provided', () => {
    const wrapper = mount(CardMeta, {
      props: { title: 'Title Only' },
    })
    expect(wrapper.find('.ant-card-meta-section').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-title').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-avatar').exists()).toBe(false)
  })

  it('should render section when only description is provided', () => {
    const wrapper = mount(CardMeta, {
      props: { description: 'Desc Only' },
    })
    expect(wrapper.find('.ant-card-meta-section').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-description').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-avatar').exists()).toBe(false)
  })

  it('should not render section when no title or description', () => {
    const wrapper = mount(CardMeta, {
      props: { avatar: h('span', 'A') },
    })
    expect(wrapper.find('.ant-card-meta-avatar').exists()).toBe(true)
    expect(wrapper.find('.ant-card-meta-section').exists()).toBe(false)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <CardMeta
        avatar={<span>A</span>}
        title="Card Meta Title"
        description="Card Meta Description"
      />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
