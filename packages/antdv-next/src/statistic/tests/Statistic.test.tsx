import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Statistic, { StatisticTimer } from '..'
import ConfigProvider from '../../config-provider'
import { formatCounter, formatTimeStr } from '../utils'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { flushPromises, mount } from '/@tests/utils'

describe('statistic', () => {
  mountTest(Statistic)
  rtlTest(() => h(Statistic))

  // ============= Basic rendering =============
  it('should render correctly with default props', () => {
    const wrapper = mount(Statistic)
    expect(wrapper.find('.ant-statistic').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-content').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-content-value').exists()).toBe(true)
  })

  // ============= Number formatting =============
  describe('number formatting', () => {
    it('should format integer value with default group separator', () => {
      const wrapper = mount(Statistic, { props: { value: 1128 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('1,128')
    })

    it('should format decimal value', () => {
      const wrapper = mount(Statistic, { props: { value: 11.28 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('11')
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('.28')
    })

    it('should apply precision to pad decimals', () => {
      const wrapper = mount(Statistic, { props: { value: 11.2, precision: 3 } })
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('.200')
    })

    it('should apply precision to truncate decimals', () => {
      const wrapper = mount(Statistic, { props: { value: 11.289, precision: 2 } })
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('.28')
    })

    it('should remove decimals with precision 0', () => {
      const wrapper = mount(Statistic, { props: { value: 11.28, precision: 0 } })
      expect(wrapper.find('.ant-statistic-content-value-decimal').exists()).toBe(false)
    })

    it('should handle negative precision like precision 0', () => {
      const cases: [number, number, string][] = [
        [-1, -1112893.1212, '-1,112,893'],
        [-2, -1112893.1212, '-1,112,893'],
        [-1, 1112893, '1,112,893'],
      ]
      cases.forEach(([precision, value, expected]) => {
        const wrapper = mount(Statistic, { props: { value, precision } })
        expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe(expected)
        expect(wrapper.find('.ant-statistic-content-value-decimal').exists()).toBe(false)
      })
    })

    it('should treat "-" as non-number', () => {
      const wrapper = mount(Statistic, { props: { value: '-' } })
      expect(wrapper.find('.ant-statistic-content-value').text()).toBe('-')
    })

    it('should show raw string for non-number value', () => {
      const wrapper = mount(Statistic, { props: { value: 'bamboo' } })
      expect(wrapper.find('.ant-statistic-content-value').text()).toBe('bamboo')
    })

    it('should use custom formatter', () => {
      const formatter = vi.fn(() => '93')
      const wrapper = mount(Statistic, { props: { value: 1128, formatter } })
      expect(formatter).toHaveBeenCalledWith(1128)
      expect(wrapper.find('.ant-statistic-content-value').text()).toBe('93')
    })

    it('should use custom groupSeparator', () => {
      const wrapper = mount(Statistic, { props: { value: 1128, groupSeparator: '__' } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('1__128')
    })

    it('should use custom decimalSeparator', () => {
      const wrapper = mount(Statistic, { props: { value: 11.28, decimalSeparator: '--' } })
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('--28')
    })

    it('should support negative number', () => {
      const wrapper = mount(Statistic, { props: { value: -112893.12345, precision: 2 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('-112,893')
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('.12')
    })

    it('should format large numbers with group separator', () => {
      const wrapper = mount(Statistic, { props: { value: 1234567890 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('1,234,567,890')
    })

    it('should disable group separator with empty string', () => {
      const wrapper = mount(Statistic, { props: { value: 1128, groupSeparator: '' } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('1128')
    })

    it('should render value 0 by default', () => {
      const wrapper = mount(Statistic, { props: { value: 0 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('0')
    })

    it('should handle decimal-only value like .5', () => {
      const wrapper = mount(Statistic, { props: { value: 0.5 } })
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('0')
      expect(wrapper.find('.ant-statistic-content-value-decimal').text()).toBe('.5')
    })
  })

  // ============= Title =============
  describe('title', () => {
    it('should render title from prop', () => {
      const wrapper = mount(Statistic, { props: { title: 'Active Users' } })
      expect(wrapper.find('.ant-statistic-header').exists()).toBe(true)
      expect(wrapper.find('.ant-statistic-title').text()).toBe('Active Users')
    })

    it('should render title from slot', () => {
      const wrapper = mount(Statistic, {
        slots: { title: () => 'Slot Title' },
      })
      expect(wrapper.find('.ant-statistic-title').text()).toBe('Slot Title')
    })

    it('should not render header when no title', () => {
      const wrapper = mount(Statistic, { props: { value: 100 } })
      expect(wrapper.find('.ant-statistic-header').exists()).toBe(false)
      expect(wrapper.find('.ant-statistic-title').exists()).toBe(false)
    })
  })

  // ============= Prefix =============
  describe('prefix', () => {
    it('should render prefix from prop', () => {
      const wrapper = mount(Statistic, { props: { prefix: '$' } })
      expect(wrapper.find('.ant-statistic-content-prefix').text()).toBe('$')
    })

    it('should render prefix from slot', () => {
      const wrapper = mount(Statistic, {
        slots: { prefix: () => <span class="icon">P</span> },
      })
      expect(wrapper.find('.ant-statistic-content-prefix .icon').exists()).toBe(true)
    })

    it('should not render prefix when absent', () => {
      const wrapper = mount(Statistic, { props: { value: 100 } })
      expect(wrapper.find('.ant-statistic-content-prefix').exists()).toBe(false)
    })

    it('should render semantic nodes for zero title, prefix, and suffix', () => {
      const wrapper = mount(Statistic, { props: { title: 0, prefix: 0, suffix: 0 } })
      expect(wrapper.find('.ant-statistic-title').text()).toBe('0')
      expect(wrapper.find('.ant-statistic-content-prefix').text()).toBe('0')
      expect(wrapper.find('.ant-statistic-content-suffix').text()).toBe('0')
    })
  })

  // ============= Suffix =============
  describe('suffix', () => {
    it('should render suffix from prop', () => {
      const wrapper = mount(Statistic, { props: { suffix: '%' } })
      expect(wrapper.find('.ant-statistic-content-suffix').text()).toBe('%')
    })

    it('should render suffix from slot', () => {
      const wrapper = mount(Statistic, {
        slots: { suffix: () => 'units' },
      })
      expect(wrapper.find('.ant-statistic-content-suffix').text()).toBe('units')
    })

    it('should not render suffix when absent', () => {
      const wrapper = mount(Statistic, { props: { value: 100 } })
      expect(wrapper.find('.ant-statistic-content-suffix').exists()).toBe(false)
    })
  })

  // ============= Loading =============
  describe('loading', () => {
    it('should show skeleton when loading', () => {
      const wrapper = mount(Statistic, {
        props: { title: 'Active Users', value: 112112, loading: true },
      })
      expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    })

    it('should show content when not loading', () => {
      const wrapper = mount(Statistic, {
        props: { title: 'Active Users', value: 112112, loading: false },
      })
      expect(wrapper.find('.ant-skeleton').exists()).toBe(false)
      expect(wrapper.find('.ant-statistic-content').exists()).toBe(true)
    })

    it('should toggle loading state dynamically', async () => {
      const loading = ref(false)
      const wrapper = mount(() => (
        <Statistic title="Users" value={100} loading={loading.value} />
      ))
      expect(wrapper.find('.ant-skeleton').exists()).toBe(false)
      expect(wrapper.find('.ant-statistic-content').exists()).toBe(true)

      loading.value = true
      await nextTick()
      expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    })
  })

  // ============= valueRender =============
  it('should use valueRender to customize value display', () => {
    const valueRender = (node: any) => <div class="custom-value">{node}</div>
    const wrapper = mount(Statistic, { props: { value: 100, valueRender } })
    expect(wrapper.find('.custom-value').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-content-value').exists()).toBe(true)
  })

  // ============= valueStyle =============
  it('should apply valueStyle to content element', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, valueStyle: { color: 'rgb(255, 0, 0)' } },
    })
    expect(wrapper.find('.ant-statistic-content').attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  // ============= rootClass =============
  it('should apply rootClass to root element', () => {
    const wrapper = mount(Statistic, { props: { rootClass: 'my-root' } })
    expect(wrapper.find('.ant-statistic').classes()).toContain('my-root')
  })

  // ============= Events =============
  describe('events', () => {
    it('should emit mouseenter', async () => {
      const onMouseenter = vi.fn()
      const wrapper = mount(Statistic, { props: { onMouseenter } })
      await wrapper.find('.ant-statistic').trigger('mouseenter')
      expect(onMouseenter).toHaveBeenCalled()
    })

    it('should emit mouseleave', async () => {
      const onMouseleave = vi.fn()
      const wrapper = mount(Statistic, { props: { onMouseleave } })
      await wrapper.find('.ant-statistic').trigger('mouseleave')
      expect(onMouseleave).toHaveBeenCalled()
    })
  })

  // ============= Attrs passthrough =============
  describe('attrs passthrough', () => {
    it('should pass data-* attributes', () => {
      const wrapper = mount(() => <Statistic data-testid="stat" value={100} />)
      expect(wrapper.find('.ant-statistic').attributes('data-testid')).toBe('stat')
    })

    it('should pass aria-* attributes', () => {
      const wrapper = mount(() => <Statistic aria-label="statistic" value={100} />)
      expect(wrapper.find('.ant-statistic').attributes('aria-label')).toBe('statistic')
    })

    it('should pass role attribute', () => {
      const wrapper = mount(() => <Statistic role="status" value={100} />)
      expect(wrapper.find('.ant-statistic').attributes('role')).toBe('status')
    })

    it('should pass style to root element', () => {
      const wrapper = mount(() => <Statistic style={{ color: 'red' }} value={100} />)
      expect(wrapper.find('.ant-statistic').attributes('style')).toContain('color: red')
    })

    it('should pass class to root element', () => {
      const wrapper = mount(() => <Statistic class="extra-cls" value={100} />)
      expect(wrapper.find('.ant-statistic').classes()).toContain('extra-cls')
    })
  })

  // ============= Semantic classes and styles (basic) =============
  describe('semantic classes and styles', () => {
    it('should apply semantic classes and styles to all elements', () => {
      const wrapper = mount(Statistic, {
        props: {
          value: 100,
          title: 'Test',
          prefix: '$',
          suffix: '%',
          classes: {
            root: 'c-root',
            header: 'c-header',
            title: 'c-title',
            content: 'c-content',
            prefix: 'c-prefix',
            suffix: 'c-suffix',
          },
          styles: {
            root: { color: 'rgb(255, 0, 0)' },
          },
        },
      })
      expect(wrapper.find('.ant-statistic').classes()).toContain('c-root')
      expect(wrapper.find('.ant-statistic-header').classes()).toContain('c-header')
      expect(wrapper.find('.ant-statistic-title').classes()).toContain('c-title')
      expect(wrapper.find('.ant-statistic-content').classes()).toContain('c-content')
      expect(wrapper.find('.ant-statistic-content-prefix').classes()).toContain('c-prefix')
      expect(wrapper.find('.ant-statistic-content-suffix').classes()).toContain('c-suffix')
      expect(wrapper.find('.ant-statistic').attributes('style')).toContain('color: rgb(255, 0, 0)')
    })
  })

  // ============= ConfigProvider =============
  describe('configProvider', () => {
    it('should apply direction rtl', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Statistic value={100} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-statistic-rtl').exists()).toBe(true)
    })

    it('should apply custom prefixCls', () => {
      const wrapper = mount(() => (
        <ConfigProvider prefixCls="custom">
          <Statistic value={100} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.custom-statistic').exists()).toBe(true)
    })

    it('should apply ConfigProvider statistic classes and styles', () => {
      const wrapper = mount(() => (
        <ConfigProvider
          statistic={{
            classes: { root: 'cp-root' },
            styles: { root: { fontSize: '20px' } },
          }}
        >
          <Statistic value={100} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-statistic').classes()).toContain('cp-root')
      expect(wrapper.find('.ant-statistic').attributes('style')).toContain('font-size: 20px')
    })
  })

  // ============= Dynamic props =============
  describe('dynamic props', () => {
    it('should update when value changes', async () => {
      const value = ref(100)
      const wrapper = mount(() => <Statistic value={value.value} />)
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('100')

      value.value = 200
      await nextTick()
      expect(wrapper.find('.ant-statistic-content-value-int').text()).toBe('200')
    })

    it('should update when title changes', async () => {
      const title = ref('Old Title')
      const wrapper = mount(() => <Statistic title={title.value} value={100} />)
      expect(wrapper.find('.ant-statistic-title').text()).toBe('Old Title')

      title.value = 'New Title'
      await nextTick()
      expect(wrapper.find('.ant-statistic-title').text()).toBe('New Title')
    })

    it('should show/hide prefix dynamically', async () => {
      const prefix = ref<string | undefined>('$')
      const wrapper = mount(() => <Statistic prefix={prefix.value} value={100} />)
      expect(wrapper.find('.ant-statistic-content-prefix').exists()).toBe(true)

      prefix.value = undefined
      await nextTick()
      expect(wrapper.find('.ant-statistic-content-prefix').exists()).toBe(false)
    })
  })

  // ============= Expose =============
  it('should expose nativeElement via ref', () => {
    const wrapper = mount(Statistic)
    expect((wrapper.vm as any).nativeElement).toBeDefined()
  })

  // ============= Snapshot =============
  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Statistic
        title="Account Balance (CNY)"
        value={112893.12345}
        precision={2}
        prefix="$"
        suffix="万"
      />
    ))
    expect(wrapper.element).toMatchSnapshot()
  })

  // ============= Timer =============
  describe('timer', () => {
    mountTest(() => h(StatisticTimer, { type: 'countdown' }))

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should render countdown', async () => {
      const now = Date.now()
      const wrapper = mount(StatisticTimer, {
        props: { type: 'countdown', value: now + 10000 },
      })
      await nextTick()
      await flushPromises()

      const text = wrapper.find('.ant-statistic-content-value').text()
      expect(text).toBe('00:00:10')
    })

    it('should emit change on timer tick', async () => {
      const now = Date.now()
      const onChange = vi.fn()
      mount(StatisticTimer, {
        props: { type: 'countdown', value: now + 10000, onChange },
      })

      vi.advanceTimersByTime(100)
      await nextTick()
      await flushPromises()

      expect(onChange).toHaveBeenCalled()
    })

    it('should emit finish when countdown reaches zero', async () => {
      const now = Date.now()
      const onFinish = vi.fn()
      mount(StatisticTimer, {
        props: { type: 'countdown', value: now + 500, onFinish },
      })

      vi.advanceTimersByTime(1000)
      await nextTick()
      await flushPromises()

      expect(onFinish).toHaveBeenCalled()
    })

    it('should render countup', async () => {
      const now = Date.now()
      const wrapper = mount(StatisticTimer, {
        props: { type: 'countup', value: now - 30 * 60 * 1000 },
      })
      await nextTick()
      await flushPromises()

      const text = wrapper.find('.ant-statistic-content-value').text()
      expect(text).toBe('00:30:00')
    })

    it('should not emit finish for countup', async () => {
      const now = Date.now()
      const onFinish = vi.fn()
      mount(StatisticTimer, {
        props: { type: 'countup', value: now - 1000, onFinish },
      })

      vi.advanceTimersByTime(2000)
      await nextTick()
      await flushPromises()

      expect(onFinish).not.toHaveBeenCalled()
    })

    it('should use custom format', async () => {
      const now = Date.now()
      const wrapper = mount(StatisticTimer, {
        props: {
          type: 'countdown',
          value: now + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
          format: 'D天 HH:mm:ss',
        },
      })
      await nextTick()
      await flushPromises()

      const text = wrapper.find('.ant-statistic-content-value').text()
      expect(text).toContain('天')
      expect(text).toMatch(/2天/)
    })

    it('should pass data-* attributes through', () => {
      const wrapper = mount(() => (
        <StatisticTimer type="countdown" data-testid="timer" />
      ))
      expect(wrapper.find('[data-testid="timer"]').exists()).toBe(true)
    })

    it('should pass title and prefix/suffix through', async () => {
      const now = Date.now()
      const wrapper = mount(StatisticTimer, {
        props: {
          type: 'countdown',
          value: now + 10000,
          title: 'Timer Title',
          suffix: 'left',
        },
      })
      await nextTick()

      expect(wrapper.find('.ant-statistic-title').text()).toBe('Timer Title')
      expect(wrapper.find('.ant-statistic-content-suffix').text()).toBe('left')
    })
  })

  // ============= Utils =============
  describe('formatTimeStr', () => {
    it('should format hours minutes seconds', () => {
      // 1h 2m 3s = 3723000ms
      expect(formatTimeStr(3723000, 'HH:mm:ss')).toBe('01:02:03')
    })

    it('should format days', () => {
      // 2 days 3 hours = (2*24*3600 + 3*3600) * 1000
      expect(formatTimeStr(183600000, 'D天 HH:mm:ss')).toBe('2天 03:00:00')
    })

    it('should format with milliseconds', () => {
      expect(formatTimeStr(3723456, 'HH:mm:ss.SSS')).toBe('01:02:03.456')
    })

    it('should pad values based on format length', () => {
      expect(formatTimeStr(3723000, 'H:m:s')).toBe('1:2:3')
    })

    it('should handle escaped text in brackets', () => {
      expect(formatTimeStr(3723000, 'HH:mm:ss [remaining]')).toBe('01:02:03 remaining')
    })

    it('should handle zero duration', () => {
      expect(formatTimeStr(0, 'HH:mm:ss')).toBe('00:00:00')
    })

    it('should format with year and month', () => {
      // 1 year 2 months 3 days = 365*24*3600*1000 + 2*30*24*3600*1000 + 3*24*3600*1000
      const duration = 365 * 24 * 3600 * 1000 + 2 * 30 * 24 * 3600 * 1000 + 3 * 24 * 3600 * 1000
      expect(formatTimeStr(duration, 'Y年M月D天')).toBe('1年2月3天')
    })

    it('should skip units not in format string', () => {
      // 90 seconds → only mm:ss format, no hours
      expect(formatTimeStr(90000, 'mm:ss')).toBe('01:30')
    })
  })

  describe('formatCounter', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2020-01-01T00:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should compute countdown diff', () => {
      const now = Date.now()
      const target = now + 10000 // 10s in the future
      const result = formatCounter(target, { format: 'HH:mm:ss' }, true)
      expect(result).toBe('00:00:10')
    })

    it('should compute countup diff', () => {
      const now = Date.now()
      const target = now - 60000 // 1 minute ago
      const result = formatCounter(target, { format: 'HH:mm:ss' }, false)
      expect(result).toBe('00:01:00')
    })

    it('should clamp countdown to zero when past target', () => {
      const now = Date.now()
      const target = now - 5000 // 5s in the past
      const result = formatCounter(target, { format: 'HH:mm:ss' }, true)
      expect(result).toBe('00:00:00')
    })
  })
})
