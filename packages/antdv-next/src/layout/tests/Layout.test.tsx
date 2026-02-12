import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Layout, { LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('layout', () => {
  mountTest(Layout)
  mountTest(LayoutContent)
  mountTest(LayoutHeader)
  mountTest(LayoutFooter)
  mountTest(LayoutSider)
  mountTest(() => h(Layout, null, [h(LayoutSider), h(LayoutContent)]))

  rtlTest(() => h(Layout))
  rtlTest(() => h(LayoutContent))
  rtlTest(() => h(LayoutSider))

  it('should render div for layout', () => {
    const wrapper = mount(Layout)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('.ant-layout').exists()).toBe(true)
  })

  it('should render header tag', () => {
    const wrapper = mount(LayoutHeader)
    expect(wrapper.element.tagName).toBe('HEADER')
    expect(wrapper.find('.ant-layout-header').exists()).toBe(true)
  })

  it('should render footer tag', () => {
    const wrapper = mount(LayoutFooter)
    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.find('.ant-layout-footer').exists()).toBe(true)
  })

  it('should render main tag for content', () => {
    const wrapper = mount(LayoutContent)
    expect(wrapper.element.tagName).toBe('MAIN')
    expect(wrapper.find('.ant-layout-content').exists()).toBe(true)
  })

  describe('has-sider detection', () => {
    it('should detect sider as direct children', () => {
      const wrapper = mount(() => (
        <Layout>
          <LayoutSider>Sider</LayoutSider>
          <LayoutContent>Content</LayoutContent>
        </Layout>
      ))
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)
    })

    it('should detect sider inside nested div via context', async () => {
      const wrapper = mount(() => (
        <Layout>
          <div><LayoutSider>Sider</LayoutSider></div>
          <LayoutContent>Content</LayoutContent>
        </Layout>
      ))
      // sider registers via context (addSider), re-render is async
      await nextTick()
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)
    })

    it('should not have has-sider without sider', () => {
      const wrapper = mount(() => (
        <Layout><LayoutContent>Content</LayoutContent></Layout>
      ))
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(false)
    })

    it('should force has-sider with hasSider prop', () => {
      const wrapper = mount(() => (
        <Layout hasSider><LayoutContent>Content</LayoutContent></Layout>
      ))
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)
    })

    it('should force no has-sider with hasSider=false even with sider', () => {
      const wrapper = mount(() => (
        <Layout hasSider={false}>
          <LayoutSider>Sider</LayoutSider>
          <LayoutContent>Content</LayoutContent>
        </Layout>
      ))
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(false)
    })

    it('should remove has-sider when all siders unmount', async () => {
      const show1 = ref(true)
      const show2 = ref(true)
      const wrapper = mount(() => (
        <Layout>
          {show1.value ? <LayoutSider>S1</LayoutSider> : null}
          {show2.value ? <LayoutSider>S2</LayoutSider> : null}
          <LayoutContent>C</LayoutContent>
        </Layout>
      ))
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)

      show1.value = false
      await nextTick()
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)

      show2.value = false
      await nextTick()
      expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(false)
    })
  })

  it('should support rootClass', () => {
    const wrapper = mount(Layout, { props: { rootClass: 'my-root' } })
    expect(wrapper.find('.ant-layout').classes()).toContain('my-root')
  })

  describe('attrs passthrough', () => {
    it('should pass style and class on layout', () => {
      const wrapper = mount(() => <Layout class="custom-cls" style={{ color: 'red' }} />)
      const el = wrapper.find('.ant-layout')
      expect(el.classes()).toContain('custom-cls')
      expect(el.attributes('style')).toContain('color: red')
    })

    it('should pass data attributes on layout', () => {
      const wrapper = mount(() => <Layout data-testid="my-layout" />)
      expect(wrapper.find('[data-testid="my-layout"]').exists()).toBe(true)
    })

    it('should pass class and style on header', () => {
      const wrapper = mount(() => <LayoutHeader class="hdr" style={{ color: 'blue' }} />)
      const el = wrapper.find('header')
      expect(el.classes()).toContain('hdr')
      expect(el.attributes('style')).toContain('color: blue')
    })

    it('should pass class and style on footer', () => {
      const wrapper = mount(() => <LayoutFooter class="ftr" style={{ color: 'green' }} />)
      const el = wrapper.find('footer')
      expect(el.classes()).toContain('ftr')
      expect(el.attributes('style')).toContain('color: green')
    })

    it('should pass class and style on content', () => {
      const wrapper = mount(() => <LayoutContent class="cnt" style={{ color: 'purple' }} />)
      const el = wrapper.find('main')
      expect(el.classes()).toContain('cnt')
      expect(el.attributes('style')).toContain('color: purple')
    })

    it('should pass class, style and data attributes on sider', () => {
      const wrapper = mount(() => (
        <Layout>
          <LayoutSider class="sdr" style={{ color: 'orange' }} data-testid="my-sider">Sider</LayoutSider>
        </Layout>
      ))
      const el = wrapper.find('aside')
      expect(el.classes()).toContain('sdr')
      expect(el.attributes('style')).toContain('color: orange')
      expect(wrapper.find('[data-testid="my-sider"]').exists()).toBe(true)
    })
  })

  describe('rtl direction', () => {
    it('should apply rtl class with ConfigProvider', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl"><Layout /></ConfigProvider>
      ))
      expect(wrapper.find('.ant-layout-rtl').exists()).toBe(true)
    })
  })

  // layout is NOT in ConfigProvider PASSED_PROPS

  describe('sider', () => {
    describe('theme', () => {
      it('should default to dark theme', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-dark').exists()).toBe(true)
      })

      it('should support light theme', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider theme="light">Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-light').exists()).toBe(true)
      })
    })

    describe('width', () => {
      it('should default to 200px', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 200px')
      })

      it('should support custom number width', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider width={300}>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 300px')
      })

      it('should support percentage width', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider width="50%">Sider</LayoutSider></Layout>
        ))
        const style = wrapper.find('.ant-layout-sider').attributes('style')!
        expect(style).toContain('width: 50%')
        expect(style).toContain('flex: 0 0 50%')
      })

      it('should convert numeric string to px', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider width="300">Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 300px')
      })
    })

    describe('collapsible', () => {
      it('should not render trigger without trigger slot', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider collapsible>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-trigger').exists()).toBe(false)
        expect(wrapper.find('.ant-layout-sider-has-trigger').exists()).toBe(false)
      })

      it('should render trigger with trigger slot', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible>
              {{ default: () => 'Sider', trigger: () => <span class="my-trigger">T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-trigger').exists()).toBe(true)
        expect(wrapper.find('.ant-layout-sider-has-trigger').exists()).toBe(true)
        expect(wrapper.find('.my-trigger').exists()).toBe(true)
      })

      it('should toggle collapsed on trigger click', async () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(false)
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 200px')

        await wrapper.find('.ant-layout-sider-trigger').trigger('click')
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(true)
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 80px')
      })

      it('should emit collapse and update:collapsed on trigger click', async () => {
        const onCollapse = vi.fn()
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible onCollapse={onCollapse}>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        await wrapper.find('.ant-layout-sider-trigger').trigger('click')
        expect(onCollapse).toHaveBeenCalledWith(true, 'clickTrigger')

        const sider = wrapper.findComponent(LayoutSider)
        expect(sider.emitted('update:collapsed')![0]).toEqual([true])
      })

      it('should hide trigger when trigger slot returns null', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible>
              {{ default: () => 'Sider', trigger: () => null }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-trigger').exists()).toBe(false)
        expect(wrapper.find('.ant-layout-sider-has-trigger').exists()).toBe(false)
      })
    })

    describe('controlled collapsed', () => {
      it('should respect collapsed prop', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider collapsed>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(true)
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 80px')
      })

      it('should not toggle internally in controlled mode', async () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsed={false} collapsible>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        await wrapper.find('.ant-layout-sider-trigger').trigger('click')
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(false)
      })
    })

    it('should support defaultCollapsed', () => {
      const wrapper = mount(() => (
        <Layout><LayoutSider defaultCollapsed>Sider</LayoutSider></Layout>
      ))
      expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(true)
    })

    describe('collapsed width', () => {
      it('should use default collapsedWidth of 80px', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider collapsed>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 80px')
      })

      it('should support custom collapsedWidth', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider collapsed collapsedWidth={60}>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider').attributes('style')).toContain('width: 60px')
      })
    })

    describe('zero width', () => {
      it('should apply zero-width class when collapsed with collapsedWidth=0', () => {
        const wrapper = mount(() => (
          <Layout><LayoutSider collapsed collapsedWidth={0}>Sider</LayoutSider></Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-zero-width').exists()).toBe(true)
      })

      it('should show zero-width trigger with trigger slot', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible collapsedWidth={0}>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-zero-width-trigger').exists()).toBe(true)
      })

      it('should toggle on zero-width trigger click', async () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible collapsedWidth={0}>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        await wrapper.find('.ant-layout-sider-zero-width-trigger').trigger('click')
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(true)
        expect(wrapper.find('.ant-layout-sider-zero-width').exists()).toBe(true)

        await wrapper.find('.ant-layout-sider-zero-width-trigger').trigger('click')
        expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(false)
      })

      it('should apply zeroWidthTriggerStyle', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsible collapsedWidth={0} zeroWidthTriggerStyle={{ background: 'rgb(255, 0, 0)' }}>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(
          wrapper.find('.ant-layout-sider-zero-width-trigger').attributes('style'),
        ).toContain('background: rgb(255, 0, 0)')
      })
    })

    describe('reverseArrow', () => {
      it('should reverse zero-width trigger direction', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsed collapsible collapsedWidth={0} reverseArrow>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-zero-width-trigger-right').exists()).toBe(true)
      })

      it('should default to left direction', () => {
        const wrapper = mount(() => (
          <Layout>
            <LayoutSider collapsed collapsible collapsedWidth={0}>
              {{ default: () => 'Sider', trigger: () => <span>T</span> }}
            </LayoutSider>
          </Layout>
        ))
        expect(wrapper.find('.ant-layout-sider-zero-width-trigger-left').exists()).toBe(true)
      })
    })

    describe('breakpoint', () => {
      it('should emit breakpoint event when breakpoint matches', () => {
        const matchMediaMock = vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })
        vi.stubGlobal('matchMedia', matchMediaMock)

        const onBreakpoint = vi.fn()
        mount(() => (
          <Layout>
            <LayoutSider breakpoint="lg" onBreakpoint={onBreakpoint}>Sider</LayoutSider>
          </Layout>
        ))
        expect(matchMediaMock).toHaveBeenCalledWith('screen and (max-width: 991.98px)')
        expect(onBreakpoint).toHaveBeenCalledWith(true)

        vi.unstubAllGlobals()
      })

      it('should emit breakpoint false when not matching', () => {
        const matchMediaMock = vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })
        vi.stubGlobal('matchMedia', matchMediaMock)

        const onBreakpoint = vi.fn()
        mount(() => (
          <Layout>
            <LayoutSider breakpoint="xs" onBreakpoint={onBreakpoint}>Sider</LayoutSider>
          </Layout>
        ))
        expect(matchMediaMock).toHaveBeenCalledWith('screen and (max-width: 479.98px)')
        expect(onBreakpoint).toHaveBeenCalledWith(false)

        vi.unstubAllGlobals()
      })

      it('should register and cleanup media query listener', () => {
        const addEventListener = vi.fn()
        const removeEventListener = vi.fn()
        const matchMediaMock = vi.fn().mockReturnValue({
          matches: false,
          addEventListener,
          removeEventListener,
        })
        vi.stubGlobal('matchMedia', matchMediaMock)

        const wrapper = mount(() => (
          <Layout>
            <LayoutSider breakpoint="md">Sider</LayoutSider>
          </Layout>
        ))
        expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

        wrapper.unmount()
        expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))

        vi.unstubAllGlobals()
      })
    })

    it('should render children in sider-children div', () => {
      const wrapper = mount(() => (
        <Layout>
          <LayoutSider><span class="inner">Hi</span></LayoutSider>
        </Layout>
      ))
      expect(wrapper.find('.ant-layout-sider-children .inner').exists()).toBe(true)
    })
  })

  it('should update has-sider dynamically', async () => {
    const hasSider = ref(false)
    const wrapper = mount(() => (
      <Layout hasSider={hasSider.value}><LayoutContent>C</LayoutContent></Layout>
    ))
    expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(false)

    hasSider.value = true
    await nextTick()
    expect(wrapper.find('.ant-layout-has-sider').exists()).toBe(true)
  })

  it('should render correct snapshot', () => {
    const wrapper = mount(() => (
      <Layout>
        <LayoutHeader>Header</LayoutHeader>
        <Layout>
          <LayoutSider>Sider</LayoutSider>
          <LayoutContent>Content</LayoutContent>
        </Layout>
        <LayoutFooter>Footer</LayoutFooter>
      </Layout>
    ))
    expect(wrapper.element).toMatchSnapshot()
  })
})
