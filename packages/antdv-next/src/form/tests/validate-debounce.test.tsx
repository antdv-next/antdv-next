import type { FormInstance } from '..'
import type { Rule } from '../types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { enableAutoUnmount, flushPromises, mount } from '/@tests/utils'

enableAutoUnmount(afterEach)

function mountForm(options: { rules: Rule[], validateDebounce?: number, initial?: string }) {
  const formRef = shallowRef<FormInstance>()
  const model = reactive<{ name: string }>({ name: options.initial ?? '' })
  const visible = shallowRef(true)
  const onValidate = vi.fn()
  const Demo = defineComponent(() => () => (
    <Form ref={formRef as any} model={model} onValidate={onValidate}>
      {visible.value && (
        <FormItem name="name" rules={options.rules} validateDebounce={options.validateDebounce}>
          <input
            class="name-input"
            value={model.name}
            onInput={(e: Event) => (model.name = (e.target as HTMLInputElement).value)}
          />
        </FormItem>
      )}
    </Form>
  ))
  const wrapper = mount(Demo, { attachTo: document.body })
  return {
    wrapper,
    model,
    visible,
    onValidate,
    form: formRef,
    errors: () => wrapper.findAll('.ant-form-item-explain-error').map(n => n.text()),
  }
}

async function advance(ms: number) {
  await vi.advanceTimersByTimeAsync(ms)
  await flushPromises()
}

describe('form item validateDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('postpones the change validation by validateDebounce', async () => {
    const { model, errors } = mountForm({ rules: [{ required: true }], validateDebounce: 60, initial: 'a' })

    model.name = ''
    await nextTick()
    await advance(59)
    expect(errors()).toEqual([])

    await advance(1)
    expect(errors()).toHaveLength(1)
  })

  it('only validates the latest value when changes arrive inside the debounce window', async () => {
    const calls: string[] = []
    const validator = (_: any, value: string) => {
      calls.push(value ?? '')
      return Promise.resolve()
    }
    const { model, errors } = mountForm({ rules: [{ validator }], validateDebounce: 60 })
    const baseTimerCount = vi.getTimerCount()

    model.name = 'a'
    await nextTick()
    await advance(20)
    model.name = 'ab'
    await nextTick()
    await advance(20)
    model.name = 'abc'
    await nextTick()
    // superseded waits are released instead of left running
    expect(vi.getTimerCount()).toBe(baseTimerCount + 1)

    await advance(59)
    expect(calls).toEqual([])

    await advance(1)
    expect(calls).toEqual(['abc'])
    expect(errors()).toEqual([])
  })

  it('debounces blur validation as well', async () => {
    const { wrapper, errors } = mountForm({
      rules: [{ required: true, trigger: 'blur' }],
      validateDebounce: 60,
    })

    await wrapper.find('.name-input').trigger('blur')
    await advance(0)
    expect(errors()).toEqual([])

    await advance(60)
    expect(errors()).toHaveLength(1)
  })

  it('does not debounce validateFields', async () => {
    const { form, errors } = mountForm({ rules: [{ required: true }], validateDebounce: 60 })

    const result = form.value!.validateFields().catch(e => e)
    await advance(0)
    expect(errors()).toHaveLength(1)
    expect((await result).errorFields).toHaveLength(1)
  })

  it('drops a pending debounced validation after clearValidate', async () => {
    const { model, form, errors } = mountForm({ rules: [{ required: true }], validateDebounce: 60, initial: 'a' })

    model.name = ''
    await nextTick()
    form.value!.clearValidate()
    await advance(100)
    expect(errors()).toEqual([])
  })

  it('does not validate after the item is unmounted', async () => {
    const validator = vi.fn(() => Promise.resolve())
    const { model, visible, onValidate } = mountForm({ rules: [{ validator }], validateDebounce: 60 })

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    model.name = 'a'
    await nextTick()
    const debounceCall = setTimeoutSpy.mock.calls.findIndex(([, delay]) => delay === 60)
    const debounceTimer = setTimeoutSpy.mock.results[debounceCall]!.value
    visible.value = false
    await nextTick()
    // the pending wait is released on unmount instead of left running
    expect(clearTimeoutSpy).toHaveBeenCalledWith(debounceTimer)
    await advance(100)
    expect(validator).not.toHaveBeenCalled()
    expect(onValidate).not.toHaveBeenCalled()
  })

  it('still validates right away when validateDebounce is not set', async () => {
    const { model, errors } = mountForm({ rules: [{ required: true }], initial: 'a' })

    model.name = ''
    await nextTick()
    await flushPromises()
    expect(errors()).toHaveLength(1)
  })
})
