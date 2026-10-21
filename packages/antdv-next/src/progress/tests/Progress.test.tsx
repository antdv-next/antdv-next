import { describe, expect, it } from 'vitest'
import Progress from '..'
import { mount } from '/@tests/utils'

describe('progress', () => {
  // ========================= Basic =========================
  it('renders line progress by default', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.find('.ant-progress').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-line').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('50')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  it('renders circle progress', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 70 },
    })
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true)
  })

  it('renders dashboard progress', () => {
    const wrapper = mount(Progress, {
      props: { type: 'dashboard', percent: 60 },
    })
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true)
  })

  // ========================= Percent =========================
  it('displays percent text', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.find('.ant-progress-indicator').text()).toBe('50%')
  })

  it('clamps percent between 0 and 100', () => {
    const wrapper = mount(Progress, {
      props: { percent: 120, status: 'normal' },
    })
    // validProgress clamps to 100, but status stays normal (explicitly set)
    expect(wrapper.find('.ant-progress-indicator').text()).toBe('100%')
    const track = wrapper.find('.ant-progress-track')
    expect(track.attributes('style')).toContain('width: 100%')
  })

  it('handles 0 percent', () => {
    const wrapper = mount(Progress, {
      props: { percent: 0 },
    })
    expect(wrapper.find('.ant-progress-indicator').text()).toBe('0%')
  })

  // ========================= Status =========================
  it('renders normal status by default', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.find('.ant-progress-status-normal').exists()).toBe(true)
  })

  it('renders exception status', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, status: 'exception' },
    })
    expect(wrapper.find('.ant-progress-status-exception').exists()).toBe(true)
  })

  it('renders active status', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, status: 'active' },
    })
    expect(wrapper.find('.ant-progress-status-active').exists()).toBe(true)
  })

  it('renders success status', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, status: 'success' },
    })
    expect(wrapper.find('.ant-progress-status-success').exists()).toBe(true)
  })

  it('auto success when percent >= 100', () => {
    const wrapper = mount(Progress, {
      props: { percent: 100 },
    })
    expect(wrapper.find('.ant-progress-status-success').exists()).toBe(true)
  })

  it('does not auto success when status is explicitly set', () => {
    const wrapper = mount(Progress, {
      props: { percent: 100, status: 'active' },
    })
    expect(wrapper.find('.ant-progress-status-active').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-status-success').exists()).toBe(false)
  })

  // ========================= showInfo =========================
  it('shows info by default', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.find('.ant-progress-show-info').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-indicator').exists()).toBe(true)
  })

  it('hides info when showInfo is false', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, showInfo: false },
    })
    expect(wrapper.find('.ant-progress-show-info').exists()).toBe(false)
    expect(wrapper.find('.ant-progress-indicator').exists()).toBe(false)
  })

  // ========================= Format =========================
  it('supports custom format', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        format: (percent: number) => `${percent} Days`,
      },
    })
    expect(wrapper.find('.ant-progress-indicator').text()).toBe('50 Days')
  })

  it('format receives successPercent', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 60,
        success: { percent: 30 },
        format: (percent: number, successPercent: number) =>
          `${percent}% / ${successPercent}%`,
      },
    })
    expect(wrapper.find('.ant-progress-indicator').text()).toBe('60% / 30%')
  })

  // ========================= Success =========================
  it('renders success segment', () => {
    const wrapper = mount(Progress, {
      props: { percent: 60, success: { percent: 30 } },
    })
    const tracks = wrapper.findAll('.ant-progress-track')
    expect(tracks.length).toBe(2)
    const successTrack = wrapper.find('.ant-progress-track-success')
    expect(successTrack.exists()).toBe(true)
  })

  // ========================= strokeColor =========================
  it('supports string strokeColor', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, strokeColor: '#108ee9' },
    })
    const track = wrapper.find('.ant-progress-track')
    expect(track.attributes('style')).toContain('#108ee9')
  })

  it('supports gradient strokeColor object', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        strokeColor: { from: '#108ee9', to: '#87d068' },
      },
    })
    const track = wrapper.find('.ant-progress-track')
    expect(track.attributes('style')).toContain('linear-gradient')
  })

  // ========================= railColor =========================
  it('supports railColor', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, railColor: '#e8e8e8' },
    })
    const rail = wrapper.find('.ant-progress-rail')
    // jsdom converts hex to rgb
    expect(rail.attributes('style')).toContain('background-color')
  })

  // ========================= Size =========================
  it('renders small size', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, size: 'small' },
    })
    expect(wrapper.find('.ant-progress-small').exists()).toBe(true)
  })

  it('supports number size for line', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, size: 20 },
    })
    // number size sets both width and height to same value
    const rail = wrapper.find('.ant-progress-rail')
    expect(rail.attributes('style')).toContain('height: 20px')
  })

  it('supports array size for line', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, size: [300, 20] as any },
    })
    const rail = wrapper.find('.ant-progress-rail')
    expect(rail.attributes('style')).toContain('height: 20px')
  })

  // ========================= strokeLinecap =========================
  it('supports strokeLinecap butt', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, strokeLinecap: 'butt' },
    })
    const rail = wrapper.find('.ant-progress-rail')
    expect(rail.attributes('style')).toContain('border-radius: 0px')
  })

  // ========================= Steps =========================
  it('renders steps progress', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, steps: 5 },
    })
    expect(wrapper.find('.ant-progress-steps').exists()).toBe(true)
    const items = wrapper.findAll('.ant-progress-steps-item')
    expect(items.length).toBe(5)
  })

  it('renders steps with correct active count', () => {
    const wrapper = mount(Progress, {
      props: { percent: 60, steps: 5 },
    })
    const activeItems = wrapper.findAll('.ant-progress-steps-item-active')
    expect(activeItems.length).toBe(3)
  })

  it('supports steps as object with count and gap', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, steps: { count: 4, gap: 4 } },
    })
    const items = wrapper.findAll('.ant-progress-steps-item')
    expect(items.length).toBe(4)
  })

  // ========================= percentPosition =========================
  it('supports inner percentPosition', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        percentPosition: { type: 'inner' },
      },
    })
    expect(wrapper.find('.ant-progress-line-position-inner').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-indicator-inner').exists()).toBe(true)
  })

  it('supports percentPosition align', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        percentPosition: { align: 'center' },
      },
    })
    expect(wrapper.find('.ant-progress-line-align-center').exists()).toBe(true)
  })

  // ========================= gapDegree & gapPlacement =========================
  it('supports gapDegree for dashboard', () => {
    const wrapper = mount(Progress, {
      props: { type: 'dashboard', percent: 50, gapDegree: 90 },
    })
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true)
  })

  // ========================= ARIA =========================
  it('supports aria attributes via attrs', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
      attrs: { 'aria-label': 'Loading', 'data-testid': 'progress' },
    })
    // restAttrs spreads aria and data attributes
    expect(wrapper.attributes('data-testid')).toBe('progress')
  })

  it('forwards aria-label and aria-labelledby props to the root element', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 50,
        'aria-label': 'Loading',
        'aria-labelledby': 'progress-label',
      },
    })
    expect(wrapper.attributes('aria-label')).toBe('Loading')
    expect(wrapper.attributes('aria-labelledby')).toBe('progress-label')
  })

  it('omits aria-label when not provided', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
  })

  it('has correct progressbar role and aria values', () => {
    const wrapper = mount(Progress, {
      props: { percent: 75 },
    })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('75')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  // ========================= Circle size =========================
  it('renders inline circle when size <= 20', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 50, size: 14 },
    })
    expect(wrapper.find('.ant-progress-inline-circle').exists()).toBe(true)
  })

  it('renders circle with small preset size', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 50, size: 'small' },
    })
    expect(wrapper.find('.ant-progress-small').exists()).toBe(true)
  })

  // ========================= Icon for status =========================
  it('shows icon for success status on line', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, status: 'success' },
    })
    // CheckCircleFilled icon should be rendered in indicator
    const indicator = wrapper.find('.ant-progress-indicator')
    expect(indicator.find('.anticon').exists()).toBe(true)
  })

  it('shows icon for exception status on line', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, status: 'exception' },
    })
    const indicator = wrapper.find('.ant-progress-indicator')
    expect(indicator.find('.anticon').exists()).toBe(true)
  })

  it('shows icon for success on circle', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 100, status: 'success' },
    })
    expect(wrapper.find('.anticon-check').exists()).toBe(true)
  })

  it('shows icon for exception on circle', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 50, status: 'exception' },
    })
    expect(wrapper.find('.anticon-close').exists()).toBe(true)
  })

  // ========================= Snapshot =========================
  it('matches snapshot for line progress', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50 },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for circle progress', () => {
    const wrapper = mount(Progress, {
      props: { type: 'circle', percent: 70 },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for dashboard progress', () => {
    const wrapper = mount(Progress, {
      props: { type: 'dashboard', percent: 60 },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for steps progress', () => {
    const wrapper = mount(Progress, {
      props: { percent: 60, steps: 5, strokeColor: '#52c41a' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // https://github.com/ant-design/ant-design/pull/59597
  it('should support string width in `size` for line progress', () => {
    const wrapper = mount(Progress, {
      props: { percent: 50, size: ['50%', 20] },
    })
    expect((wrapper.find('.ant-progress-line .ant-progress-body').element as HTMLElement).style.width).toBe('50%')
    expect((wrapper.find('.ant-progress-line .ant-progress-rail').element as HTMLElement).style.height).toBe('20px')
  })
})
