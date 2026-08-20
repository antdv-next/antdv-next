import { describe, expect, it } from 'vitest'
import { createCommentVNode, defineComponent, nextTick, ref } from 'vue'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

// https://github.com/antdv-next/antdv-next/issues/762
// FormItem 多子节点下，其中一个子节点带 v-if 时，v-if 切换导致所有子节点 setup 重建
describe('form item child remount (issue #762)', () => {
  it('keeps the control instance when a sibling v-if child toggles', async () => {
    let setupCount = 0
    const Child = defineComponent({
      setup() {
        setupCount++
        return () => <input class="child-input" />
      },
    })

    // 模拟 <div v-if="showSibling">：false 分支编译产物是注释占位节点
    const showSibling = ref(false)
    const wrapper = mount(() => (
      <Form model={{ id: '' }}>
        <FormItem name="id" label="id">
          <Child />
          {showSibling.value ? <div class="sibling">sibling</div> : createCommentVNode('v-if')}
        </FormItem>
      </Form>
    ))

    expect(setupCount).toBe(1)

    // 输入一些 DOM 状态，用于验证实例是否被保留
    const input = wrapper.find('.child-input')
    await input.setValue('hello')

    showSibling.value = true
    await nextTick()
    expect(wrapper.find('.sibling').exists()).toBe(true)
    // 子控件不应被卸载重建
    expect(setupCount).toBe(1)
    expect((wrapper.find('.child-input').element as HTMLInputElement).value).toBe('hello')

    showSibling.value = false
    await nextTick()
    expect(wrapper.find('.sibling').exists()).toBe(false)
    expect(setupCount).toBe(1)

    wrapper.unmount()
  })
})
