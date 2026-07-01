import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { LayoutSider } from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/57938
describe('layout sider semantic classes/styles', () => {
  it('customizes root and body with semantic classes and styles', () => {
    const wrapper = mount(() => (
      <LayoutSider
        classes={{ root: 'custom-sider-root', body: 'custom-sider-body' }}
        styles={{
          root: { backgroundColor: 'rgb(1, 2, 3)' },
          body: { display: 'flex', flexDirection: 'column' },
        }}
      >
        Sider
      </LayoutSider>
    ))

    const sider = wrapper.find('.ant-layout-sider')
    const body = wrapper.find('.ant-layout-sider-children')

    expect(sider.classes()).toContain('custom-sider-root')
    expect((sider.element as HTMLElement).style.backgroundColor).toBe('rgb(1, 2, 3)')
    expect(sider.classes()).not.toContain('custom-sider-body')
    expect(body.classes()).toContain('custom-sider-body')
    expect((body.element as HTMLElement).style.display).toBe('flex')
    expect((body.element as HTMLElement).style.flexDirection).toBe('column')
  })

  it('passes merged state to semantic classes/styles callbacks', async () => {
    const collapsed = ref(false)
    const wrapper = mount(() => (
      <LayoutSider
        collapsed={collapsed.value}
        classes={({ props }: any) => ({
          body: props.collapsed ? 'body-collapsed' : 'body-expanded',
        })}
        styles={({ props }: any) => ({
          body: { opacity: props.collapsed ? 0.5 : 1 },
        })}
      >
        Sider
      </LayoutSider>
    ))

    const body = () => wrapper.find('.ant-layout-sider-children')
    expect(body().classes()).toContain('body-expanded')
    expect((body().element as HTMLElement).style.opacity).toBe('1')

    collapsed.value = true
    await nextTick()

    expect(body().classes()).toContain('body-collapsed')
    expect((body().element as HTMLElement).style.opacity).toBe('0.5')
  })

  // Uncontrolled: props.collapsed stays undefined, callbacks must see the effective state.
  it('passes the effective collapsed state to callbacks when uncontrolled', () => {
    const wrapper = mount(() => (
      <LayoutSider
        defaultCollapsed
        collapsible
        classes={({ props }: any) => ({
          body: props.collapsed ? 'body-collapsed' : 'body-expanded',
        })}
      >
        Sider
      </LayoutSider>
    ))

    // defaultCollapsed with no `collapsed` prop -> the callback must see the
    // effective collapsed state (from the internal ref), not undefined.
    expect(wrapper.find('.ant-layout-sider-children').classes()).toContain('body-collapsed')
  })
})
