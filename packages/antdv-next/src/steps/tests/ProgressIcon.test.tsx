import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ProgressIcon from '../ProgressIcon'
import { mount } from '/@tests/utils'

describe('progressIcon', () => {
  it('should render svg element', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 50,
      },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('.ant-steps-item-progress-icon-svg').exists()).toBe(true)
  })

  it('should render circles for progress', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 60,
      },
    })
    const circles = wrapper.findAll('circle')
    expect(circles.length).toBe(2)
    expect(circles[0]!.classes()).toContain('ant-steps-item-progress-icon-circle-rail')
    expect(circles[1]!.classes()).toContain('ant-steps-item-progress-icon-circle-ptg')
  })

  it('should apply correct percent value', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 75,
      },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('aria-valuenow')).toBe('75')
    expect(svg.attributes('aria-valuemin')).toBe('0')
    expect(svg.attributes('aria-valuemax')).toBe('100')
  })

  it('should render slot content', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 50,
      },
      slots: {
        default: () => h('span', { class: 'custom-content' }, '2'),
      },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('2')
  })

  it('should apply transform to progress circle', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 50,
      },
    })
    const progressCircle = wrapper.findAll('circle')[1]
    expect(progressCircle!.attributes('transform')).toBe('rotate(-90 50 50)')
  })

  it('should render with different percent values', () => {
    const percents = [0, 25, 50, 75, 100]
    percents.forEach((percent) => {
      const wrapper = mount(ProgressIcon, {
        props: {
          prefixCls: 'ant-steps',
          rootPrefixCls: 'ant',
          percent,
        },
      })
      const svg = wrapper.find('svg')
      expect(svg.attributes('aria-valuenow')).toBe(String(percent))
    })
  })

  it('should apply custom prefixCls', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'custom-steps',
        rootPrefixCls: 'custom',
        percent: 50,
      },
    })
    expect(wrapper.find('.custom-steps-item-progress-icon-svg').exists()).toBe(true)
    expect(wrapper.find('.custom-steps-item-progress-icon-circle').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(ProgressIcon, {
      props: {
        prefixCls: 'ant-steps',
        rootPrefixCls: 'ant',
        percent: 60,
      },
      slots: {
        default: () => h('span', null, '2'),
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
