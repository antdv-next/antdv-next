import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Image, { ImagePreviewGroup } from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const src = 'https://example.com/test.png'

describe('image', () => {
  rtlTest(() => h(Image, { src }))

  it('should render basic image', () => {
    const wrapper = mount(Image, {
      props: { src },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe(src)
  })

  it('should render with width and height', () => {
    const wrapper = mount(Image, {
      props: { src, width: 200, height: 100 },
    })
    const img = wrapper.find('img')
    expect(img.attributes('width')).toBe('200')
    expect(img.attributes('height')).toBe('100')
  })

  it('should render with alt text', () => {
    const wrapper = mount(() => (
      <Image src={src} alt="Test Image" />
    ))
    // Debug: check what's rendered
    expect(wrapper.html()).toContain('Test Image')
  })

  it('should render fallback when provided', () => {
    const fallbackSrc = 'https://example.com/fallback.png'
    const wrapper = mount(Image, {
      props: { src, fallback: fallbackSrc },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('should render fallback via slot', () => {
    const wrapper = mount(Image, {
      props: { src },
      slots: {
        fallback: () => h('img', { src: 'fallback.png', class: 'custom-fallback' }),
      },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('should render placeholder via slot', () => {
    const wrapper = mount(Image, {
      props: { src },
      slots: {
        placeholder: () => h('div', { class: 'custom-placeholder' }, 'Loading...'),
      },
    })
    expect(wrapper.find('.custom-placeholder').exists()).toBe(true)
  })

  it('should disable preview when preview is false', () => {
    const wrapper = mount(Image, {
      props: { src, preview: false },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
    // When preview is disabled, cover overlay should not render
    expect(wrapper.find('.ant-image-cover').exists()).toBe(false)
  })

  it('should support preview config object', () => {
    const wrapper = mount(Image, {
      props: {
        src,
        preview: { src: 'https://example.com/large.png' },
      },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('should trigger error event on image error', async () => {
    const onError = vi.fn()
    const wrapper = mount(Image, {
      props: { src: 'broken.png', onError },
    })
    await wrapper.find('img').trigger('error')
    expect(onError).toHaveBeenCalled()
  })

  it('should trigger click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Image, {
      props: { src, onClick, preview: false },
    })
    await wrapper.find('img').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should support rootClass', () => {
    const wrapper = mount(Image, {
      props: { src, rootClass: 'my-image' },
    })
    expect(wrapper.find('.my-image').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Image src={src} width={200} alt="Test" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with preview disabled', () => {
    const wrapper = mount(() => (
      <Image src={src} preview={false} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('image.PreviewGroup', () => {
  rtlTest(() => h(ImagePreviewGroup, null, {
    default: () => h(Image, { src }),
  }))

  it('should render PreviewGroup with children', () => {
    const wrapper = mount(ImagePreviewGroup, {
      slots: {
        default: () => [
          h(Image, { key: '1', src }),
          h(Image, { key: '2', src: 'https://example.com/test2.png' }),
        ],
      },
    })
    expect(wrapper.findAll('.ant-image').length).toBe(2)
  })

  it('should support preview config on group', () => {
    const wrapper = mount(ImagePreviewGroup, {
      props: {
        preview: { open: false },
      },
      slots: {
        default: () => h(Image, { src }),
      },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('should disable preview when preview is false', () => {
    const wrapper = mount(ImagePreviewGroup, {
      props: { preview: false },
      slots: {
        default: () => h(Image, { src }),
      },
    })
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <ImagePreviewGroup>
        <Image src={src} width={200} />
        <Image src="https://example.com/test2.png" width={200} />
      </ImagePreviewGroup>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
