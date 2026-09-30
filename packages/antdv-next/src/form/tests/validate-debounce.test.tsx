import type { FormInstance } from '..'
import type { Rule } from '../types'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function mountForm(options: { rules: Rule[], validateDebounce?: number, initial?: string }) {
  const formRef = shallowRef<FormInstance>()
  const model = reactive<{ name: string }>({ name: options.initial ?? '' })
  const Demo = defineComponent(() => () => (
    <Form ref={formRef as any} model={model}>
      <FormItem name="name" rules={options.rules} validateDebounce={options.validateDebounce}>
        <input
          class="name-input"
          value={model.name}
          onInput={(e: Event) => (model.name = (e.target as HTMLInputElement).value)}
        />
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

describe('form item validateDebounce', () => {
  it('postpones the change validation by validateDebounce', async () => {
    const { model, errors } = mountForm({ rules: [{ required: true }], validateDebounce: 60, initial: 'a' })

    model.name = ''
    await nextTick()
    await flushPromises()
    expect(errors()).toEqual([])

    await sleep(150)
    await flushPromises()
    expect(errors()).toHaveLength(1)
  })

  it('only validates the latest value when changes arrive inside the debounce window', async () => {
    const calls: string[] = []
    const validator = (_: any, value: string) => {
      calls.push(value ?? '')
      return Promise.resolve()
    }
    const { model, errors } = mountForm({ rules: [{ validator }], validateDebounce: 60 })

    model.name = 'a'
    await nextTick()
    model.name = 'ab'
    await nextTick()
    model.name = 'abc'
    await nextTick()
    expect(calls).toEqual([])

    await sleep(150)
    await flushPromises()
    expect(calls).toEqual(['abc'])
    expect(errors()).toEqual([])
  })

  it('still validates right away when validateDebounce is not set', async () => {
    const { model, errors } = mountForm({ rules: [{ required: true }], initial: 'a' })

    model.name = ''
    await nextTick()
    await flushPromises()
    expect(errors()).toHaveLength(1)
  })
})
