import type { RibbonProps } from '../Ribbon'
import { describe, expect, it, vi } from 'vitest'
import Badge from '..'
import { mount } from '../../../../../tests/utils'

describe('ribbon.Semantic', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Badge.Ribbon, {
      props: {
        text: 'Test',
        classes: { root: 'custom-root', content: 'custom-content', indicator: 'custom-indicator' },
        styles: { root: { margin: '10px' }, content: { fontSize: '16px' }, indicator: { padding: '5px' } },
      },
      slots: {
        default: () => <div>Content</div>,
      },
    })

    const rootElement = wrapper.find('.ant-ribbon-wrapper')
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('margin: 10px')

    const contentElement = wrapper.find('.ant-ribbon-content')
    expect(contentElement.classes()).toContain('custom-content')
    expect(contentElement.attributes('style')).toContain('font-size: 16px')

    const indicatorElement = wrapper.find('.ant-ribbon')
    expect(indicatorElement.classes()).toContain('custom-indicator')
    expect(indicatorElement.attributes('style')).toContain('padding: 5px')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: RibbonProps }) => {
      if (info.props.placement === 'start') {
        return { root: 'start-ribbon', indicator: 'start-indicator' }
      }
      return { root: 'end-ribbon', indicator: 'end-indicator' }
    })

    const stylesFn = vi.fn((info: { props: RibbonProps }) => {
      if (info.props.placement === 'start') {
        return { root: { backgroundColor: '#fff2f0' } }
      }
      return { root: { backgroundColor: '#f6ffed' } }
    })

    const wrapper = mount(Badge.Ribbon, {
      props: {
        text: 'Test',
        placement: 'start',
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: {
        default: () => <div>Content</div>,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-ribbon-wrapper')
    expect(rootElement.classes()).toContain('start-ribbon')

    await wrapper.setProps({
      placement: 'end',
    })

    const updatedRootElement = wrapper.find('.ant-ribbon-wrapper')
    expect(updatedRootElement.classes()).toContain('end-ribbon')
  })
})
