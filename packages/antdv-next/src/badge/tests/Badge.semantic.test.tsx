import type { BadgeProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Badge from '..'
import { mount } from '../../../../../tests/utils'

describe('badge.Semantic', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Badge, {
      props: {
        count: 5,
        classes: { root: 'custom-root', indicator: 'custom-indicator' },
        styles: { root: { margin: '10px' }, indicator: { fontSize: '16px' } },
      },
      slots: {
        default: () => <span>test</span>,
      },
    })

    const rootElement = wrapper.find('.ant-badge')
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('margin: 10px')

    const indicatorElement = wrapper.find('.ant-badge-count')
    expect(indicatorElement.classes()).toContain('custom-indicator')
    expect(indicatorElement.attributes('style')).toContain('font-size: 16px')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: BadgeProps }) => {
      if (info.props.status === 'error') {
        return { root: 'error-badge' }
      }
      return { root: 'default-badge' }
    })

    const stylesFn = vi.fn((info: { props: BadgeProps }) => {
      if (info.props.status === 'error') {
        return { root: { backgroundColor: '#fff2f0' } }
      }
      return { root: { backgroundColor: '#f6ffed' } }
    })

    const wrapper = mount(Badge, {
      props: {
        count: 5,
        status: 'error' as any,
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: {
        default: () => <span>test</span>,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const rootElement = wrapper.find('.ant-badge')
    expect(rootElement.classes()).toContain('error-badge')

    await wrapper.setProps({
      status: 'success' as any,
    })

    const updatedRootElement = wrapper.find('.ant-badge')
    expect(updatedRootElement.classes()).toContain('default-badge')
  })
})
