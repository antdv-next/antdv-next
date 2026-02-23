import type { CardMetaProps } from '../CardMeta'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { CardMeta } from '..'
import { mount } from '/@tests/utils'

describe('cardMeta semantic DOM', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: h('span', 'A'),
        title: 'Title',
        description: 'Description',
        classes: {
          root: 'custom-root',
          section: 'custom-section',
          avatar: 'custom-avatar',
          title: 'custom-title',
          description: 'custom-description',
        },
        styles: {
          root: { margin: '10px' },
          section: { padding: '5px' },
          avatar: { width: '40px' },
          title: { fontSize: '16px' },
          description: { color: 'gray' },
        },
      },
    })

    // root
    const root = wrapper.find('.ant-card-meta')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('margin: 10px')

    // avatar
    const avatar = wrapper.find('.ant-card-meta-avatar')
    expect(avatar.classes()).toContain('custom-avatar')
    expect(avatar.attributes('style')).toContain('width: 40px')

    // section
    const section = wrapper.find('.ant-card-meta-section')
    expect(section.classes()).toContain('custom-section')
    expect(section.attributes('style')).toContain('padding: 5px')

    // title
    const title = wrapper.find('.ant-card-meta-title')
    expect(title.classes()).toContain('custom-title')
    expect(title.attributes('style')).toContain('font-size: 16px')

    // description
    const description = wrapper.find('.ant-card-meta-description')
    expect(description.classes()).toContain('custom-description')
    expect(description.attributes('style')).toContain('color: gray')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: CardMetaProps }) => {
      if (info.props.title === 'Updated') {
        return { root: 'fn-updated', title: 'fn-title-updated' }
      }
      return { root: 'fn-initial', title: 'fn-title-initial' }
    })

    const stylesFn = vi.fn((info: { props: CardMetaProps }) => {
      if (info.props.title === 'Updated') {
        return { root: { padding: '20px' } }
      }
      return { root: { padding: '10px' } }
    })

    const wrapper = mount(CardMeta, {
      props: {
        title: 'Initial',
        description: 'Desc',
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-card-meta')
    expect(root.classes()).toContain('fn-initial')
    expect(root.attributes('style')).toContain('padding: 10px')

    const title = wrapper.find('.ant-card-meta-title')
    expect(title.classes()).toContain('fn-title-initial')

    // Test reactivity
    await wrapper.setProps({ title: 'Updated' })

    expect(root.classes()).toContain('fn-updated')
    expect(root.attributes('style')).toContain('padding: 20px')
    expect(title.classes()).toContain('fn-title-updated')
  })
})
