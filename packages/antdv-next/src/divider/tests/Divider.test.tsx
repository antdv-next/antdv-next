import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Divider from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('divider', () => {
  mountTest(Divider)
  rtlTest(() => h(Divider))

  it('should render default horizontal divider', () => {
    const wrapper = mount(Divider)
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-horizontal').exists()).toBe(true)
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
  })

  it('should render vertical divider', () => {
    const wrapper = mount(Divider, {
      props: { type: 'vertical' },
    })
    expect(wrapper.find('.ant-divider-vertical').exists()).toBe(true)
  })

  it('should render vertical divider via vertical prop', () => {
    const wrapper = mount(Divider, {
      props: { vertical: true },
    })
    expect(wrapper.find('.ant-divider-vertical').exists()).toBe(true)
  })

  it('not show children when vertical', () => {
    const wrapper = mount(Divider, {
      props: { type: 'vertical' },
      slots: { default: () => 'Bamboo' },
    })
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(false)
  })

  it('should render with text', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => 'Title' },
    })
    expect(wrapper.find('.ant-divider-with-text').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').text()).toBe('Title')
  })

  it('should render rail elements when has children', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => 'Title' },
    })
    expect(wrapper.find('.ant-divider-rail-start').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-rail-end').exists()).toBe(true)
  })

  it('should render rail class when no children', () => {
    const wrapper = mount(Divider)
    expect(wrapper.find('.ant-divider-rail').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-rail-start').exists()).toBe(false)
  })

  it('should support dashed', () => {
    const wrapper = mount(Divider, {
      props: { dashed: true },
    })
    expect(wrapper.find('.ant-divider-dashed').exists()).toBe(true)
  })

  it('should support variant', () => {
    const variants = ['dashed', 'dotted'] as const
    variants.forEach((variant) => {
      const wrapper = mount(Divider, {
        props: { variant },
      })
      expect(wrapper.find(`.ant-divider-${variant}`).exists()).toBe(true)
    })
  })

  it('should not add variant class when solid', () => {
    const wrapper = mount(Divider, {
      props: { variant: 'solid' },
    })
    expect(wrapper.find('.ant-divider-solid').exists()).toBe(false)
  })

  it('should support plain', () => {
    const wrapper = mount(Divider, {
      props: { plain: true },
      slots: { default: () => 'Text' },
    })
    expect(wrapper.find('.ant-divider-plain').exists()).toBe(true)
  })

  it('should support string orientationMargin', () => {
    const wrapper = mount(Divider, {
      props: { titlePlacement: 'end', orientationMargin: '10' },
      slots: { default: () => 'Text' },
    })
    const innerText = wrapper.find('.ant-divider-inner-text')
    expect(innerText.attributes('style')).toContain('margin-inline-end: 10px')
  })

  it('should support number orientationMargin', () => {
    const wrapper = mount(Divider, {
      props: { titlePlacement: 'start', orientationMargin: 20 },
      slots: { default: () => 'Text' },
    })
    const innerText = wrapper.find('.ant-divider-inner-text')
    expect(innerText.attributes('style')).toContain('margin-inline-start: 20px')
  })

  describe('size', () => {
    it('should apply size from props', () => {
      const wrapper = mount(Divider, {
        props: { size: 'small' },
      })
      expect(wrapper.find('.ant-divider-sm').exists()).toBe(true)
    })

    it('should apply middle size', () => {
      const wrapper = mount(Divider, {
        props: { size: 'middle' },
      })
      expect(wrapper.find('.ant-divider-md').exists()).toBe(true)
    })

    it('should apply componentSize from ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider componentSize="small">
          <Divider />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-divider-sm').exists()).toBe(true)
    })
  })

  describe('orientation and titlePlacement', () => {
    const testCases: [params: Record<string, any>, expected: string][] = [
      [{ titlePlacement: 'left' }, '.ant-divider-with-text-start'],
      [{ titlePlacement: 'right' }, '.ant-divider-with-text-end'],
      [{ titlePlacement: 'center' }, '.ant-divider-with-text-center'],
      [{ titlePlacement: 'start' }, '.ant-divider-with-text-start'],
      [{ titlePlacement: 'end' }, '.ant-divider-with-text-end'],
      [{ orientation: 'vertical' }, '.ant-divider-vertical'],
      [{ type: 'vertical' }, '.ant-divider-vertical'],
      [{ vertical: true }, '.ant-divider-vertical'],
      [{ orientation: 'horizontal', vertical: true }, '.ant-divider-horizontal'],
      [{ vertical: true, type: 'horizontal' }, '.ant-divider-vertical'],
    ]

    it.each(testCases)('with args %j should have %s', (params, expected) => {
      const wrapper = mount(Divider, {
        props: params,
        slots: { default: () => 'Text' },
      })
      expect(wrapper.find(expected).exists()).toBe(true)
    })

    it('titlePlacement should override default center', () => {
      const wrapper = mount(Divider, {
        props: { titlePlacement: 'start' },
        slots: { default: () => 'Text' },
      })
      expect(wrapper.find('.ant-divider-with-text-start').exists()).toBe(true)
      expect(wrapper.find('.ant-divider-with-text-center').exists()).toBe(false)
    })

    it('orientationMargin with titlePlacement start', () => {
      const wrapper = mount(Divider, {
        props: { titlePlacement: 'start', orientationMargin: 20 },
        slots: { default: () => 'Text' },
      })
      expect(wrapper.find('.ant-divider-no-default-orientation-margin-start').exists()).toBe(true)
      expect(wrapper.find('.ant-divider-inner-text').attributes('style')).toContain('margin-inline-start: 20px')
    })

    it('orientationMargin with titlePlacement end', () => {
      const wrapper = mount(Divider, {
        props: { titlePlacement: 'end', orientationMargin: 30 },
        slots: { default: () => 'Text' },
      })
      expect(wrapper.find('.ant-divider-no-default-orientation-margin-end').exists()).toBe(true)
      expect(wrapper.find('.ant-divider-inner-text').attributes('style')).toContain('margin-inline-end: 30px')
    })
  })

  describe('rTL direction', () => {
    it('should swap titlePlacement left to end in RTL', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Divider titlePlacement="left">Text</Divider>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-divider-with-text-end').exists()).toBe(true)
      expect(wrapper.find('.ant-divider-rtl').exists()).toBe(true)
    })

    it('should swap titlePlacement right to start in RTL', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Divider titlePlacement="right">Text</Divider>
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-divider-with-text-start').exists()).toBe(true)
    })
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => (
      <Divider style={{ color: 'red' }} />
    ))
    const divider = wrapper.find('.ant-divider')
    expect(divider.attributes('style')).toContain('color: red')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Divider data-testid="my-divider" />
    ))
    expect(wrapper.find('[data-testid="my-divider"]').exists()).toBe(true)
  })

  it('should support rootClass', () => {
    const wrapper = mount(Divider, {
      props: { rootClass: 'my-root' },
    })
    expect(wrapper.find('.ant-divider').classes()).toContain('my-root')
  })

  it('should support semantic classes and styles', () => {
    const wrapper = mount(Divider, {
      props: {
        classes: { root: 'custom-root', rail: 'custom-rail', content: 'custom-content' },
        styles: { root: { color: 'rgb(255, 0, 0)' } },
      },
      slots: { default: () => 'Text' },
    })
    expect(wrapper.find('.ant-divider').classes()).toContain('custom-root')
    expect(wrapper.find('.ant-divider-rail-start').classes()).toContain('custom-rail')
    expect(wrapper.find('.ant-divider-inner-text').classes()).toContain('custom-content')
  })

  it('should filter empty slot content', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => [null, undefined, ''] },
    })
    // filterEmpty removes null/undefined/empty, so treated as no children
    expect(wrapper.find('.ant-divider-with-text').exists()).toBe(false)
    expect(wrapper.find('.ant-divider-rail').exists()).toBe(true)
  })

  it('should support non-numeric string orientationMargin', () => {
    const wrapper = mount(Divider, {
      props: { titlePlacement: 'start', orientationMargin: '2em' },
      slots: { default: () => 'Text' },
    })
    const innerText = wrapper.find('.ant-divider-inner-text')
    expect(innerText.attributes('style')).toContain('margin-inline-start: 2em')
  })

  it('should apply semantic rail class and style to root when no children', () => {
    const wrapper = mount(Divider, {
      props: {
        classes: { rail: 'custom-rail' },
        styles: { rail: { borderColor: 'rgb(0, 128, 0)' } },
      },
    })
    const divider = wrapper.find('.ant-divider')
    expect(divider.classes()).toContain('custom-rail')
    expect(divider.attributes('style')).toContain('border-color: rgb(0, 128, 0)')
  })

  it('should not apply rail class/style to root when has children', () => {
    const wrapper = mount(Divider, {
      props: {
        classes: { rail: 'custom-rail' },
      },
      slots: { default: () => 'Text' },
    })
    const divider = wrapper.find('.ant-divider')
    expect(divider.classes()).not.toContain('custom-rail')
    // rail class should be on the inner rail elements instead
    expect(wrapper.find('.ant-divider-rail-start').classes()).toContain('custom-rail')
  })

  it('should apply semantic styles to respective elements', () => {
    const wrapper = mount(Divider, {
      props: {
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          rail: { borderColor: 'rgb(0, 128, 0)' },
          content: { fontSize: '16px' },
        },
      },
      slots: { default: () => 'Text' },
    })
    expect(wrapper.find('.ant-divider').attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find('.ant-divider-rail-start').attributes('style')).toContain('border-color: rgb(0, 128, 0)')
    expect(wrapper.find('.ant-divider-inner-text').attributes('style')).toContain('font-size: 16px')
  })

  it('vertical divider should not render rail-start/rail-end', () => {
    const wrapper = mount(Divider, {
      props: { type: 'vertical' },
      slots: { default: () => 'Text' },
    })
    expect(wrapper.find('.ant-divider-rail-start').exists()).toBe(false)
    expect(wrapper.find('.ant-divider-rail-end').exists()).toBe(false)
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(false)
  })

  it('should default titlePlacement to center when not specified', () => {
    const wrapper = mount(Divider, {
      slots: { default: () => 'Text' },
    })
    expect(wrapper.find('.ant-divider-with-text-center').exists()).toBe(true)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Divider dashed={true} titlePlacement="start">
        Section Title
      </Divider>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should update when props change dynamically', async () => {
    const dashed = ref(false)
    const wrapper = mount(() => <Divider dashed={dashed.value} />)
    expect(wrapper.find('.ant-divider-dashed').exists()).toBe(false)

    dashed.value = true
    await nextTick()
    expect(wrapper.find('.ant-divider-dashed').exists()).toBe(true)
  })
})
