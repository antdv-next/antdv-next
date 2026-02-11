import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Empty from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('empty', () => {
  mountTest(Empty)
  rtlTest(() => h(Empty))

  it('should render default empty', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.ant-empty').exists()).toBe(true)
    expect(wrapper.find('.ant-empty-image').exists()).toBe(true)
    expect(wrapper.find('.ant-empty-description').exists()).toBe(true)
    // default image is the large SVG (DefaultEmptyImg)
    expect(wrapper.find('.ant-empty-image svg').exists()).toBe(true)
  })

  it('should render default description from locale', () => {
    const wrapper = mount(Empty)
    // default locale description is "No data" or "暂无数据"
    expect(wrapper.find('.ant-empty-description').text()).toBeTruthy()
  })

  describe('description', () => {
    it('should render custom description via prop', () => {
      const wrapper = mount(Empty, {
        props: { description: 'Custom Description' },
      })
      expect(wrapper.find('.ant-empty-description').text()).toBe('Custom Description')
    })

    it('should render description via slot', () => {
      const wrapper = mount(Empty, {
        slots: { description: () => 'Slot Description' },
      })
      expect(wrapper.find('.ant-empty-description').text()).toBe('Slot Description')
    })

    it('slot should take priority over prop', () => {
      const wrapper = mount(Empty, {
        props: { description: 'Prop Description' },
        slots: { description: () => 'Slot Description' },
      })
      expect(wrapper.find('.ant-empty-description').text()).toBe('Slot Description')
    })

    it('should hide description when description is false', () => {
      const wrapper = mount(Empty, {
        props: { description: false as any },
      })
      expect(wrapper.find('.ant-empty-description').exists()).toBe(false)
    })

    it('should fallback to locale description when description is null', () => {
      const wrapper = mount(Empty, {
        props: { description: null as any },
      })
      // null triggers ?? fallback to locale description
      expect(wrapper.find('.ant-empty-description').exists()).toBe(true)
      expect(wrapper.find('.ant-empty-description').text()).toBeTruthy()
    })

    it('should hide description when description is empty string', () => {
      const wrapper = mount(Empty, {
        props: { description: '' },
      })
      expect(wrapper.find('.ant-empty-description').exists()).toBe(false)
    })
  })

  describe('image', () => {
    it('should render PRESENTED_IMAGE_SIMPLE with normal class', () => {
      const wrapper = mount(Empty, {
        props: { image: Empty.PRESENTED_IMAGE_SIMPLE },
      })
      expect(wrapper.find('.ant-empty-normal').exists()).toBe(true)
      // simple image is the smaller SVG
      expect(wrapper.find('.ant-empty-image svg').exists()).toBe(true)
    })

    it('should render PRESENTED_IMAGE_DEFAULT without normal class', () => {
      const wrapper = mount(Empty, {
        props: { image: Empty.PRESENTED_IMAGE_DEFAULT },
      })
      expect(wrapper.find('.ant-empty-normal').exists()).toBe(false)
    })

    it('should render string image as <img> tag', () => {
      const wrapper = mount(Empty, {
        props: { image: 'https://example.com/empty.png' },
      })
      const img = wrapper.find('.ant-empty-image img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('https://example.com/empty.png')
      expect(img.attributes('draggable')).toBe('false')
    })

    it('should use description as img alt when description is string', () => {
      const wrapper = mount(Empty, {
        props: {
          image: 'https://example.com/empty.png',
          description: 'No items found',
        },
      })
      expect(wrapper.find('img').attributes('alt')).toBe('No items found')
    })

    it('should use "empty" as img alt when description is not string', () => {
      const wrapper = mount(Empty, {
        props: {
          image: 'https://example.com/empty.png',
          description: false as any,
        },
      })
      expect(wrapper.find('img').attributes('alt')).toBe('empty')
    })

    it('should render image via slot', () => {
      const wrapper = mount(Empty, {
        slots: { image: () => <div class="custom-image">Custom</div> },
      })
      expect(wrapper.find('.custom-image').exists()).toBe(true)
    })

    it('image slot should take priority over prop', () => {
      const wrapper = mount(Empty, {
        props: { image: 'https://example.com/empty.png' },
        slots: { image: () => <div class="slot-image">Slot</div> },
      })
      expect(wrapper.find('.slot-image').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(false)
    })
  })

  describe('footer (default slot)', () => {
    it('should render footer when default slot has content', () => {
      const wrapper = mount(Empty, {
        slots: { default: () => <button>Create</button> },
      })
      expect(wrapper.find('.ant-empty-footer').exists()).toBe(true)
      expect(wrapper.find('.ant-empty-footer button').exists()).toBe(true)
    })

    it('should not render footer when no default slot', () => {
      const wrapper = mount(Empty)
      expect(wrapper.find('.ant-empty-footer').exists()).toBe(false)
    })

    it('should not render footer when default slot content is empty', () => {
      const wrapper = mount(Empty, {
        slots: { default: () => [null, undefined, ''] },
      })
      expect(wrapper.find('.ant-empty-footer').exists()).toBe(false)
    })
  })

  describe('semantic classes and styles', () => {
    it('should apply classes to all semantic elements', () => {
      const wrapper = mount(Empty, {
        props: {
          classes: {
            root: 'c-root',
            image: 'c-image',
            description: 'c-description',
            footer: 'c-footer',
          },
        },
        slots: { default: () => <button>Action</button> },
      })
      expect(wrapper.find('.ant-empty').classes()).toContain('c-root')
      expect(wrapper.find('.ant-empty-image').classes()).toContain('c-image')
      expect(wrapper.find('.ant-empty-description').classes()).toContain('c-description')
      expect(wrapper.find('.ant-empty-footer').classes()).toContain('c-footer')
    })

    it('should apply styles to all semantic elements', () => {
      const wrapper = mount(Empty, {
        props: {
          styles: {
            root: { padding: '10px' },
            image: { height: '20px' },
            description: { color: 'rgb(255, 0, 0)' },
            footer: { marginTop: '30px' },
          },
        },
        slots: { default: () => <button>Action</button> },
      })
      expect(wrapper.find('.ant-empty').attributes('style')).toContain('padding: 10px')
      expect(wrapper.find('.ant-empty-image').attributes('style')).toContain('height: 20px')
      expect(wrapper.find('.ant-empty-description').attributes('style')).toContain('color: rgb(255, 0, 0)')
      expect(wrapper.find('.ant-empty-footer').attributes('style')).toContain('margin-top: 30px')
    })
  })

  it('should support rootClass', () => {
    const wrapper = mount(Empty, {
      props: { rootClass: 'my-root' },
    })
    expect(wrapper.find('.ant-empty').classes()).toContain('my-root')
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => (
      <Empty style={{ color: 'red' }} />
    ))
    expect(wrapper.find('.ant-empty').attributes('style')).toContain('color: red')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Empty data-testid="my-empty" />
    ))
    expect(wrapper.find('[data-testid="my-empty"]').exists()).toBe(true)
  })

  describe('rTL direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Empty />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-empty-rtl').exists()).toBe(true)
    })

    it('should render correct snapshot in RTL', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Empty />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-empty').element).toMatchSnapshot()
    })
  })

  describe('configProvider integration', () => {
    it('should apply ConfigProvider direction', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Empty />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-empty-rtl').exists()).toBe(true)
    })
  })

  it('should update when props change dynamically', async () => {
    const desc = ref('Initial')
    const wrapper = mount(() => <Empty description={desc.value} />)
    expect(wrapper.find('.ant-empty-description').text()).toBe('Initial')

    desc.value = 'Updated'
    await nextTick()
    expect(wrapper.find('.ant-empty-description').text()).toBe('Updated')
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Empty description="Nothing here" image={Empty.PRESENTED_IMAGE_SIMPLE}>
        <button>Create Now</button>
      </Empty>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  describe('static properties', () => {
    it('should have PRESENTED_IMAGE_DEFAULT', () => {
      expect(Empty.PRESENTED_IMAGE_DEFAULT).toBeDefined()
    })

    it('should have PRESENTED_IMAGE_SIMPLE', () => {
      expect(Empty.PRESENTED_IMAGE_SIMPLE).toBeDefined()
    })
  })
})
