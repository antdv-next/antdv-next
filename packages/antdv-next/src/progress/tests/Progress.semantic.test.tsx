import type { ProgressProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Progress from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

describe('progress.Semantic', () => {
  // Semantic slots: root, body, rail, track, indicator
  it('should support classNames and styles', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        classes: {
          root: 'custom-root',
          body: 'custom-body',
          rail: 'custom-rail',
          track: 'custom-track',
          indicator: 'custom-indicator',
        },
        styles: {
          root: { margin: '10px' },
          body: { padding: '4px' },
          rail: { opacity: '0.5' },
          track: { opacity: '0.8' },
          indicator: { fontSize: '16px' },
        },
      },
    })

    const root = wrapper.find('.ant-progress')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('margin: 10px')

    const body = wrapper.find('.ant-progress-body')
    expect(body.classes()).toContain('custom-body')
    expect(body.attributes('style')).toContain('padding: 4px')

    const rail = wrapper.find('.ant-progress-rail')
    expect(rail.classes()).toContain('custom-rail')
    expect(rail.attributes('style')).toContain('opacity: 0.5')

    const track = wrapper.find('.ant-progress-track')
    expect(track.classes()).toContain('custom-track')
    expect(track.attributes('style')).toContain('opacity: 0.8')

    const indicator = wrapper.find('.ant-progress-indicator')
    expect(indicator.classes()).toContain('custom-indicator')
    expect(indicator.attributes('style')).toContain('font-size: 16px')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: ProgressProps }) => {
      if (info.props.status === 'exception') {
        return { root: 'error-progress', indicator: 'error-indicator' }
      }
      return { root: 'normal-progress', indicator: 'normal-indicator' }
    })

    const stylesFn = vi.fn((info: { props: ProgressProps }) => {
      if (info.props.status === 'exception') {
        return { root: { backgroundColor: '#fff2f0' } }
      }
      return { root: { backgroundColor: '#f6ffed' } }
    })

    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        status: 'exception',
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-progress')
    expect(root.classes()).toContain('error-progress')

    const indicator = wrapper.find('.ant-progress-indicator')
    expect(indicator.classes()).toContain('error-indicator')

    await wrapper.setProps({ status: 'active' })

    expect(wrapper.find('.ant-progress').classes()).toContain('normal-progress')
    expect(wrapper.find('.ant-progress-indicator').classes()).toContain('normal-indicator')
  })

  it('should merge classNames from ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider progress={{
            class: 'provider-cls',
            classes: { root: 'provider-root', indicator: 'provider-indicator' },
            styles: { root: { color: 'red' }, indicator: { color: 'blue' } },
          }}
          >
            <Progress
              percent={50}
              classes={{ root: 'comp-root', body: 'comp-body' }}
              styles={{ root: { margin: '5px' }, body: { padding: '2px' } }}
            />
          </ConfigProvider>
        )
      },
    })

    const root = wrapper.find('.ant-progress')
    // Both provider and component classNames should be merged
    expect(root.classes()).toContain('provider-root')
    expect(root.classes()).toContain('comp-root')
    expect(root.classes()).toContain('provider-cls')
    expect(root.attributes('style')).toContain('color: red')
    expect(root.attributes('style')).toContain('margin: 5px')

    const indicator = wrapper.find('.ant-progress-indicator')
    expect(indicator.classes()).toContain('provider-indicator')
    expect(indicator.attributes('style')).toContain('color: blue')

    const body = wrapper.find('.ant-progress-body')
    expect(body.classes()).toContain('comp-body')
    expect(body.attributes('style')).toContain('padding: 2px')
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider progress={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Progress style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })

    expectSemanticRootStylePriority(wrapper.find('.ant-progress').element)
    wrapper.unmount()
  })
})
