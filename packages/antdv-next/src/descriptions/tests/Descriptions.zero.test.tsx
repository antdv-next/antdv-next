import { describe, expect, it } from 'vitest'
import Descriptions from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59125
describe('descriptions numeric zero header', () => {
  it('renders the header when title is 0', () => {
    const wrapper = mount(Descriptions, { props: { title: 0 } })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('0')
  })

  it('renders the header when extra is 0', () => {
    const wrapper = mount(Descriptions, { props: { extra: 0 } })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-extra').text()).toBe('0')
  })

  it('omits the header for non-renderable title and extra', () => {
    const wrapper = mount(Descriptions, { props: { title: '', extra: false } })
    expect(wrapper.find('.ant-descriptions-header').exists()).toBe(false)
  })
})
