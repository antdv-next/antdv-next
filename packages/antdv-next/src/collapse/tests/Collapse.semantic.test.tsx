import type { CollapseProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Collapse from '..'
import { mount } from '/@tests/utils'

const openItems: CollapseProps['items'] = [
  { key: '1', label: 'Panel 1', content: h('p', 'Content 1') },
]

describe('collapse.Semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ==================== static object classes ====================
  it('supports static object classes on root, header, title, icon', () => {
    const classes: CollapseProps['classes'] = {
      root: 'custom-root',
      header: 'custom-header',
      title: 'custom-title',
      icon: 'custom-icon',
    }
    const wrapper = mount(Collapse, {
      props: { items: openItems, classes },
    })

    expect(wrapper.find('.ant-collapse').classes()).toContain('custom-root')
    expect(wrapper.find('.ant-collapse-header').classes()).toContain('custom-header')
    expect(wrapper.find('.ant-collapse-title').classes()).toContain('custom-title')
    expect(wrapper.find('.ant-collapse-expand-icon').classes()).toContain('custom-icon')
  })

  it('supports static object classes on body (with open panel)', () => {
    const classes: CollapseProps['classes'] = { body: 'custom-body' }
    const wrapper = mount(Collapse, {
      props: { items: openItems, classes, defaultActiveKey: ['1'] },
    })
    expect(wrapper.find('.ant-collapse-body').classes()).toContain('custom-body')
  })

  // ==================== static object styles ====================
  it('supports static object styles on root, header, body', () => {
    const styles: CollapseProps['styles'] = {
      root: { backgroundColor: 'red' },
      header: { color: 'blue' },
      body: { padding: '8px' },
    }
    const wrapper = mount(Collapse, {
      props: { items: openItems, styles, defaultActiveKey: ['1'] },
    })

    expect(wrapper.find('.ant-collapse').attributes('style')).toContain('background-color: red')
    expect(wrapper.find('.ant-collapse-header').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.ant-collapse-body').attributes('style')).toContain('padding: 8px')
  })

  // ==================== function-based classes ====================
  it('supports function-based classes', () => {
    const classes: CollapseProps['classes'] = (info) => {
      if (info.props.ghost) {
        return { root: 'ghost-root', header: 'ghost-header' }
      }
      return { root: 'normal-root' }
    }

    const wrapper = mount(Collapse, {
      props: { items: openItems, classes, ghost: true },
    })

    expect(wrapper.find('.ant-collapse').classes()).toContain('ghost-root')
    expect(wrapper.find('.ant-collapse-header').classes()).toContain('ghost-header')
  })

  it('function-based classes: else branch', () => {
    const classes: CollapseProps['classes'] = (info) => {
      if (info.props.ghost) {
        return { root: 'ghost-root' }
      }
      return { root: 'normal-root' }
    }

    const wrapper = mount(Collapse, {
      props: { items: openItems, classes, ghost: false },
    })

    expect(wrapper.find('.ant-collapse').classes()).toContain('normal-root')
    expect(wrapper.find('.ant-collapse').classes()).not.toContain('ghost-root')
  })

  // ==================== function-based styles ====================
  it('supports function-based styles', () => {
    const styles: CollapseProps['styles'] = (info) => {
      if (info.props.bordered === false) {
        return { root: { padding: '0px' } }
      }
      return { root: { padding: '8px' } }
    }

    const wrapper = mount(Collapse, {
      props: { items: openItems, styles, bordered: false },
    })

    expect(wrapper.find('.ant-collapse').attributes('style')).toContain('padding: 0px')
  })

  it('function-based styles: else branch', () => {
    const styles: CollapseProps['styles'] = (info) => {
      if (info.props.bordered === false) {
        return { root: { padding: '0px' } }
      }
      return { root: { padding: '8px' } }
    }

    const wrapper = mount(Collapse, {
      props: { items: openItems, styles, bordered: true },
    })

    expect(wrapper.find('.ant-collapse').attributes('style')).toContain('padding: 8px')
  })
})
