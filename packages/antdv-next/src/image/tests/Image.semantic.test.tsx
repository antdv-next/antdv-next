import type { ImageProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Image from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const src = 'https://example.com/test.png'

describe('image.Semantic', () => {
  // Image semantic slots: root, image, cover
  // Plus popup: { root, mask, body, footer, actions }

  it('should support classNames and styles for root, image, and cover', () => {
    const wrapper = mount(Image, {
      props: {
        src,
        classes: { root: 'custom-root', image: 'custom-image', cover: 'custom-cover' },
        styles: { root: { margin: '10px' }, image: { borderRadius: '8px' } },
      },
    })

    const rootEl = wrapper.find('.ant-image')
    expect(rootEl.classes()).toContain('custom-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')

    const imgEl = wrapper.find('img')
    expect(imgEl.classes()).toContain('custom-image')
    expect(imgEl.attributes('style')).toContain('border-radius: 8px')

    const coverEl = wrapper.find('.ant-image-cover')
    expect(coverEl.classes()).toContain('custom-cover')
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((info: { props: ImageProps }) => {
      if (info.props.rootClass === 'special') {
        return { root: 'fn-special' }
      }
      return { root: 'fn-default' }
    })

    const wrapper = mount(Image, {
      props: {
        src,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-image').classes()).toContain('fn-default')

    await wrapper.setProps({ rootClass: 'special' })
    expect(wrapper.find('.ant-image').classes()).toContain('fn-special')
  })

  it('should merge context and component classNames and styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        image: {
          classes: { root: 'context-root', image: 'context-image' },
          styles: { root: { margin: '10px' } },
        },
      },
      slots: {
        default: () => (
          <Image
            src={src}
            classes={{ root: 'component-root' }}
            styles={{ root: { padding: '5px' } }}
          />
        ),
      },
    })

    const rootEl = wrapper.find('.ant-image')
    expect(rootEl.classes()).toContain('context-root')
    expect(rootEl.classes()).toContain('component-root')
    expect(rootEl.attributes('style')).toContain('margin: 10px')
    expect(rootEl.attributes('style')).toContain('padding: 5px')

    const imgEl = wrapper.find('img')
    expect(imgEl.classes()).toContain('context-image')
  })
})
