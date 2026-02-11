import type { EmptyProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Empty from '..'
import { mount } from '/@tests/utils'

describe('empty.Semantic', () => {
  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: EmptyProps }) => {
      if (info.props.image === Empty.PRESENTED_IMAGE_SIMPLE) {
        return { root: 'simple-root', image: 'simple-image', description: 'simple-desc', footer: 'simple-footer' }
      }
      return { root: 'default-root', image: 'default-image', description: 'default-desc', footer: 'default-footer' }
    })

    const stylesFn = vi.fn((info: { props: EmptyProps }) => {
      if (info.props.image === Empty.PRESENTED_IMAGE_SIMPLE) {
        return { root: { color: 'rgb(255, 0, 0)' }, image: { opacity: '0.5' } }
      }
      return { root: { color: 'rgb(0, 0, 255)' }, image: { opacity: '1' } }
    })

    const wrapper = mount(Empty, {
      props: {
        image: Empty.PRESENTED_IMAGE_SIMPLE,
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => <button>Create</button> },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    // Verify simple image branch values
    const root = wrapper.find('.ant-empty')
    expect(root.classes()).toContain('simple-root')
    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')

    const image = wrapper.find('.ant-empty-image')
    expect(image.classes()).toContain('simple-image')
    expect(image.attributes('style')).toContain('opacity: 0.5')

    const description = wrapper.find('.ant-empty-description')
    expect(description.classes()).toContain('simple-desc')

    const footer = wrapper.find('.ant-empty-footer')
    expect(footer.classes()).toContain('simple-footer')

    // Update props — function should return different values
    await wrapper.setProps({ image: Empty.PRESENTED_IMAGE_DEFAULT })

    const updatedRoot = wrapper.find('.ant-empty')
    expect(updatedRoot.classes()).toContain('default-root')
    expect(updatedRoot.attributes('style')).toContain('color: rgb(0, 0, 255)')

    const updatedImage = wrapper.find('.ant-empty-image')
    expect(updatedImage.classes()).toContain('default-image')
    expect(updatedImage.attributes('style')).toContain('opacity: 1')

    const updatedDescription = wrapper.find('.ant-empty-description')
    expect(updatedDescription.classes()).toContain('default-desc')

    const updatedFooter = wrapper.find('.ant-empty-footer')
    expect(updatedFooter.classes()).toContain('default-footer')
  })

  it('should apply object classNames and styles to all semantic elements', () => {
    const wrapper = mount(Empty, {
      props: {
        classes: {
          root: 'custom-root',
          image: 'custom-image',
          description: 'custom-desc',
          footer: 'custom-footer',
        },
        styles: {
          root: { padding: '10px' },
          image: { height: '50px' },
          description: { color: 'rgb(0, 128, 0)' },
          footer: { marginTop: '20px' },
        },
      },
      slots: { default: () => <button>Action</button> },
    })

    // root
    const root = wrapper.find('.ant-empty')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('padding: 10px')

    // image
    const image = wrapper.find('.ant-empty-image')
    expect(image.classes()).toContain('custom-image')
    expect(image.attributes('style')).toContain('height: 50px')

    // description
    const description = wrapper.find('.ant-empty-description')
    expect(description.classes()).toContain('custom-desc')
    expect(description.attributes('style')).toContain('color: rgb(0, 128, 0)')

    // footer
    const footer = wrapper.find('.ant-empty-footer')
    expect(footer.classes()).toContain('custom-footer')
    expect(footer.attributes('style')).toContain('margin-top: 20px')
  })

  it('should not render description/footer semantic when elements are absent', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'fn-root',
      image: 'fn-image',
      description: 'fn-desc',
      footer: 'fn-footer',
    }))

    const wrapper = mount(Empty, {
      props: {
        description: false as any,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root and image should have classes
    expect(wrapper.find('.ant-empty').classes()).toContain('fn-root')
    expect(wrapper.find('.ant-empty-image').classes()).toContain('fn-image')

    // description and footer should not exist
    expect(wrapper.find('.ant-empty-description').exists()).toBe(false)
    expect(wrapper.find('.ant-empty-footer').exists()).toBe(false)
  })

  it('should react to classNames function when props change', async () => {
    const classNamesFn = vi.fn((info: { props: EmptyProps }) => ({
      root: info.props.description === 'Error' ? 'error-root' : 'normal-root',
    }))

    const wrapper = mount(Empty, {
      props: {
        description: 'Normal',
        classes: classNamesFn,
      },
    })

    expect(wrapper.find('.ant-empty').classes()).toContain('normal-root')

    await wrapper.setProps({ description: 'Error' })
    expect(wrapper.find('.ant-empty').classes()).toContain('error-root')
  })
})
