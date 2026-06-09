import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Modal from '..'
import { mount } from '/@tests/utils'

// 与 Popconfirm 同源的「实例复用 + 仅事件回调变化」场景（issue #576 同类）。
// Modal 的 `@ok`/`@cancel` 经由稳定的 emit 包装派发（emit 在跳过更新时仍读取最新 vnode
// 上的监听器），因此本身不受该陈旧闭包影响。此用例用于锁定这一行为，防止回归。
describe('modal reuse / latest handler (issue #576 family)', () => {
  it('fires the latest @ok handler after the host is reused in place', async () => {
    const okIds: string[] = []

    const Parent = defineComponent({
      components: { Modal },
      props: {
        items: { type: Array as () => { id: string }[], default: () => [] },
      },
      setup() {
        const onOk = (id: string) => {
          okIds.push(id)
        }
        return { onOk }
      },
      template: `
        <Modal
          v-for="item in items"
          :open="true"
          :get-container="false"
          title="Sure?"
          @ok="() => onOk(item.id)"
        >
          content
        </Modal>
      `,
    })

    const wrapper = mount(Parent, {
      props: { items: [{ id: 'page1-row' }] },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const clickOk = () => {
      const okButton = document.querySelector(
        '.ant-modal-footer .ant-btn-primary',
      ) as HTMLElement | null
      okButton?.click()
    }

    clickOk()
    await nextTick()
    expect(okIds).toEqual(['page1-row'])

    await wrapper.setProps({ items: [{ id: 'page2-row' }] })
    await nextTick()
    await nextTick()

    clickOk()
    await nextTick()
    expect(okIds).toEqual(['page1-row', 'page2-row'])

    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
