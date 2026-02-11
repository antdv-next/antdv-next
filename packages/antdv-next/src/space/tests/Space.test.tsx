import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Space from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('space', () => {
  mountTest(Space)
  rtlTest(() => h(Space, null, { default: () => [h('span', '1'), h('span', '2')] }))

  it('should render with children', () => {
    const wrapper = mount(Space, {
      slots: { default: () => [<span>1</span>, <span>2</span>] },
    })
    expect(wrapper.find('.ant-space').exists()).toBe(true)
    expect(wrapper.findAll('.ant-space-item').length).toBe(2)
  })

  it('should return null with empty children', () => {
    const wrapper = mount(Space)
    expect(wrapper.find('.ant-space').exists()).toBe(false)
  })

  it('should filter empty children', () => {
    const wrapper = mount(Space, {
      slots: { default: () => [<span>1</span>, null, undefined, '', <span>2</span>] },
    })
    expect(wrapper.findAll('.ant-space-item').length).toBe(2)
  })

  describe('orientation', () => {
    it('should render horizontal by default', () => {
      const wrapper = mount(Space, {
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-horizontal').exists()).toBe(true)
      expect(wrapper.find('.ant-space-vertical').exists()).toBe(false)
    })

    it('should render vertical orientation', () => {
      const wrapper = mount(Space, {
        props: { orientation: 'vertical' },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-vertical').exists()).toBe(true)
    })

    it('should render vertical via `vertical` prop', () => {
      const wrapper = mount(Space, {
        props: { vertical: true },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-vertical').exists()).toBe(true)
    })

    it('should support deprecated `direction` prop', () => {
      const wrapper = mount(Space, {
        props: { direction: 'vertical' },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-vertical').exists()).toBe(true)
    })
  })

  describe('size', () => {
    it('should apply small size class by default', () => {
      const wrapper = mount(Space, {
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-gap-row-small').exists()).toBe(true)
      expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(true)
    })

    it.each([
      ['small', '.ant-space-gap-row-small', '.ant-space-gap-col-small'],
      ['middle', '.ant-space-gap-row-middle', '.ant-space-gap-col-middle'],
      ['large', '.ant-space-gap-row-large', '.ant-space-gap-col-large'],
    ] as const)('should apply %s preset size', (size, rowClass, colClass) => {
      const wrapper = mount(Space, {
        props: { size },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find(rowClass).exists()).toBe(true)
      expect(wrapper.find(colClass).exists()).toBe(true)
    })

    it('should apply custom number size as gap style', () => {
      const wrapper = mount(Space, {
        props: { size: 10 },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      const style = wrapper.find('.ant-space').attributes('style')
      expect(style).toContain('column-gap: 10px')
      expect(style).toContain('row-gap: 10px')
      // no preset gap classes
      expect(wrapper.find('.ant-space-gap-row-small').exists()).toBe(false)
      expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(false)
    })

    it('should apply array size [horizontal, vertical]', () => {
      const wrapper = mount(Space, {
        props: { size: ['small', 20] as any },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      // horizontal is preset → gap-col class
      expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(true)
      // vertical is custom number → rowGap inline style
      const style = wrapper.find('.ant-space').attributes('style')
      expect(style).toContain('row-gap: 20px')
    })

    it('should not apply gap when size is 0', () => {
      const wrapper = mount(Space, {
        props: { size: 0 },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      const style = wrapper.find('.ant-space').attributes('style') || ''
      expect(style).not.toContain('column-gap')
      expect(style).not.toContain('row-gap')
      expect(wrapper.find('.ant-space-gap-row-small').exists()).toBe(false)
    })
  })

  describe('align', () => {
    it('should default to center align for horizontal', () => {
      const wrapper = mount(Space, {
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-align-center').exists()).toBe(true)
    })

    it('should not default to center align for vertical', () => {
      const wrapper = mount(Space, {
        props: { orientation: 'vertical' },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space-align-center').exists()).toBe(false)
    })

    it.each(['start', 'end', 'center', 'baseline'] as const)(
      'should apply %s align',
      (align) => {
        const wrapper = mount(Space, {
          props: { align },
          slots: { default: () => [<span>1</span>, <span>2</span>] },
        })
        expect(wrapper.find(`.ant-space-align-${align}`).exists()).toBe(true)
      },
    )
  })

  describe('wrap', () => {
    it('should apply flex-wrap style when wrap is true', () => {
      const wrapper = mount(Space, {
        props: { wrap: true },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space').attributes('style')).toContain('flex-wrap: wrap')
    })

    it('should not apply flex-wrap by default', () => {
      const wrapper = mount(Space, {
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      const style = wrapper.find('.ant-space').attributes('style') || ''
      expect(style).not.toContain('flex-wrap')
    })
  })

  describe('separator', () => {
    it('should render separator via prop', () => {
      const wrapper = mount(Space, {
        props: { separator: h('span', { class: 'sep' }, '|') },
        slots: { default: () => [<span>1</span>, <span>2</span>, <span>3</span>] },
      })
      const separators = wrapper.findAll('.ant-space-item-item-separator')
      // separator between items, not after last
      expect(separators.length).toBe(2)
    })

    it('should render separator via slot', () => {
      const wrapper = mount(Space, {
        slots: {
          default: () => [<span>1</span>, <span>2</span>],
          separator: () => <span class="custom-sep">|</span>,
        },
      })
      expect(wrapper.find('.custom-sep').exists()).toBe(true)
    })

    it('should not render separator after last item', () => {
      const wrapper = mount(Space, {
        slots: {
          default: () => [<span>1</span>],
          separator: () => <span class="custom-sep">|</span>,
        },
      })
      expect(wrapper.find('.custom-sep').exists()).toBe(false)
    })
  })

  describe('semantic classes and styles', () => {
    it('should apply classes to root and item', () => {
      const wrapper = mount(Space, {
        props: {
          classes: {
            root: 'c-root',
            item: 'c-item',
          },
        },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space').classes()).toContain('c-root')
      expect(wrapper.find('.ant-space-item').classes()).toContain('c-item')
    })

    it('should apply styles to root', () => {
      const wrapper = mount(Space, {
        props: {
          styles: {
            root: { padding: '10px' },
          },
        },
        slots: { default: () => [<span>1</span>, <span>2</span>] },
      })
      expect(wrapper.find('.ant-space').attributes('style')).toContain('padding: 10px')
    })

    it('should apply separator class and style via semantic', () => {
      const wrapper = mount(Space, {
        props: {
          classes: { separator: 'c-sep' },
          styles: { separator: { color: 'rgb(255, 0, 0)' } },
        },
        slots: {
          default: () => [<span>1</span>, <span>2</span>],
          separator: () => <span>|</span>,
        },
      })
      const sep = wrapper.find('.ant-space-item-item-separator')
      expect(sep.classes()).toContain('c-sep')
      expect(sep.attributes('style')).toContain('color: rgb(255, 0, 0)')
    })
  })

  it('should support rootClass', () => {
    const wrapper = mount(Space, {
      props: { rootClass: 'my-root' },
      slots: { default: () => [<span>1</span>, <span>2</span>] },
    })
    expect(wrapper.find('.ant-space').classes()).toContain('my-root')
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => (
      <Space style={{ color: 'red' }}>
        <span>1</span>
        <span>2</span>
      </Space>
    ))
    expect(wrapper.find('.ant-space').attributes('style')).toContain('color: red')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Space data-testid="my-space">
        <span>1</span>
        <span>2</span>
      </Space>
    ))
    expect(wrapper.find('[data-testid="my-space"]').exists()).toBe(true)
  })

  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Space>
            <span>1</span>
            <span>2</span>
          </Space>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-space-rtl').exists()).toBe(true)
    })
  })

  describe('configProvider', () => {
    it('should use size from ConfigProvider space config', () => {
      const wrapper = mount(() => (
        <ConfigProvider space={{ size: 'large' }}>
          <Space>
            <span>1</span>
            <span>2</span>
          </Space>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-space-gap-row-large').exists()).toBe(true)
      expect(wrapper.find('.ant-space-gap-col-large').exists()).toBe(true)
    })

    it('should use size 0 from ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider space={{ size: 0 }}>
          <Space>
            <span>1</span>
            <span>2</span>
          </Space>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-space-gap-row-small').exists()).toBe(false)
      expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(false)
    })

    it('should override ConfigProvider size with prop', () => {
      const wrapper = mount(() => (
        <ConfigProvider space={{ size: 'large' }}>
          <Space size="small">
            <span>1</span>
            <span>2</span>
          </Space>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-space-gap-row-small').exists()).toBe(true)
      expect(wrapper.find('.ant-space-gap-col-large').exists()).toBe(false)
    })
  })

  it('should update when props change dynamically', async () => {
    const size = ref<'small' | 'large'>('small')
    const wrapper = mount(() => (
      <Space size={size.value}>
        <span>1</span>
        <span>2</span>
      </Space>
    ))
    expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(true)

    size.value = 'large'
    await nextTick()
    expect(wrapper.find('.ant-space-gap-col-large').exists()).toBe(true)
    expect(wrapper.find('.ant-space-gap-col-small').exists()).toBe(false)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Space size="middle" wrap>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Space>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should render correct snapshot with separator', () => {
    const wrapper = mount(() => (
      <Space v-slots={{ separator: () => <span>|</span> }}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Space>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})
