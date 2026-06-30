import type { FormInstance } from '..'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('form item help={false}', () => {
  // https://github.com/ant-design/ant-design/issues/58557
  it('keeps error status while suppressing help text', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ test?: string }>({ test: undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="test" help={false} rules={[{ required: true, message: 'message' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await formRef.value!.validateFields().catch(() => {})
    await flushForm()

    expect(wrapper.find('.ant-form-item').classes()).toContain('ant-form-item-has-error')
    expect(wrapper.find('.ant-form-item-with-help').exists()).toBe(true)
    expect(wrapper.find('.ant-form-item-explain')?.text()).toBe('')

    wrapper.unmount()
  })
})
