import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, getCurrentInstance, nextTick, ref } from 'vue'
import { Affix, Avatar, Form, FormItem, Row } from '../src'

// 卸载时 scope.stop() 会在父组件的渲染 effect 中同步执行 watch 的 onCleanup，
// 若 cleanup 读取了 computed，父组件会订阅到已卸载组件的 computed，使其（及其持有的
// DOM）在父组件下次重新渲染前都无法回收。这里断言卸载后父组件没有订阅任何 computed。
function getComputedDeps(instance: any) {
  const deps: unknown[] = []
  for (let link = instance.effect.deps; link; link = link.nextDep) {
    if (link.dep.computed)
      deps.push(link.dep.computed)
  }
  return deps
}

async function mountAndUnmount(render: () => any, afterMount?: () => Promise<void>) {
  const show = ref(true)
  let parent: any
  const wrapper = mount(defineComponent({
    setup() {
      parent = getCurrentInstance()
      return () => <div>{show.value ? render() : null}</div>
    },
  }), { attachTo: document.body })
  await nextTick()
  await nextTick()
  await afterMount?.()
  show.value = false
  await nextTick()
  const deps = getComputedDeps(parent)
  wrapper.unmount()
  return deps
}

describe('unmount cleanup does not subscribe the parent render effect', () => {
  it('useBreakpoint (Row / Avatar / FormItem)', async () => {
    expect(await mountAndUnmount(() => <Row />)).toEqual([])
    expect(await mountAndUnmount(() => <Avatar size={{ xs: 24, md: 40 }}>A</Avatar>)).toEqual([])
    expect(await mountAndUnmount(() => (
      <Form model={{ a: '' }}>
        <FormItem name="a"><input /></FormItem>
      </Form>
    ))).toEqual([])
  })

  it('affix', async () => {
    const offsetTop = ref(0)
    const deps = await mountAndUnmount(
      () => <Affix offsetTop={offsetTop.value}><span>x</span></Affix>,
      async () => {
        // 触发监听 watch，使其注册 onCleanup
        offsetTop.value = 10
        await nextTick()
        await nextTick()
      },
    )
    expect(deps).toEqual([])
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
