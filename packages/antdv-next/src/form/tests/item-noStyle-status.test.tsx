import type { ValidateStatus } from '../FormItem'
import type { Rule } from '../types'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import Form, { FormItem } from '..'
import Input from '../../input'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

function createNoStyleForm(options: {
  parentStatus: ValidateStatus
  hasFeedback?: boolean
  rules?: Rule[]
}) {
  const model = reactive({ phone: '' })
  const Demo = defineComponent(() => () => (
    <Form model={model}>
      <FormItem validateStatus={options.parentStatus} hasFeedback={options.hasFeedback}>
        <FormItem name="phone" noStyle hasFeedback={options.hasFeedback} rules={options.rules}>
          <Input
            value={model.phone}
            onUpdate:value={(v: string) => {
              model.phone = v
            }}
          />
        </FormItem>
      </FormItem>
    </Form>
  ))
  const wrapper = mount(Demo, { attachTo: document.body })
  const changeValue = async (value: string) => {
    await wrapper.find('input').setValue(value)
    await flushForm()
  }
  return { wrapper, changeValue }
}

// https://github.com/ant-design/ant-design/issues/59706
describe('form item noStyle status', () => {
  it.each([
    ['error', 'error', false],
    ['error with feedback', 'error', true],
    ['warning', 'warning', false],
    ['validating', 'validating', false],
  ] as const)(
    'keeps the parent %s status after being touched',
    async (_, status, hasFeedback) => {
      const { wrapper, changeValue } = createNoStyleForm({ parentStatus: status, hasFeedback })

      await changeValue('123')

      expect(wrapper.find(`.ant-input-status-${status}`).exists()).toBe(true)
      expect(wrapper.find('.ant-input-status-success').exists()).toBe(false)
      expect(wrapper.find('.ant-form-item-feedback-icon-success').exists()).toBe(false)
      wrapper.unmount()
    },
  )

  it('keeps the parent success feedback with hasFeedback after being touched', async () => {
    const { wrapper, changeValue } = createNoStyleForm({ parentStatus: 'success', hasFeedback: true })

    await changeValue('123')

    expect(wrapper.find('.ant-form-item-feedback-icon-success').exists()).toBe(true)
    wrapper.unmount()
  })

  it.each<[string, ValidateStatus, Rule[], string]>([
    ['error', 'warning', [{ required: true }], ''],
    ['warning', 'error', [{ len: 3, warningOnly: true }], 'Nanjing'],
    ['validating', 'error', [{ validator: () => new Promise<void>(() => {}) }], 'Nanjing'],
  ])(
    'keeps its own %s status over the parent %s status',
    async (status, parentStatus, rules, value) => {
      const { wrapper, changeValue } = createNoStyleForm({ parentStatus, rules })

      await changeValue('Shanghai')
      await changeValue(value)

      expect(wrapper.find(`.ant-input-status-${status}`).exists()).toBe(true)
      expect(wrapper.find(`.ant-input-status-${parentStatus}`).exists()).toBe(false)
      wrapper.unmount()
    },
  )
})
