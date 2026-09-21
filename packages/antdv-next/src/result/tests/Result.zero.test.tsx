import { describe, expect, it } from 'vitest'
import Result from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59153
describe('result numeric zero content', () => {
  it('renders `icon={0}` instead of falling back to the status icon', () => {
    const wrapper = mount(Result, {
      props: { status: 'info', icon: 0 },
    })
    const icon = wrapper.find('.ant-result-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('0')
    expect(icon.find('.anticon').exists()).toBe(false)
  })

  it('still falls back to the status icon when icon is an empty string', () => {
    const wrapper = mount(Result, {
      props: { status: 'info', icon: '' },
    })
    expect(wrapper.find('.ant-result-icon .anticon').exists()).toBe(true)
  })
})
