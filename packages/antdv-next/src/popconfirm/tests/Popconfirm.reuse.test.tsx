import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Popconfirm from '..'
import { mount } from '/@tests/utils'

// 回归测试：复现 issue #576
// 无 rowKey 的表格翻页后，行（及其内部 Popconfirm 实例）按位置被复用，本次更新里
// 只有 `@confirm` 回调发生变化。生产构建下 Vue 的 shouldUpdateComponent 会把「仅 emit
// 监听器变化」当作无需更新而跳过 Popconfirm 的重渲染，导致点击删除时拿到的是旧（第一页）
// 的 record。修复后 confirm 通过实时监听转发，应始终拿到最新回调。
describe('popconfirm reuse / stale handler (issue #576)', () => {
  it('fires the latest @confirm handler after the host is reused in place', async () => {
    const confirmedIds: string[] = []

    // 用编译模板 + 无 key 的 v-for，让两页数据按位置复用同一个 Popconfirm 实例，
    // 这样 patchFlag 会命中 shouldUpdateComponent 的优化跳过分支。
    const Parent = defineComponent({
      components: { Popconfirm },
      props: {
        items: { type: Array as () => { id: string }[], default: () => [] },
      },
      setup() {
        const onConfirm = (id: string) => {
          confirmedIds.push(id)
        }
        return { onConfirm }
      },
      template: `
        <Popconfirm
          v-for="item in items"
          :open="true"
          title="Sure?"
          @confirm="() => onConfirm(item.id)"
        >
          <button class="trigger">Del</button>
        </Popconfirm>
      `,
    })

    const wrapper = mount(Parent, {
      props: { items: [{ id: 'page1-row' }] },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const clickOk = () => {
      const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
      const okButton = buttons[buttons.length - 1] as HTMLElement
      okButton.click()
    }

    // 第一页点击删除 → page1-row
    clickOk()
    await nextTick()
    expect(confirmedIds).toEqual(['page1-row'])

    // 翻到第二页：同一位置复用实例，只有 @confirm 回调变了
    await wrapper.setProps({ items: [{ id: 'page2-row' }] })
    await nextTick()
    await nextTick()

    // 第二页点击删除 → 必须是 page2-row，而非陈旧的 page1-row
    clickOk()
    await nextTick()
    expect(confirmedIds).toEqual(['page1-row', 'page2-row'])

    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('preserves the return value of @confirm for async loading', async () => {
    let resolveFn: (() => void) | undefined
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => {
      resolveFn = resolve
    }))

    const wrapper = mount(Popconfirm, {
      props: { title: 'Sure?', open: true, onConfirm },
      slots: { default: () => <button>Del</button> },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const buttons = document.querySelectorAll('.ant-popconfirm-buttons .ant-btn')
    const okButton = buttons[buttons.length - 1] as HTMLElement
    okButton.click()
    await nextTick()

    // 返回了 thenable → OK 按钮进入 loading 状态（说明返回值未被丢弃）
    expect(onConfirm).toHaveBeenCalled()
    expect(okButton.classList.contains('ant-btn-loading')).toBe(true)

    resolveFn?.()
    await nextTick()
    await nextTick()

    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
