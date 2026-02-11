import type { ResultProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Result from '..'
import { mount } from '/@tests/utils'

describe('result.semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: ResultProps }) => {
      if (info.props.status === 'success') {
        return {
          root: 'fn-success-root',
          icon: 'fn-success-icon',
          title: 'fn-success-title',
          subTitle: 'fn-success-sub',
          extra: 'fn-success-extra',
          body: 'fn-success-body',
        }
      }
      return {
        root: 'fn-error-root',
        icon: 'fn-error-icon',
        title: 'fn-error-title',
        subTitle: 'fn-error-sub',
        extra: 'fn-error-extra',
        body: 'fn-error-body',
      }
    })

    const stylesFn = vi.fn((info: { props: ResultProps }) => {
      if (info.props.status === 'success') {
        return { root: { color: 'rgb(0, 128, 0)' } }
      }
      return { root: { color: 'rgb(255, 0, 0)' } }
    })

    const wrapper = mount(Result, {
      props: {
        status: 'success',
        title: 'Title',
        subTitle: 'Sub',
        extra: h('button', 'Action'),
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => <div>Body</div> },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-result').classes()).toContain('fn-success-root')
    expect(wrapper.find('.ant-result-icon').classes()).toContain('fn-success-icon')
    expect(wrapper.find('.ant-result-title').classes()).toContain('fn-success-title')
    expect(wrapper.find('.ant-result-subtitle').classes()).toContain('fn-success-sub')
    expect(wrapper.find('.ant-result-extra').classes()).toContain('fn-success-extra')
    expect(wrapper.find('.ant-result-body').classes()).toContain('fn-success-body')
    expect(wrapper.find('.ant-result').attributes('style')).toContain('color: rgb(0, 128, 0)')

    await wrapper.setProps({ status: 'error' })
    expect(wrapper.find('.ant-result').classes()).toContain('fn-error-root')
    expect(wrapper.find('.ant-result').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Result, {
      props: {
        title: 'Title',
        subTitle: 'Sub',
        extra: h('button', 'Action'),
        classes: {
          root: 'obj-root',
          icon: 'obj-icon',
          title: 'obj-title',
          subTitle: 'obj-sub',
          extra: 'obj-extra',
          body: 'obj-body',
        },
        styles: {
          root: { padding: '1px' },
          icon: { padding: '2px' },
          title: { padding: '3px' },
          subTitle: { padding: '4px' },
          extra: { padding: '5px' },
          body: { padding: '6px' },
        },
      },
      slots: { default: () => <div>Body</div> },
    })

    expect(wrapper.find('.ant-result').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-result-icon').classes()).toContain('obj-icon')
    expect(wrapper.find('.ant-result-title').classes()).toContain('obj-title')
    expect(wrapper.find('.ant-result-subtitle').classes()).toContain('obj-sub')
    expect(wrapper.find('.ant-result-extra').classes()).toContain('obj-extra')
    expect(wrapper.find('.ant-result-body').classes()).toContain('obj-body')

    expect(wrapper.find('.ant-result').attributes('style')).toContain('padding: 1px')
    expect(wrapper.find('.ant-result-icon').attributes('style')).toContain('padding: 2px')
    expect(wrapper.find('.ant-result-title').attributes('style')).toContain('padding: 3px')
    expect(wrapper.find('.ant-result-subtitle').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.ant-result-extra').attributes('style')).toContain('padding: 5px')
    expect(wrapper.find('.ant-result-body').attributes('style')).toContain('padding: 6px')
  })

  it('should not break when subTitle/extra/body are absent', () => {
    const wrapper = mount(Result, {
      props: {
        title: 'Title',
        classes: {
          root: 'obj-root',
          icon: 'obj-icon',
          title: 'obj-title',
          subTitle: 'obj-sub',
          extra: 'obj-extra',
          body: 'obj-body',
        },
      },
    })

    // present elements still get classes
    expect(wrapper.find('.ant-result').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-result-icon').classes()).toContain('obj-icon')
    expect(wrapper.find('.ant-result-title').classes()).toContain('obj-title')

    // absent elements don't exist
    expect(wrapper.find('.ant-result-subtitle').exists()).toBe(false)
    expect(wrapper.find('.ant-result-extra').exists()).toBe(false)
    expect(wrapper.find('.ant-result-body').exists()).toBe(false)
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: ResultProps }) => ({
      root: info.props.status === 'success' ? 'active-root' : 'inactive-root',
    }))

    const wrapper = mount(Result, {
      props: { status: 'error', classes: classNamesFn },
    })
    expect(wrapper.find('.ant-result').classes()).toContain('inactive-root')

    await wrapper.setProps({ status: 'success' })
    expect(wrapper.find('.ant-result').classes()).toContain('active-root')
  })
})
