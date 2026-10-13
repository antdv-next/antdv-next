import { describe, expect, it, vi } from 'vitest'
import Avatar from '..'
import { mount } from '/@tests/utils'

vi.mock('../../grid/hooks/useBreakpoint', async () => {
  const { ref } = await import('vue')
  return {
    default: vi.fn(() => ref({
      xxxl: true,
      xxl: true,
      xl: true,
      lg: true,
      md: true,
      sm: true,
      xs: true,
    })),
  }
})

describe('avatar responsive size', () => {
  it('uses the nearest configured breakpoint when larger breakpoints are active', () => {
    const wrapper = mount(Avatar, {
      props: {
        size: { md: 40 },
      },
      slots: {
        default: () => 'A',
      },
    })

    const style = wrapper.find('.ant-avatar').attributes('style') || ''
    expect(style).toContain('width: 40px')
    expect(style).toContain('height: 40px')
    expect(style).toContain('font-size: 20px')
  })

  it('uses a configured larger breakpoint when one is available', () => {
    const wrapper = mount(Avatar, {
      props: {
        size: { md: 40, xxl: 100 },
      },
      slots: {
        default: () => 'A',
      },
    })

    const style = wrapper.find('.ant-avatar').attributes('style') || ''
    expect(style).toContain('width: 100px')
    expect(style).toContain('height: 100px')
    expect(style).toContain('font-size: 50px')
  })
})
