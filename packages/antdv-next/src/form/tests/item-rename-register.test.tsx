import type { FormInstance } from '..'
import { describe, expect, it } from 'vitest'
import { nextTick, reactive, ref } from 'vue'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

// FormItem 改名后需要用新 key 重新注册，否则旧 key 会被别的 FormItem 占用覆盖，
// 导致 validateFields / resetFields 漏掉该字段
describe('form item re-registers when renamed', () => {
  async function getErrorNames(formRef: { value?: FormInstance }) {
    try {
      await formRef.value!.validateFields()
      return []
    }
    catch (e: any) {
      return e.errorFields.map((f: any) => f.name.join('.')).sort()
    }
  }

  function mountList(list: { id: number }[]) {
    const formRef = ref<FormInstance>()
    const model = reactive({ users: list.map(() => '') })
    const items = ref(list)
    mount(() => (
      <Form ref={formRef} model={model}>
        {items.value.map((item, index) => (
          <FormItem key={item.id} name={['users', index]} rules={[{ required: true }]}>
            <input />
          </FormItem>
        ))}
      </Form>
    ))
    return { formRef, model, items }
  }

  it('keeps every item after removing and then adding list items', async () => {
    const { formRef, model, items } = mountList([{ id: 1 }, { id: 2 }])

    // 删除第一项：剩余项的 name 由 users.1 变为 users.0
    items.value = [{ id: 2 }]
    model.users = ['']
    await nextTick()

    // 新增一项：name 为 users.1，与剩余项改名前的 key 相同
    items.value = [{ id: 2 }, { id: 3 }]
    model.users = ['', '']
    await nextTick()

    expect(await getErrorNames(formRef)).toEqual(['users.0', 'users.1'])
  })

  it('keeps every item when two items swap names', async () => {
    const { formRef, model, items } = mountList([{ id: 1 }, { id: 2 }])

    items.value = [{ id: 2 }, { id: 1 }]
    model.users = ['', '']
    await nextTick()

    expect(await getErrorNames(formRef)).toEqual(['users.0', 'users.1'])
  })

  it('does not unregister the item that took over the key of an unmounted item', async () => {
    const { formRef, model, items } = mountList([{ id: 1 }, { id: 2 }, { id: 3 }])

    // 删除第一项：后两项同时改名，其中一项接手被卸载项的 key
    items.value = [{ id: 2 }, { id: 3 }]
    model.users = ['', '']
    await nextTick()

    expect(await getErrorNames(formRef)).toEqual(['users.0', 'users.1'])
  })
})
