import type { ScreenMap } from '../../_util/responsiveObserver'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Avatar from '..'
import { mount } from '/@tests/utils'

const { screens } = vi.hoisted(() => ({
  screens: { current: null as null | import('vue').Ref<ScreenMap | null> },
}))

vi.mock('../../grid/hooks/useBreakpoint', () => {
  const useBreakpoint = () => screens.current!
  return { default: useBreakpoint, useBreakpoint }
})

screens.current = ref<ScreenMap | null>({})

function getStyle(wrapper: ReturnType<typeof mount>) {
  return (wrapper.find('.ant-avatar').element as HTMLElement).style
}

// https://github.com/ant-design/ant-design/pull/59446
describe('avatar responsive size', () => {
  it('should retain the configured size when a larger breakpoint matches', async () => {
    const baseScreens = { sm: true, md: true, lg: true, xl: true, xxl: true, xxxl: false }
    screens.current!.value = baseScreens
    const wrapper = mount(Avatar, {
      props: { size: { xxl: 100 } },
      slots: { default: () => 'A' },
    })
    expect(getStyle(wrapper)).toMatchObject({ width: '100px', height: '100px', fontSize: '50px' })

    screens.current!.value = { ...baseScreens, xxxl: true }
    await nextTick()
    expect(getStyle(wrapper)).toMatchObject({ width: '100px', height: '100px', fontSize: '50px' })

    await wrapper.setProps({ size: { xxl: 100, xxxl: 120 } })
    expect(getStyle(wrapper)).toMatchObject({ width: '120px', height: '120px', fontSize: '60px' })

    screens.current!.value = baseScreens
    await nextTick()
    expect(getStyle(wrapper)).toMatchObject({ width: '100px', height: '100px', fontSize: '50px' })

    // jsdom keeps the previous width when given an invalid value, so check a fresh mount too
    screens.current!.value = { ...baseScreens, xxxl: true }
    const fresh = mount(Avatar, {
      props: { size: { xxl: 100 } },
      slots: { default: () => 'A' },
    })
    expect(getStyle(fresh)).toMatchObject({ width: '100px', height: '100px', fontSize: '50px' })
  })

  it('should only use sizes from matching breakpoints', async () => {
    screens.current!.value = { xs: false, sm: true, md: true, lg: true }
    const wrapper = mount(Avatar, {
      props: { size: { md: 40, xxl: 100 } },
      slots: { default: () => 'A' },
    })
    expect(getStyle(wrapper)).toMatchObject({ width: '40px', height: '40px', fontSize: '20px' })

    screens.current!.value = { xs: true, sm: false, md: false, lg: false }
    await nextTick()
    expect(getStyle(wrapper).width).toBe('')
    expect(getStyle(wrapper).height).toBe('')
    expect(getStyle(wrapper).fontSize).toBe('')
  })
})
