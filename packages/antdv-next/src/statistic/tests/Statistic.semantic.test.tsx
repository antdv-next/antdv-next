import type { StatisticProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Statistic from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

describe('statistic.semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classesFn = vi.fn((info: { props: StatisticProps }) => {
      if (info.props.precision === 2) {
        return {
          root: 'precision-root',
          header: 'precision-header',
          title: 'precision-title',
          content: 'precision-content',
          value: 'precision-value',
          prefix: 'precision-prefix',
          suffix: 'precision-suffix',
        }
      }
      return {
        root: 'default-root',
        header: 'default-header',
        title: 'default-title',
        content: 'default-content',
        value: 'default-value',
        prefix: 'default-prefix',
        suffix: 'default-suffix',
      }
    })

    const stylesFn = vi.fn((info: { props: StatisticProps }) => {
      if (info.props.precision === 2) {
        return { root: { color: 'rgb(255, 0, 0)' } }
      }
      return { root: { color: 'rgb(0, 0, 255)' } }
    })

    const wrapper = mount(Statistic, {
      props: {
        value: 11.28,
        title: 'Test',
        prefix: '$',
        suffix: '%',
        precision: 2,
        classes: classesFn,
        styles: stylesFn,
      },
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    // precision=2 branch
    expect(wrapper.find('.ant-statistic').classes()).toContain('precision-root')
    expect(wrapper.find('.ant-statistic-header').classes()).toContain('precision-header')
    expect(wrapper.find('.ant-statistic-title').classes()).toContain('precision-title')
    expect(wrapper.find('.ant-statistic-content').classes()).toContain('precision-content')
    expect(wrapper.find('.ant-statistic-content-value').classes()).toContain('precision-value')
    expect(wrapper.find('.ant-statistic-content-prefix').classes()).toContain('precision-prefix')
    expect(wrapper.find('.ant-statistic-content-suffix').classes()).toContain('precision-suffix')
    expect(wrapper.find('.ant-statistic').attributes('style')).toContain('color: rgb(255, 0, 0)')

    // Change precision → function should return different values
    await wrapper.setProps({ precision: 3 })
    expect(wrapper.find('.ant-statistic').classes()).toContain('default-root')
    expect(wrapper.find('.ant-statistic-header').classes()).toContain('default-header')
    expect(wrapper.find('.ant-statistic-title').classes()).toContain('default-title')
    expect(wrapper.find('.ant-statistic-content').classes()).toContain('default-content')
    expect(wrapper.find('.ant-statistic-content-value').classes()).toContain('default-value')
    expect(wrapper.find('.ant-statistic-content-prefix').classes()).toContain('default-prefix')
    expect(wrapper.find('.ant-statistic-content-suffix').classes()).toContain('default-suffix')
    expect(wrapper.find('.ant-statistic').attributes('style')).toContain('color: rgb(0, 0, 255)')
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 100,
        title: 'Test',
        prefix: '$',
        suffix: '%',
        classes: {
          root: 'c-root',
          header: 'c-header',
          title: 'c-title',
          content: 'c-content',
          value: 'c-value',
          prefix: 'c-prefix',
          suffix: 'c-suffix',
        },
        styles: {
          root: { padding: '10px' },
          header: { margin: '5px' },
          title: { fontWeight: 'bold' },
          content: { fontSize: '20px' },
          value: { color: 'purple' },
          prefix: { color: 'green' },
          suffix: { color: 'blue' },
        },
      },
    })

    expect(wrapper.find('.ant-statistic').classes()).toContain('c-root')
    expect(wrapper.find('.ant-statistic').attributes('style')).toContain('padding: 10px')

    expect(wrapper.find('.ant-statistic-header').classes()).toContain('c-header')
    expect(wrapper.find('.ant-statistic-header').attributes('style')).toContain('margin: 5px')

    expect(wrapper.find('.ant-statistic-title').classes()).toContain('c-title')
    expect(wrapper.find('.ant-statistic-title').attributes('style')).toContain('font-weight: bold')

    expect(wrapper.find('.ant-statistic-content').classes()).toContain('c-content')
    expect(wrapper.find('.ant-statistic-content').attributes('style')).toContain('font-size: 20px')

    expect(wrapper.find('.ant-statistic-content-value').classes()).toContain('c-value')
    expect(wrapper.find('.ant-statistic-content-value').attributes('style')).toContain('color: purple')

    expect(wrapper.find('.ant-statistic-content-prefix').classes()).toContain('c-prefix')
    expect(wrapper.find('.ant-statistic-content-prefix').attributes('style')).toContain('color: green')

    expect(wrapper.find('.ant-statistic-content-suffix').classes()).toContain('c-suffix')
    expect(wrapper.find('.ant-statistic-content-suffix').attributes('style')).toContain('color: blue')
  })

  it('should not break when semantic elements are absent', () => {
    // No title, no prefix, no suffix → header/title/prefix/suffix don't exist
    const wrapper = mount(Statistic, {
      props: {
        value: 100,
        classes: {
          root: 'c-root',
          header: 'c-header',
          title: 'c-title',
          content: 'c-content',
          prefix: 'c-prefix',
          suffix: 'c-suffix',
        },
      },
    })

    // Root and content still get their classes
    expect(wrapper.find('.ant-statistic').classes()).toContain('c-root')
    expect(wrapper.find('.ant-statistic-content').classes()).toContain('c-content')

    // Absent elements don't exist
    expect(wrapper.find('.ant-statistic-header').exists()).toBe(false)
    expect(wrapper.find('.ant-statistic-title').exists()).toBe(false)
    expect(wrapper.find('.ant-statistic-content-prefix').exists()).toBe(false)
    expect(wrapper.find('.ant-statistic-content-suffix').exists()).toBe(false)
  })

  it('should react to classNames function when props change', async () => {
    const classesFn = vi.fn((info: { props: StatisticProps }) => ({
      root: info.props.loading ? 'loading-root' : 'normal-root',
    }))

    const wrapper = mount(Statistic, {
      props: { value: 100, loading: false, classes: classesFn },
    })

    expect(wrapper.find('.ant-statistic').classes()).toContain('normal-root')

    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.ant-statistic').classes()).toContain('loading-root')
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider statistic={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Statistic title="Active" value={100} style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })
    expectSemanticRootStylePriority(wrapper.find('.ant-statistic').element)
    wrapper.unmount()
  })
})
