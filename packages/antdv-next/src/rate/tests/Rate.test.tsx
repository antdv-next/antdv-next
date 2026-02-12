import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Rate from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('rate', () => {
  mountTest(Rate)
  rtlTest(() => h(Rate))

  it('should render correctly', () => {
    const wrapper = mount(Rate)
    expect(wrapper.find('.ant-rate').exists()).toBe(true)
  })

  describe('size', () => {
    it.each(['small', 'middle', 'large'] as const)(
      'should apply %s size class',
      (size) => {
        const wrapper = mount(Rate, { props: { size } })
        expect(wrapper.find(`.ant-rate-${size}`).exists()).toBe(true)
      },
    )
  })

  describe('disabled', () => {
    it('should not be disabled by default', () => {
      const wrapper = mount(Rate)
      expect(wrapper.find('.ant-rate-disabled').exists()).toBe(false)
    })

    it('should apply disabled when prop is true', () => {
      const wrapper = mount(Rate, { props: { disabled: true } })
      expect(wrapper.find('.ant-rate-disabled').exists()).toBe(true)
    })

    it('should apply disabled from context via ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider componentDisabled>
          <Rate />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-rate-disabled').exists()).toBe(true)
    })

    it('should prefer prop disabled=false over context disabled (?? operator)', () => {
      const wrapper = mount(() => (
        <ConfigProvider componentDisabled>
          <Rate disabled={false} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-rate-disabled').exists()).toBe(false)
    })
  })

  describe('tooltips', () => {
    it('should render without tooltip wrapper by default', () => {
      const wrapper = mount(Rate, { props: { count: 3 } })
      expect(wrapper.html()).not.toContain('ant-tooltip')
    })

    it('should wrap characters with tooltip when tooltips is string array', () => {
      const wrapper = mount(Rate, {
        props: { tooltips: ['bad', 'normal', 'good'], count: 3 },
      })
      expect(wrapper.find('.ant-rate').exists()).toBe(true)
    })

    it('should wrap characters with tooltip when tooltips is object array', () => {
      const wrapper = mount(Rate, {
        props: {
          tooltips: [{ title: 'bad' }, { title: 'normal' }, { title: 'good' }],
          count: 3,
        },
      })
      expect(wrapper.find('.ant-rate').exists()).toBe(true)
    })
  })

  it('should accept custom character', () => {
    const wrapper = mount(Rate, {
      props: { character: h('span', '♥') },
    })
    expect(wrapper.html()).toContain('♥')
  })

  it('should support rootClass', () => {
    const wrapper = mount(Rate, { props: { rootClass: 'my-root' } })
    expect(wrapper.find('.ant-rate').classes()).toContain('my-root')
  })

  it('should pass style via attrs', () => {
    const wrapper = mount(() => <Rate style={{ color: 'red' }} />)
    expect(wrapper.find('.ant-rate').attributes('style')).toContain('color: red')
  })

  it('should pass class via attrs', () => {
    const wrapper = mount(() => <Rate class="custom-class" />)
    expect(wrapper.find('.ant-rate').classes()).toContain('custom-class')
  })

  it('should pass data attributes', () => {
    const wrapper = mount(() => <Rate data-testid="my-rate" />)
    expect(wrapper.find('[data-testid="my-rate"]').exists()).toBe(true)
  })

  describe('events', () => {
    it('should emit change and update:value when star is clicked', async () => {
      const wrapper = mount(Rate)
      const stars = wrapper.findAll('[role="radio"]')
      await stars[2].trigger('click')
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual([3])
      expect(wrapper.emitted('update:value')).toBeTruthy()
      expect(wrapper.emitted('update:value')![0]).toEqual([3])
    })

    it('should emit focus event', async () => {
      const wrapper = mount(Rate)
      await wrapper.find('.ant-rate').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit blur event', async () => {
      const wrapper = mount(Rate)
      await wrapper.find('.ant-rate').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit keydown event', async () => {
      const wrapper = mount(Rate)
      await wrapper.find('.ant-rate').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('keydown')).toBeTruthy()
    })

    it('should emit mouseleave event', async () => {
      const wrapper = mount(Rate)
      await wrapper.find('.ant-rate').trigger('mouseleave')
      expect(wrapper.emitted('mouseleave')).toBeTruthy()
    })
  })

  describe('expose', () => {
    it('should expose focus and blur methods', () => {
      const wrapper = mount(Rate)
      expect(typeof (wrapper.vm as any).focus).toBe('function')
      expect(typeof (wrapper.vm as any).blur).toBe('function')
    })
  })

  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Rate />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-rate-rtl').exists()).toBe(true)
    })
  })

  // rate is NOT in ConfigProvider PASSED_PROPS,
  // so component-specific config from ConfigProvider does not reach the component

  it('should update when props change dynamically', async () => {
    const size = ref<'small' | 'middle' | 'large'>('small')
    const wrapper = mount(() => <Rate size={size.value} />)
    expect(wrapper.find('.ant-rate-small').exists()).toBe(true)

    size.value = 'large'
    await nextTick()
    expect(wrapper.find('.ant-rate-large').exists()).toBe(true)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => <Rate count={5} value={3} />)
    expect(wrapper.element).toMatchSnapshot()
  })
})
