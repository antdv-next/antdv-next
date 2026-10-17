import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { resetWarned } from '../../_util/warning'
import BorderBeam from '../index'
import { getBorderBeamGradient, MAX_BEAM_COLOR_STOP_PERCENT } from '../util'
import mountTest from '/@tests/shared/mountTest'

describe('borderBeam', () => {
  mountTest(BorderBeam)

  afterEach(() => {
    // attachTo: document.body keeps DOM around between tests; reset it.
    document.body.innerHTML = ''
  })

  const renderWith = (props: Record<string, any> = {}, withChild = true) => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(BorderBeam, props, withChild
            ? { default: () => h('div', { class: 'host', style: 'border: 2px solid red; border-radius: 12px;' }, 'child') }
            : {})
      },
    })
    return mount(Host, { attachTo: document.body })
  }

  it('renders the child and portals an aria-hidden beam into the host element', async () => {
    const wrapper = renderWith()
    await nextTick()
    await nextTick()

    const host = document.querySelector('.host') as HTMLElement
    expect(host).toBeTruthy()

    const beam = host.querySelector('.ant-border-beam') as HTMLElement
    expect(beam).toBeTruthy()
    expect(beam.getAttribute('aria-hidden')).toBe('true')

    wrapper.unmount()
  })

  it('writes the inset-offset CSS variable when outset is supplied', async () => {
    const wrapper = renderWith({ outset: 4 })
    await nextTick()
    await nextTick()

    const host = document.querySelector('.host') as HTMLElement
    const beam = host.querySelector('.ant-border-beam') as HTMLElement
    expect(beam).toBeTruthy()

    const inline = beam.getAttribute('style') ?? ''
    expect(inline).toContain('--ant-border-beam-inset-offset')
    expect(inline).toContain('-4px')
    // The radius is inherited through CSS instead of being measured.
    expect(inline).not.toContain('--ant-border-beam-border-radius')

    wrapper.unmount()
  })

  it('renders the configured number of evenly distributed beams', async () => {
    const wrapper = renderWith()
    await nextTick()
    await nextTick()

    const host = document.querySelector('.host') as HTMLElement
    expect(host.querySelectorAll('.ant-border-beam')).toHaveLength(1)
    expect(
      (host.querySelector('.ant-border-beam') as HTMLElement).style.getPropertyValue(
        '--ant-border-beam-delay',
      ),
    ).toBe('')

    wrapper.unmount()

    const multiple = renderWith({ count: 3, duration: 12 })
    await nextTick()
    await nextTick()

    const multipleHost = document.querySelector('.host') as HTMLElement
    const beams = multipleHost.querySelectorAll<HTMLElement>('.ant-border-beam')
    expect(beams).toHaveLength(3)
    expect(
      Array.from(beams, item => item.style.getPropertyValue('--ant-border-beam-delay')),
    ).toEqual(['', '-4s', '-8s'])

    multiple.unmount()
  })

  // https://github.com/ant-design/ant-design/pull/59095
  it('should prioritize items over count and support configuring individual beams', async () => {
    resetWarned()
    const warningSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = renderWith({
      color: '#1677ff',
      count: 4,
      duration: 12,
      items: [{ color: '#36cfc9', lineWidth: 3, outset: 4, size: 60 }, {}],
      lineWidth: 2,
      outset: 1,
      size: 80,
    })
    await nextTick()
    await nextTick()

    const beams = document.querySelectorAll<HTMLElement>('.host .ant-border-beam')
    expect(beams).toHaveLength(2)
    expect(
      Array.from(beams, beam => ({
        color: beam.style.getPropertyValue('--ant-border-beam-beam-gradient'),
        lineWidth: beam.style.getPropertyValue('--ant-border-beam-line-width'),
        outset: beam.style.getPropertyValue('--ant-border-beam-inset-offset'),
        size: beam.style.getPropertyValue('--ant-border-beam-size'),
        delay: beam.style.getPropertyValue('--ant-border-beam-delay'),
      })),
    ).toEqual([
      {
        color: 'linear-gradient(to left, #36cfc9 0%, #36cfc9 70%, transparent)',
        lineWidth: '3px',
        outset: '-4px',
        size: '60px',
        delay: '',
      },
      {
        color: 'linear-gradient(to left, #1677ff 0%, #1677ff 70%, transparent)',
        lineWidth: '2px',
        outset: '-1px',
        size: '80px',
        delay: '-6s',
      },
    ])
    expect(warningSpy).toHaveBeenCalledWith(
      'Warning: [antd: BorderBeam] `count` is ignored when `items` is provided.',
    )
    warningSpy.mockRestore()
    wrapper.unmount()
  })

  it('normalizes invalid or fractional count values', async () => {
    const cases: Array<[count: any, expected: number]> = [
      [0, 1],
      [-1, 1],
      [Number.NaN, 1],
      [Number.POSITIVE_INFINITY, 1],
      ['3', 1],
      [2.7, 2],
    ]

    for (const [count, expected] of cases) {
      const wrapper = renderWith({ count })
      await nextTick()
      await nextTick()

      const host = document.querySelector('.host') as HTMLElement
      expect(host.querySelectorAll('.ant-border-beam')).toHaveLength(expected)

      wrapper.unmount()
      document.body.innerHTML = ''
    }
  })

  it('writes the color gradient CSS variable', async () => {
    const wrapper = renderWith({ color: '#ff0000' })
    await nextTick()
    await nextTick()

    const host = document.querySelector('.host') as HTMLElement
    const beam = host.querySelector('.ant-border-beam') as HTMLElement
    expect(beam).toBeTruthy()

    const inline = beam.getAttribute('style') ?? ''
    expect(inline).toContain('--ant-border-beam-beam-gradient')

    wrapper.unmount()
  })

  it('does not portal anything when no slot child is provided', async () => {
    const wrapper = renderWith({}, false)
    await nextTick()
    await nextTick()

    // No teleport target was captured, so no beam should land in the DOM.
    expect(document.querySelector('.ant-border-beam')).toBeNull()

    wrapper.unmount()
  })
})

describe('getBorderBeamGradient', () => {
  it('returns undefined for no value', () => {
    expect(getBorderBeamGradient()).toBeUndefined()
    expect(getBorderBeamGradient([])).toBeUndefined()
  })

  it('builds a linear-gradient from a solid color value', () => {
    const result = getBorderBeamGradient('#1677ff')
    expect(result).toContain('linear-gradient(to left, ')
    expect(result).toContain('#1677ff 0%')
    expect(result).toContain('transparent')
    // last stop is mapped to MAX_BEAM_COLOR_STOP_PERCENT.
    expect(result).toContain(`${MAX_BEAM_COLOR_STOP_PERCENT}%`)
  })

  it('scales explicit gradient stops into the reserved beam segment', () => {
    const result = getBorderBeamGradient([
      { color: '#ff0000', percent: 0 },
      { color: '#00ff00', percent: 50 },
      { color: '#0000ff', percent: 100 },
    ])
    expect(result).toContain('#ff0000 0%')
    // 50% of user range maps to 35% of the visible segment (50% * 70 / 100).
    expect(result).toContain('#00ff00 35%')
    // 100% of user range maps to MAX_BEAM_COLOR_STOP_PERCENT.
    expect(result).toContain(`#0000ff ${MAX_BEAM_COLOR_STOP_PERCENT}%`)
  })

  it('clamps out-of-range percent values', () => {
    const result = getBorderBeamGradient([
      { color: '#abc', percent: -10 },
      { color: '#def', percent: 200 },
    ])
    expect(result).toContain('#abc 0%')
    expect(result).toContain(`#def ${MAX_BEAM_COLOR_STOP_PERCENT}%`)
  })
})
