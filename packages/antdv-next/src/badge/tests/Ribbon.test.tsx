import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Badge from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount } from '../../../../../tests/utils'

describe('badge.Ribbon', () => {
  rtlTest(() => h(Badge.Ribbon, { text: 'test' }, { default: () => h('div', 'Content') }))

  it('should render ribbon', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Hippies">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('.ant-ribbon-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-ribbon').exists()).toBe(true)
    expect(wrapper.find('.ant-ribbon').text()).toContain('Hippies')
  })

  it('should render ribbon at start placement', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Start" placement="start">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('.ant-ribbon-placement-start').exists()).toBe(true)
  })

  it('should render ribbon at end placement by default', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="End">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('.ant-ribbon-placement-end').exists()).toBe(true)
  })

  it('should render ribbon with preset color', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Green" color="green">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('.ant-ribbon-color-green').exists()).toBe(true)
  })

  it('should render ribbon with custom color', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Custom" color="#f50">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    const ribbon = wrapper.find('.ant-ribbon')
    expect(ribbon.attributes('style')).toContain('background')
  })

  it('should render ribbon text slot', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon v-slots={{ text: () => <span class="custom-text">Slot Text</span> }}>
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('.custom-text').exists()).toBe(true)
    expect(wrapper.find('.custom-text').text()).toBe('Slot Text')
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Test" data-test="ribbon-test">
        <div>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.find('[data-test="ribbon-test"]').exists()).toBe(true)
  })

  it('should match ribbon snapshot', () => {
    const wrapper = mount(() => (
      <Badge.Ribbon text="Hippies" color="pink">
        <div style={{ height: '100px' }}>Content</div>
      </Badge.Ribbon>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
