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

function createTelForm(rule: Record<string, any>) {
  const formRef = shallowRef<FormInstance>()
  const model = reactive({ phone: '' })

  const Demo = defineComponent(() => {
    return () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="phone" label="Phone" rules={[rule]}>
          <input
            value={model.phone}
            onInput={(e: Event) => {
              model.phone = (e.target as HTMLInputElement).value
            }}
          />
        </FormItem>
      </Form>
    )
  })

  const wrapper = mount(Demo, { attachTo: document.body })
  return {
    wrapper,
    formRef,
    input: () => wrapper.find('input'),
  }
}

describe('form tel validation', () => {
  it('supports tel type for valid phone numbers', async () => {
    const { wrapper, formRef, input } = createTelForm({ type: 'tel' })

    await input().setValue('415-555-0132')
    await flushForm()

    await expect(formRef.value!.validateFields()).resolves.toEqual({ phone: '415-555-0132' })

    wrapper.unmount()
  })

  it('uses tel default type message for invalid phone numbers', async () => {
    const { wrapper, formRef, input } = createTelForm({ type: 'tel' })

    await input().setValue('123---456')
    await flushForm()

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{
        name: ['phone'],
        errors: [expect.stringContaining('valid tel')],
      }],
    })

    wrapper.unmount()
  })

  it('allows empty values for non-required tel rules', async () => {
    const { wrapper, formRef } = createTelForm({ type: 'tel' })

    await expect(formRef.value!.validateFields()).resolves.toEqual({ phone: '' })

    wrapper.unmount()
  })

  it('still uses required message for empty required tel rules', async () => {
    const { wrapper, formRef } = createTelForm({ type: 'tel', required: true })

    let errorInfo: any
    try {
      await formRef.value!.validateFields()
    }
    catch (error) {
      errorInfo = error
    }

    expect(errorInfo?.errorFields?.[0]?.name).toEqual(['phone'])
    expect(errorInfo?.errorFields?.[0]?.errors?.[0]).toContain('Phone')
    expect(errorInfo?.errorFields?.[0]?.errors?.[0]).not.toContain('valid tel')

    wrapper.unmount()
  })
})
