import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Flex from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('flex', () => {
  mountTest(() => h(Flex, null, { default: () => [h('div', 'test')] }))
  rtlTest(() => h(Flex, null, { default: () => [h('div', 'test')] }))

  it('should render with children', () => {
    const wrapper = mount(Flex, {
      slots: { default: () => [<div>1</div>, <div>2</div>] },
    })
    expect(wrapper.find('.ant-flex').exists()).toBe(true)
  })

  describe('vertical', () => {
    it('should render horizontal by default', () => {
      const wrapper = mount(Flex, {
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-vertical').exists()).toBe(false)
    })

    it('should render vertical', () => {
      const wrapper = mount(Flex, {
        props: { vertical: true },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-vertical').exists()).toBe(true)
    })

    it('should default to align-stretch when vertical without explicit align', () => {
      const wrapper = mount(Flex, {
        props: { vertical: true },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-align-stretch').exists()).toBe(true)
    })

    it('should not default to stretch when vertical with explicit align', () => {
      const wrapper = mount(Flex, {
        props: { vertical: true, align: 'center' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-align-center').exists()).toBe(true)
      expect(wrapper.find('.ant-flex-align-stretch').exists()).toBe(false)
    })
  })

  describe('wrap', () => {
    it('should apply wrap class when wrap is true', () => {
      const wrapper = mount(Flex, {
        props: { wrap: true },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-wrap-wrap').exists()).toBe(true)
    })

    it('should apply wrap class when wrap is string "wrap"', () => {
      const wrapper = mount(Flex, {
        props: { wrap: 'wrap' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-wrap-wrap').exists()).toBe(true)
    })

    it('should apply wrap-reverse class', () => {
      const wrapper = mount(Flex, {
        props: { wrap: 'wrap-reverse' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-wrap-wrap-reverse').exists()).toBe(true)
    })

    it('should not apply wrap class when wrap is false', () => {
      const wrapper = mount(Flex, {
        props: { wrap: false as any },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-wrap-wrap').exists()).toBe(false)
    })

    it('should not apply wrap class by default', () => {
      const wrapper = mount(Flex, {
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-wrap-wrap').exists()).toBe(false)
    })
  })

  describe('justify', () => {
    it.each(['center', 'flex-start', 'flex-end', 'space-between', 'space-around'] as const)(
      'should apply %s justify class',
      (justify) => {
        const wrapper = mount(Flex, {
          props: { justify },
          slots: { default: () => <div>test</div> },
        })
        expect(wrapper.find(`.ant-flex-justify-${justify}`).exists()).toBe(true)
      },
    )
  })

  describe('align', () => {
    it.each(['center', 'flex-start', 'flex-end', 'baseline'] as const)(
      'should apply %s align class',
      (align) => {
        const wrapper = mount(Flex, {
          props: { align },
          slots: { default: () => <div>test</div> },
        })
        expect(wrapper.find(`.ant-flex-align-${align}`).exists()).toBe(true)
      },
    )

    // stretch is special: genClsAlign overwrites it with `!props.align && !!props.vertical`
    // so explicit align="stretch" does NOT produce the class; only vertical without align does
    it('should not apply stretch via explicit align prop (overwritten by default logic)', () => {
      const wrapper = mount(Flex, {
        props: { align: 'stretch' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex-align-stretch').exists()).toBe(false)
    })
  })

  describe('gap', () => {
    it.each(['small', 'middle', 'large'] as const)(
      'should apply %s preset gap class',
      (gap) => {
        const wrapper = mount(Flex, {
          props: { gap },
          slots: { default: () => <div>test</div> },
        })
        expect(wrapper.find(`.ant-flex-gap-${gap}`).exists()).toBe(true)
        const style = wrapper.find('.ant-flex').attributes('style') || ''
        expect(style).not.toContain('gap:')
      },
    )

    it('should apply number gap as inline style with px', () => {
      const wrapper = mount(Flex, {
        props: { gap: 100 },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').attributes('style')).toContain('gap: 100px')
    })

    it('should apply string gap as inline style', () => {
      const wrapper = mount(Flex, {
        props: { gap: 'inherit' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').attributes('style')).toContain('gap: inherit')
    })
  })

  describe('flex', () => {
    it('should apply flex inline style', () => {
      const wrapper = mount(Flex, {
        props: { flex: '0 1 auto' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').attributes('style')).toContain('flex: 0 1 auto')
    })

    it('should not apply flex style when not provided', () => {
      const wrapper = mount(Flex, {
        slots: { default: () => <div>test</div> },
      })
      const style = wrapper.find('.ant-flex').attributes('style') || ''
      expect(style).not.toContain('flex:')
    })
  })

  describe('component', () => {
    it('should render div by default', () => {
      const wrapper = mount(Flex, {
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').element.tagName).toBe('DIV')
    })

    it('should render custom tag', () => {
      const wrapper = mount(Flex, {
        props: { component: 'span' },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').element.tagName).toBe('SPAN')
    })

    it('should render custom component', () => {
      const Custom = defineComponent({
        inheritAttrs: false,
        setup(_, { attrs, slots }) {
          return () => <section {...attrs}>{slots.default?.()}</section>
        },
      })
      const wrapper = mount(Flex, {
        props: { component: Custom },
        slots: { default: () => <div>test</div> },
      })
      expect(wrapper.find('.ant-flex').element.tagName).toBe('SECTION')
    })
  })

  it('should support rootClass', () => {
    const wrapper = mount(Flex, {
      props: { rootClass: 'my-root' },
      slots: { default: () => <div>test</div> },
    })
    expect(wrapper.find('.ant-flex').classes()).toContain('my-root')
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => (
      <Flex style={{ color: 'red' }}>
        <div>test</div>
      </Flex>
    ))
    expect(wrapper.find('.ant-flex').attributes('style')).toContain('color: red')
  })

  it('should pass class via attrs', () => {
    const wrapper = mount(() => (
      <Flex class="custom-class">
        <div>test</div>
      </Flex>
    ))
    expect(wrapper.find('.ant-flex').classes()).toContain('custom-class')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Flex data-testid="my-flex">
        <div>test</div>
      </Flex>
    ))
    expect(wrapper.find('[data-testid="my-flex"]').exists()).toBe(true)
  })

  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Flex>
            <div>test</div>
          </Flex>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-flex-rtl').exists()).toBe(true)
    })
  })

  // flex is NOT in ConfigProvider PASSED_PROPS or baseConfig,
  // so flex.vertical and flex.class from ConfigProvider do not reach the component

  it('should update when props change dynamically', async () => {
    const vertical = ref(false)
    const wrapper = mount(() => (
      <Flex vertical={vertical.value}>
        <div>test</div>
      </Flex>
    ))
    expect(wrapper.find('.ant-flex-vertical').exists()).toBe(false)

    vertical.value = true
    await nextTick()
    expect(wrapper.find('.ant-flex-vertical').exists()).toBe(true)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Flex justify="center" align="center" gap="small" wrap>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Flex>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})
