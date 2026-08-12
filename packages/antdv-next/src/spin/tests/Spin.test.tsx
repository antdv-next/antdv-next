import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Spin from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-spin'

describe('spin', () => {
  mountTest(Spin)
  rtlTest(() => h(Spin))

  // ===================== Basic rendering =====================

  it('should render with default spinning=true', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(true)
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('should render default Looper indicator with 4 dot items', () => {
    const wrapper = mount(Spin)
    const dotItems = wrapper.findAll(`.${prefixCls}-dot-item`)
    expect(dotItems.length).toBe(4)
  })

  // ===================== spinning prop =====================

  it('should show indicator when spinning=true', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
    })
    expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-dot`).exists()).toBe(true)
  })

  it('should not show indicator when spinning=false', () => {
    const wrapper = mount(Spin, {
      props: { spinning: false },
    })
    expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(false)
    expect(wrapper.find(`.${prefixCls}-dot`).exists()).toBe(false)
  })

  it('should set aria-busy=false when not spinning', () => {
    const wrapper = mount(Spin, {
      props: { spinning: false },
    })
    expect(wrapper.attributes('aria-busy')).toBe('false')
  })

  it('should update when controlled spinning changes', async () => {
    const spinning = ref(true)
    const wrapper = mount({
      render() {
        return h(Spin, { spinning: spinning.value })
      },
    })
    expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(true)

    spinning.value = false
    await nextTick()
    expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(false)
  })

  // ===================== size prop =====================

  it('should apply small size class', () => {
    const wrapper = mount(Spin, {
      props: { size: 'small' },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-sm`)
  })

  it('should apply large size class', () => {
    const wrapper = mount(Spin, {
      props: { size: 'large' },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-lg`)
  })

  it('should not apply size class for default size', () => {
    const wrapper = mount(Spin, {
      props: { size: 'default' },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-sm`)
    expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-lg`)
  })

  // ===================== delay prop =====================

  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should delay showing spinner', async () => {
      const wrapper = mount(Spin, {
        props: { spinning: true, delay: 500 },
      })
      // Initially not spinning due to delay
      expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(false)

      vi.advanceTimersByTime(500)
      await nextTick()
      expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(true)
    })

    it('should cancel delay when spinning becomes false', async () => {
      const spinning = ref(true)
      const wrapper = mount({
        render() {
          return h(Spin, { spinning: spinning.value, delay: 500 })
        },
      })
      expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(false)

      // Cancel before delay completes
      spinning.value = false
      await nextTick()

      vi.advanceTimersByTime(500)
      await nextTick()
      expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(false)
    })

    it('should not delay when delay=0', () => {
      const wrapper = mount(Spin, {
        props: { spinning: true, delay: 0 },
      })
      expect(wrapper.find(`.${prefixCls}-spinning`).exists()).toBe(true)
    })
  })

  // ===================== description / tip =====================

  it('should render description prop', () => {
    const wrapper = mount(Spin, {
      props: { description: 'Loading...' },
    })
    expect(wrapper.find(`.${prefixCls}-description`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-description`).text()).toBe('Loading...')
  })

  it('should render description slot', () => {
    const wrapper = mount(Spin, {
      slots: {
        description: () => h('span', { class: 'custom-desc' }, 'Slot Desc'),
      },
    })
    expect(wrapper.find('.custom-desc').exists()).toBe(true)
    expect(wrapper.find('.custom-desc').text()).toBe('Slot Desc')
  })

  it('description slot should take priority over prop', () => {
    const wrapper = mount(Spin, {
      props: { description: 'PropDesc' },
      slots: {
        description: () => 'SlotDesc',
      },
    })
    expect(wrapper.find(`.${prefixCls}-description`).text()).toBe('SlotDesc')
  })

  it('should render tip prop (deprecated)', () => {
    const wrapper = mount(Spin, {
      props: { tip: 'Loading tip...' },
    })
    expect(wrapper.find(`.${prefixCls}-description`).text()).toBe('Loading tip...')
  })

  it('should render tip slot (deprecated)', () => {
    const wrapper = mount(Spin, {
      slots: {
        tip: () => 'Tip Slot',
      },
    })
    expect(wrapper.find(`.${prefixCls}-description`).text()).toBe('Tip Slot')
  })

  it('should not render description element when neither description nor tip provided', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find(`.${prefixCls}-description`).exists()).toBe(false)
  })

  // ===================== indicator =====================

  it('should render custom indicator prop', () => {
    const customIndicator = h('div', { class: 'custom-indicator' }, 'custom')
    const wrapper = mount(Spin, {
      props: { indicator: customIndicator },
    })
    expect(wrapper.find('.custom-indicator').exists()).toBe(true)
  })

  it('should render custom indicator slot', () => {
    const wrapper = mount(Spin, {
      slots: {
        indicator: () => h('div', { class: 'slot-indicator' }, 'slot'),
      },
    })
    expect(wrapper.find('.slot-indicator').exists()).toBe(true)
  })

  it('indicator slot should take priority over prop', () => {
    const wrapper = mount(Spin, {
      props: { indicator: h('div', { class: 'prop-indicator' }) },
      slots: {
        indicator: () => h('div', { class: 'slot-indicator' }),
      },
    })
    expect(wrapper.find('.slot-indicator').exists()).toBe(true)
    expect(wrapper.find('.prop-indicator').exists()).toBe(false)
  })

  // ===================== Spin.setDefaultIndicator =====================

  it('should support setDefaultIndicator', () => {
    const customDefault = h('div', { class: 'global-indicator' })
    Spin.setDefaultIndicator(customDefault)

    const wrapper = mount(Spin)
    expect(wrapper.find('.global-indicator').exists()).toBe(true)

    // Reset
    Spin.setDefaultIndicator(undefined as any)
  })

  // ===================== fullscreen =====================

  it('should apply fullscreen class', () => {
    const wrapper = mount(Spin, {
      props: { fullscreen: true },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-fullscreen`)
  })

  it('fullscreen should render section wrapper', () => {
    const wrapper = mount(Spin, {
      props: { fullscreen: true },
    })
    expect(wrapper.find(`.${prefixCls}-section`).exists()).toBe(true)
  })

  // ===================== percent =====================

  it('should render progress SVG when percent > 0', () => {
    const wrapper = mount(Spin, {
      props: { percent: 50 },
    })
    const svg = wrapper.find('svg[role="progressbar"]')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-valuenow')).toBe('50')
  })

  it('should not render progress when percent=0', () => {
    const wrapper = mount(Spin, {
      props: { percent: 0 },
    })
    // Progress component renders but with hidden class
    const progressHolder = wrapper.find(`.${prefixCls}-dot-holder.${prefixCls}-dot-progress`)
    if (progressHolder.exists()) {
      expect(progressHolder.classes()).toContain(`${prefixCls}-dot-holder-hidden`)
    }
  })

  it('should clamp percent between 0 and 100', () => {
    const wrapper = mount(Spin, {
      props: { percent: 150 },
    })
    const svg = wrapper.find('svg[role="progressbar"]')
    expect(svg.attributes('aria-valuenow')).toBe('100')
  })

  describe('percent auto', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should auto-increment percent when percent="auto"', async () => {
      const wrapper = mount(Spin, {
        props: { percent: 'auto' },
      })

      // Advance timers for auto increment (AUTO_INTERVAL = 200ms)
      vi.advanceTimersByTime(1000)
      await nextTick()

      const svg = wrapper.find('svg[role="progressbar"]')
      expect(svg.exists()).toBe(true)
      const valuenow = Number(svg.attributes('aria-valuenow'))
      expect(valuenow).toBeGreaterThan(0)
    })
  })

  // ===================== Nested mode (with children) =====================

  it('should render container when children provided', () => {
    const wrapper = mount(Spin, {
      slots: {
        default: () => h('div', { class: 'child-content' }, 'Content'),
      },
    })
    expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true)
    expect(wrapper.find('.child-content').exists()).toBe(true)
  })

  it('should render section wrapper around indicator when nested and spinning', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
      slots: {
        default: () => h('div', 'Content'),
      },
    })
    expect(wrapper.find(`.${prefixCls}-section`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-dot`).exists()).toBe(true)
  })

  it('should not render indicator when nested and not spinning', () => {
    const wrapper = mount(Spin, {
      props: { spinning: false },
      slots: {
        default: () => h('div', 'Content'),
      },
    })
    expect(wrapper.find(`.${prefixCls}-dot`).exists()).toBe(false)
    expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true)
  })

  // ===================== rootClass / wrapperClassName =====================

  it('should apply rootClass', () => {
    const wrapper = mount(Spin, {
      props: { rootClass: 'my-root' },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('my-root')
  })

  it('should apply wrapperClassName in nested mode (deprecated)', () => {
    const wrapper = mount(Spin, {
      props: { wrapperClassName: 'my-wrapper' },
      slots: {
        default: () => h('div', 'Content'),
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('my-wrapper')
  })

  // ===================== attrs passthrough =====================

  it('should pass through class and style attrs', () => {
    const wrapper = mount(Spin, {
      attrs: {
        'class': 'extra-cls',
        'style': { color: 'rgb(255, 0, 0)' },
        'data-testid': 'my-spin',
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain('extra-cls')
    expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(wrapper.find(`.${prefixCls}`).attributes('data-testid')).toBe('my-spin')
  })

  // ===================== ConfigProvider =====================

  it('should use ConfigProvider indicator', () => {
    const wrapper = mount({
      render() {
        return h(
          ConfigProvider,
          { spin: { indicator: h('div', { class: 'cp-indicator' }) } },
          { default: () => h(Spin) },
        )
      },
    })
    expect(wrapper.find('.cp-indicator').exists()).toBe(true)
  })

  it('component indicator should take priority over ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return h(
          ConfigProvider,
          { spin: { indicator: h('div', { class: 'cp-indicator' }) } },
          {
            default: () => h(Spin, {
              indicator: h('div', { class: 'own-indicator' }),
            }),
          },
        )
      },
    })
    expect(wrapper.find('.own-indicator').exists()).toBe(true)
    expect(wrapper.find('.cp-indicator').exists()).toBe(false)
  })

  // ===================== RTL =====================

  it('should apply rtl class from ConfigProvider direction', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(Spin),
        })
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-rtl`)
  })

  // ===================== Children edge cases =====================

  it('should render 0 as children', () => {
    const wrapper = mount(Spin, {
      slots: {
        default: () => 0,
      },
    })
    expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-container`).text()).toBe('0')
  })

  it('should not render container when children are empty', () => {
    const wrapper = mount(Spin, {
      slots: {
        default: () => [],
      },
    })
    expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(false)
  })

  // ===================== Style in nested mode =====================

  it('should only affect the spin element when set style to nested spin', () => {
    const wrapper = mount(Spin, {
      attrs: {
        style: { padding: '20px' },
      },
      slots: {
        default: () => h('div', 'content'),
      },
    })
    expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain('padding: 20px')
  })

  // ===================== Deprecated warnings =====================

  describe('deprecated API warnings', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    afterEach(() => {
      errorSpy.mockReset()
    })

    afterAll(() => {
      errorSpy.mockRestore()
    })

    it('should warn when using deprecated tip prop', () => {
      mount(Spin, {
        props: { tip: 'Loading...' },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`tip` is deprecated'),
      )
    })

    it('should warn when using deprecated wrapperClassName prop', () => {
      mount(Spin, {
        props: { wrapperClassName: 'my-wrapper' },
        slots: { default: () => h('div', 'content') },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`wrapperClassName` is deprecated'),
      )
    })

    it('should warn when using deprecated tip slot', () => {
      mount(Spin, {
        slots: {
          tip: () => 'Tip',
        },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`tip` is deprecated'),
      )
    })

    it('should warn when using deprecated classes.tip', () => {
      mount(Spin, {
        props: {
          classes: { tip: 'c-tip' },
        },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`classes.tip and styles.tip` is deprecated'),
      )
    })

    it('should warn when using deprecated styles.tip', () => {
      mount(Spin, {
        props: {
          styles: { tip: { color: 'blue' } },
        },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`classes.tip and styles.tip` is deprecated'),
      )
    })

    it('should warn when using deprecated classes.mask', () => {
      mount(Spin, {
        props: {
          classes: { mask: 'c-mask' },
        },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`classes.mask and styles.mask` is deprecated'),
      )
    })

    it('should warn when using deprecated styles.mask', () => {
      mount(Spin, {
        props: {
          styles: { mask: { background: 'red' } },
        },
      })
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('`classes.mask and styles.mask` is deprecated'),
      )
    })
  })

  // ===================== Snapshots =====================

  it('should match snapshot (basic spinning)', () => {
    const wrapper = mount(Spin)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot (with description)', () => {
    const wrapper = mount(Spin, {
      props: { description: 'Loading...' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot (nested mode)', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
      slots: {
        default: () => h('div', 'Content'),
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot (fullscreen)', () => {
    const wrapper = mount(Spin, {
      props: { fullscreen: true },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // ========================= Ref =========================
  it('should support nativeElement ref', async () => {
    const spinRef = ref<any>()
    const wrapper = mount(() => <Spin ref={spinRef} />)
    await nextTick()
    expect(spinRef.value?.nativeElement).toBeInstanceOf(HTMLElement)
    expect(spinRef.value.nativeElement).toBe(wrapper.find(`.${prefixCls}`).element)
  })
})
