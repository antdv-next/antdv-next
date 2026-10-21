import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, getCurrentInstance, nextTick, ref } from 'vue'
import { Affix, Anchor, Avatar, Checkbox, CheckboxGroup, Form, FormItem, Row } from '../src'

// 卸载时 scope.stop() 会在父组件的渲染 effect 中同步执行 watch 的 onCleanup，且不会
// 暂停依赖收集。cleanup 中读到的响应式数据都会被父组件订阅：读 computed 会让已卸载的
// 组件（及其 DOM）在父组件下次重新渲染前无法回收；先读后写同一个 ref 则会让父组件在
// 同一轮更新里多渲染一次。这里断言卸载后父组件只渲染一次，且只依赖控制显隐的 `show`。
async function mountAndUnmount(render: () => any, afterMount?: () => Promise<void>) {
  const show = ref(true)
  let parent: any
  let renders = 0
  const wrapper = mount(defineComponent({
    setup() {
      parent = getCurrentInstance()
      return () => {
        renders++
        return <div>{show.value ? render() : null}</div>
      }
    },
  }), { attachTo: document.body })
  await nextTick()
  await nextTick()
  await afterMount?.()
  const rendersBefore = renders
  show.value = false
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 20))
  const deps: unknown[] = []
  for (let link = parent.effect.deps; link; link = link.nextDep) {
    if (link.dep !== (show as any).dep)
      deps.push(link.dep)
  }
  const result = { deps, renders: renders - rendersBefore }
  wrapper.unmount()
  return result
}

const clean = { deps: [], renders: 1 }

describe('unmount cleanup does not subscribe or re-render the parent', () => {
  it('useBreakpoint (Row / Avatar)', async () => {
    expect(await mountAndUnmount(() => <Row />)).toEqual(clean)
    expect(await mountAndUnmount(() => <Avatar size={{ xs: 24, md: 40 }}>A</Avatar>)).toEqual(clean)
  })

  it('form', async () => {
    expect(await mountAndUnmount(() => (
      <Form model={{ a: '' }}>
        <FormItem name="a"><input /></FormItem>
      </Form>
    ))).toEqual(clean)
  })

  it('affix', async () => {
    const offsetTop = ref(0)
    expect(await mountAndUnmount(
      () => <Affix offsetTop={offsetTop.value}><span>x</span></Affix>,
      async () => {
        // 触发监听 watch，使其注册 onCleanup
        offsetTop.value = 10
        await nextTick()
        await nextTick()
      },
    )).toEqual(clean)
  })

  it('anchor', async () => {
    expect(await mountAndUnmount(
      () => <Anchor affix={false} items={[{ key: '1', href: '#a', title: 'a' }]} />,
    )).toEqual(clean)
  })

  it('checkbox group', async () => {
    expect(await mountAndUnmount(() => (
      <CheckboxGroup>
        <Checkbox value="a">a</Checkbox>
      </CheckboxGroup>
    ))).toEqual(clean)
  })

  it('useBreakpoint does not subscribe when unmounted before the deferred subscription', async () => {
    const matchMedia = vi.spyOn(window, 'matchMedia')
    // 挂载后同步卸载：延迟到 nextTick 的订阅不应再执行，否则订阅永远不会被注销
    mount(() => <Row />).unmount()
    matchMedia.mockClear()
    await nextTick()
    await nextTick()
    expect(matchMedia).not.toHaveBeenCalled()
    matchMedia.mockRestore()
  })
})
