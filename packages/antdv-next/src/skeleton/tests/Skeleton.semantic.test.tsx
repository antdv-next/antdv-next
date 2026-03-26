import type { SkeletonProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Skeleton from '..'
import { mount } from '/@tests/utils'

describe('skeleton.semantic', () => {
  it('should keep attrs.class, attrs.style and extra attrs on root', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: true,
        classes: {
          root: 'root-class-prop',
        },
        styles: {
          root: { padding: '8px' },
        },
      },
      attrs: {
        class: 'root-class-attr',
        style: { marginTop: '9px' },
        'data-testid': 'skeleton-root',
      },
    })

    const root = wrapper.find('.ant-skeleton')
    expect(root.classes()).toContain('root-class-prop')
    expect(root.classes()).toContain('root-class-attr')
    expect(root.attributes('style')).toContain('padding: 8px')
    expect(root.attributes('style')).toContain('margin-top: 9px')
    expect(root.attributes('data-testid')).toBe('skeleton-root')
  })

  // ==================== Function form ====================

  it('should support classNames as functions', async () => {
    const classesFn = vi.fn((info: { props: SkeletonProps }) => {
      if (info.props.active) {
        return {
          root: 'fn-root-active',
          header: 'fn-header-active',
          section: 'fn-section-active',
          avatar: 'fn-avatar-active',
          title: 'fn-title-active',
          paragraph: 'fn-paragraph-active',
        }
      }
      return {
        root: 'fn-root-inactive',
        header: 'fn-header-inactive',
        section: 'fn-section-inactive',
        avatar: 'fn-avatar-inactive',
        title: 'fn-title-inactive',
        paragraph: 'fn-paragraph-inactive',
      }
    })

    const stylesFn = vi.fn((info: { props: SkeletonProps }) => {
      if (info.props.active) {
        return {
          root: { color: 'rgb(255, 0, 0)' },
          header: { color: 'rgb(255, 0, 0)' },
          avatar: { color: 'rgb(255, 0, 0)' },
        }
      }
      return {
        root: { color: 'rgb(0, 0, 255)' },
        header: { color: 'rgb(0, 0, 255)' },
        avatar: { color: 'rgb(0, 0, 255)' },
      }
    })

    const active = ref(false)
    const wrapper = mount(() => (
      <Skeleton
        avatar
        active={active.value}
        classes={classesFn}
        styles={stylesFn}
      />
    ))

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    // inactive branch
    expect(wrapper.find('.ant-skeleton').classes()).toContain('fn-root-inactive')
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('color: rgb(0, 0, 255)')
    expect(wrapper.find('.ant-skeleton-header').classes()).toContain('fn-header-inactive')
    expect(wrapper.find('.ant-skeleton-section').classes()).toContain('fn-section-inactive')
    expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('fn-avatar-inactive')
    expect(wrapper.find('.ant-skeleton-title').classes()).toContain('fn-title-inactive')
    expect(wrapper.find('.ant-skeleton-paragraph').classes()).toContain('fn-paragraph-inactive')

    // switch to active
    active.value = true
    await nextTick()

    expect(wrapper.find('.ant-skeleton').classes()).toContain('fn-root-active')
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find('.ant-skeleton-header').classes()).toContain('fn-header-active')
    expect(wrapper.find('.ant-skeleton-section').classes()).toContain('fn-section-active')
    expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('fn-avatar-active')
    expect(wrapper.find('.ant-skeleton-title').classes()).toContain('fn-title-active')
    expect(wrapper.find('.ant-skeleton-paragraph').classes()).toContain('fn-paragraph-active')
  })

  // ==================== Object form ====================

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: true,
        classes: {
          root: 'obj-root',
          header: 'obj-header',
          section: 'obj-section',
          avatar: 'obj-avatar',
          title: 'obj-title',
          paragraph: 'obj-paragraph',
        },
        styles: {
          root: { padding: '10px' },
          header: { padding: '11px' },
          section: { padding: '12px' },
          avatar: { padding: '13px' },
          title: { padding: '14px' },
          paragraph: { padding: '15px' },
        },
      },
    })

    expect(wrapper.find('.ant-skeleton').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('padding: 10px')

    expect(wrapper.find('.ant-skeleton-header').classes()).toContain('obj-header')
    expect(wrapper.find('.ant-skeleton-header').attributes('style')).toContain('padding: 11px')

    expect(wrapper.find('.ant-skeleton-section').classes()).toContain('obj-section')
    expect(wrapper.find('.ant-skeleton-section').attributes('style')).toContain('padding: 12px')

    expect(wrapper.find('.ant-skeleton-avatar').classes()).toContain('obj-avatar')
    expect(wrapper.find('.ant-skeleton-avatar').attributes('style')).toContain('padding: 13px')

    expect(wrapper.find('.ant-skeleton-title').classes()).toContain('obj-title')
    expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('padding: 14px')

    expect(wrapper.find('.ant-skeleton-paragraph').classes()).toContain('obj-paragraph')
    expect(wrapper.find('.ant-skeleton-paragraph').attributes('style')).toContain('padding: 15px')
  })

  it('should merge semantic styles with attrs on title and paragraph nodes', () => {
    const wrapper = mount(Skeleton, {
      props: {
        styles: {
          title: { padding: '16px' },
          paragraph: { padding: '17px' },
        },
        title: true,
        paragraph: true,
      },
    })

    expect(wrapper.find('.ant-skeleton-title').attributes('style')).toContain('padding: 16px')
    expect(wrapper.find('.ant-skeleton-paragraph').attributes('style')).toContain('padding: 17px')
  })

  // ==================== Absent elements ====================

  it('should not break when avatar is absent', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: false,
        classes: {
          root: 'obj-root',
          header: 'obj-header',
          avatar: 'obj-avatar',
        },
      },
    })
    // root still gets class
    expect(wrapper.find('.ant-skeleton').classes()).toContain('obj-root')
    // header and avatar don't exist, no error
    expect(wrapper.find('.ant-skeleton-header').exists()).toBe(false)
  })

  it('should not break when title and paragraph are absent', () => {
    const wrapper = mount(Skeleton, {
      props: {
        title: false,
        paragraph: false,
        classes: {
          root: 'obj-root',
          section: 'obj-section',
          title: 'obj-title',
          paragraph: 'obj-paragraph',
        },
      },
    })
    expect(wrapper.find('.ant-skeleton').classes()).toContain('obj-root')
    expect(wrapper.find('.ant-skeleton-section').exists()).toBe(false)
  })

  // ==================== Styles function form ====================

  it('should support styles as functions', () => {
    const stylesFn = vi.fn(() => ({
      root: { background: 'rgb(200, 200, 200)' },
      section: { background: 'rgb(100, 100, 100)' },
    }))

    const wrapper = mount(Skeleton, {
      props: {
        styles: stylesFn,
      },
    })

    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-skeleton').attributes('style')).toContain('background: rgb(200, 200, 200)')
    expect(wrapper.find('.ant-skeleton-section').attributes('style')).toContain('background: rgb(100, 100, 100)')
  })
})
