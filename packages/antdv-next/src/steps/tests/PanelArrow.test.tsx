import { describe, expect, it } from 'vitest'
import PanelArrow from '../PanelArrow'
import { mount } from '/@tests/utils'

describe('panelArrow', () => {
  it('should render svg element', () => {
    const wrapper = mount(PanelArrow, {
      props: {
        prefixCls: 'ant-steps',
      },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-panel-arrow').exists()).toBe(true)
  })

  it('should render with correct viewBox', () => {
    const wrapper = mount(PanelArrow, {
      props: {
        prefixCls: 'ant-steps',
      },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toBe('0 0 100 100')
  })

  it('should render path element', () => {
    const wrapper = mount(PanelArrow, {
      props: {
        prefixCls: 'ant-steps',
      },
    })
    expect(wrapper.find('path').exists()).toBe(true)
    expect(wrapper.find('path').attributes('d')).toBe('M 0 0 L 100 50 L 0 100')
  })

  it('should apply custom prefixCls', () => {
    const wrapper = mount(PanelArrow, {
      props: {
        prefixCls: 'custom-steps',
      },
    })
    expect(wrapper.find('.custom-steps-panel-arrow').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(PanelArrow, {
      props: {
        prefixCls: 'ant-steps',
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
