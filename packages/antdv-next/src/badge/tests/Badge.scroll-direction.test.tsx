import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Badge from '..'
import { mount } from '/@tests/utils'

describe('badge scroll direction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function getDigits(wrapper: ReturnType<typeof mount>) {
    return wrapper.findAll('.ant-scroll-number-only')
  }

  it('should scroll down when count decreases after an unchanged digit update', async () => {
    const wrapper = mount(Badge, { props: { count: 5 } })

    await wrapper.setProps({ count: 15 })
    await wrapper.setProps({ count: 14 })

    const onesDigit = getDigits(wrapper)[1]!
    expect((onesDigit.element as HTMLElement).style.transform).toBe('translateY(100%)')
    expect(onesDigit.findAll('.ant-scroll-number-only-unit')).toHaveLength(2)

    await onesDigit.trigger('transitionend')
    const settled = getDigits(wrapper)[1]!
    expect((settled.element as HTMLElement).style.transition).toBe('none')
    expect(settled.text()).toBe('4')

    wrapper.unmount()
  })

  it('should scroll up when count increases after an unchanged digit update', async () => {
    const wrapper = mount(Badge, { props: { count: 25 } })

    await wrapper.setProps({ count: 15 })
    await wrapper.setProps({ count: 16 })

    const onesDigit = getDigits(wrapper)[1]!
    expect((onesDigit.element as HTMLElement).style.transform).toBe('translateY(-100%)')
    expect(onesDigit.findAll('.ant-scroll-number-only-unit')).toHaveLength(2)

    wrapper.unmount()
  })

  it('should use latest count when count updates mid-transition with the same digit', async () => {
    const wrapper = mount(Badge, { props: { count: 15 } })

    await wrapper.setProps({ count: 16 })
    await vi.advanceTimersByTimeAsync(200)
    await wrapper.setProps({ count: 26 })
    await vi.runAllTimersAsync()
    await wrapper.setProps({ count: 25 })

    const onesDigit = getDigits(wrapper)[1]!
    expect((onesDigit.element as HTMLElement).style.transform).toBe('translateY(100%)')
    expect(onesDigit.findAll('.ant-scroll-number-only-unit')).toHaveLength(2)

    wrapper.unmount()
  })

  it('should sync previous value after transitioning from negative sign to digit', async () => {
    const wrapper = mount(Badge, { props: { count: -10, overflowCount: 999 } })

    await wrapper.setProps({ count: 100 })
    await wrapper.setProps({ count: 200 })

    const hundredsDigit = getDigits(wrapper)[0]!
    expect((hundredsDigit.element as HTMLElement).style.transform).toBe('translateY(-100%)')
    expect(hundredsDigit.findAll('.ant-scroll-number-only-unit')).toHaveLength(2)

    wrapper.unmount()
  })
})
