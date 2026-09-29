import type { FormInstance } from '..'
import type { Rule } from '../types'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

function mountForm(rules: Rule[], initial: { name?: string } = {}) {
  const formRef = shallowRef<FormInstance>()
  const model = reactive<{ name?: string }>({ ...initial })
  const Demo = defineComponent(() => () => (
    <Form ref={formRef as any} model={model}>
      <FormItem name="name" rules={rules}>
        <input value={model.name} onInput={(e: Event) => (model.name = (e.target as HTMLInputElement).value)} />
      </FormItem>
    </Form>
  ))
  const wrapper = mount(Demo, { attachTo: document.body })
  return {
    wrapper,
    model,
    form: formRef,
    errors: () => wrapper.findAll('.ant-form-item-explain-error').map(n => n.text()),
  }
}

describe('form item stale validation', () => {
  it('drops a pending validation result after clearValidate', async () => {
    const { model, form, errors } = mountForm([{ required: true }], { name: 'a' })
    model.name = ''
    await nextTick()
    form.value!.clearValidate()
    await flushPromises()
    expect(errors()).toEqual([])
  })

  it('drops a pending validation result after resetFields', async () => {
    const { model, form, errors } = mountForm([{ required: true }], { name: 'a' })
    model.name = ''
    await nextTick()
    form.value!.resetFields()
    await flushPromises()
    expect(model.name).toBe('a')
    expect(errors()).toEqual([])
  })

  it('lets the latest validation win over an older slower one', async () => {
    const validator = (_: any, value: string) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => (value === 'bad' ? reject(new Error('bad value')) : resolve()), value === 'bad' ? 50 : 0)
      })
    const { model, errors } = mountForm([{ validator }], { name: '' })
    model.name = 'bad'
    await nextTick()
    model.name = 'ok'
    await new Promise(resolve => setTimeout(resolve, 100))
    await flushPromises()
    expect(errors()).toEqual([])
  })

  it('does not swallow the next change validation when resetFields leaves the value unchanged', async () => {
    const { model, form, errors } = mountForm([{ min: 3 }])
    form.value!.resetFields()
    await nextTick()
    model.name = 'ab'
    await flushPromises()
    expect(errors()).toHaveLength(1)
  })
})
