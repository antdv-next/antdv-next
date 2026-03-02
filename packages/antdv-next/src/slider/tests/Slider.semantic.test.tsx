import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Slider from '..'

import { mount } from '/@tests/utils'

describe('slider semantic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should apply semantic classes as object', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
        classes: {
          root: 'c-root',
          tracks: 'c-tracks',
          track: 'c-track',
          rail: 'c-rail',
          handle: 'c-handle',
        },
      },
    })

    expect(wrapper.find('.ant-slider').classes()).toContain('c-root')
    expect(wrapper.find('.ant-slider-tracks').classes()).toContain('c-tracks')
    expect(wrapper.find('.ant-slider-track').classes()).toContain('c-track')
    expect(wrapper.find('.ant-slider-rail').classes()).toContain('c-rail')
    expect(wrapper.find('.ant-slider-handle').classes()).toContain('c-handle')
  })

  it('should apply semantic styles as object', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
        styles: {
          root: { padding: '10px' },
          track: { backgroundColor: 'rgb(255, 0, 0)' },
          rail: { backgroundColor: 'rgb(200, 200, 200)' },
          handle: { borderColor: 'rgb(0, 128, 0)' },
        },
      },
    })

    expect(wrapper.find('.ant-slider').attributes('style')).toContain('padding: 10px')
    expect(wrapper.find('.ant-slider-track').attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(wrapper.find('.ant-slider-rail').attributes('style')).toContain('background-color: rgb(200, 200, 200)')
    expect(wrapper.find('.ant-slider-handle').attributes('style')).toContain('border-color: rgb(0, 128, 0)')
  })

  it('should apply semantic classes as function', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        disabled: true,
        classes: ((info: any) => ({
          root: info?.props?.disabled ? 'disabled-root' : 'enabled-root',
          rail: 'fn-rail',
          handle: 'fn-handle',
        })) as any,
      },
    })

    expect(wrapper.find('.ant-slider').classes()).toContain('disabled-root')
    expect(wrapper.find('.ant-slider-rail').classes()).toContain('fn-rail')
    expect(wrapper.find('.ant-slider-handle').classes()).toContain('fn-handle')
  })

  it('should apply semantic styles as function', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        disabled: true,
        styles: ((info: any) => ({
          root: { opacity: info?.props?.disabled ? '0.5' : '1' },
          rail: { height: '8px' },
        })) as any,
      },
    })

    expect(wrapper.find('.ant-slider').attributes('style')).toContain('opacity: 0.5')
    expect(wrapper.find('.ant-slider-rail').attributes('style')).toContain('height: 8px')
  })

  it('should apply tracks semantic style', () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
        styles: {
          tracks: { opacity: '0.8' },
        },
      },
    })

    expect(wrapper.find('.ant-slider-tracks').attributes('style')).toContain('opacity: 0.8')
  })
})
