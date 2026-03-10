import type { FormInstance } from '..'
import type { Rule } from '../types'
import VcSelect from '@v-c/select'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import Select from '../../select'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

function createInputForm(options: {
  rules?: Rule[]
  trigger?: 'change' | 'blur' | 'focus' | ('change' | 'blur' | 'focus')[]
  validateTrigger?: 'change' | 'blur' | 'focus' | ('change' | 'blur' | 'focus')[] | false
}) {
  const formRef = shallowRef<FormInstance>()
  const model = reactive({ username: '' })

  const Demo = defineComponent(() => {
    return () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="username"
          rules={options.rules}
          trigger={options.trigger as any}
          validateTrigger={options.validateTrigger as any}
        >
          <input
            class="username-input"
            value={model.username}
            onInput={(e: Event) => {
              model.username = (e.target as HTMLInputElement).value
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

async function makeFieldEmpty(wrapper: ReturnType<typeof mount>) {
  const input = wrapper.find('input')
  await input.setValue('filled')
  await flushForm()
  await input.setValue('')
  await flushForm()
}

async function selectFirstOption() {
  await nextTick()
  const option = document.querySelector('.ant-select-item-option') as HTMLElement | null
  if (!option) {
    throw new Error('select option not found')
  }
  option.click()
  await flushForm()
}

async function selectOptionByIndex(index: number) {
  await nextTick()
  const options = document.querySelectorAll('.ant-select-item-option')
  const option = options[index] as HTMLElement | undefined
  if (!option) {
    throw new Error(`select option at index ${index} not found`)
  }
  option.click()
  await flushForm()
}

describe('form validate trigger', () => {
  it('falls back to change when neither field nor rule config validateTrigger', async () => {
    const { wrapper, formRef } = createInputForm({
      rules: [{ required: true, message: 'Username required' }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('validates rule.validateTrigger on blur only', async () => {
    const { wrapper, formRef, input } = createInputForm({
      rules: [{ required: true, message: 'Username required', validateTrigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('does not clear rule.validateTrigger blur errors on change when field validateTrigger is not configured', async () => {
    const { wrapper, formRef, input } = createInputForm({
      rules: [{ required: true, message: 'Username required', validateTrigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    await input().setValue('filled')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    wrapper.unmount()
  })

  it('validates rule.trigger on blur only', async () => {
    const { wrapper, formRef, input } = createInputForm({
      rules: [{ required: true, message: 'Username required', trigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('does not clear rule.trigger blur errors on change when field validateTrigger is not configured', async () => {
    const { wrapper, formRef, input } = createInputForm({
      rules: [{ required: true, message: 'Username required', trigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    await input().setValue('filled')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    wrapper.unmount()
  })

  it('supports rule.validateTrigger arrays', async () => {
    const { wrapper, formRef } = createInputForm({
      rules: [{ required: true, message: 'Username required', validateTrigger: ['change', 'blur'] }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('supports rule.trigger arrays', async () => {
    const { wrapper, formRef } = createInputForm({
      rules: [{ required: true, message: 'Username required', trigger: ['change', 'blur'] }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('prefers rule.validateTrigger over rule.trigger', async () => {
    const { wrapper, formRef, input } = createInputForm({
      rules: [{
        required: true,
        message: 'Username required',
        trigger: 'change',
        validateTrigger: 'blur',
      }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('supports field trigger as validate alias', async () => {
    const { wrapper, formRef, input } = createInputForm({
      trigger: 'blur',
      rules: [{ required: true, message: 'Username required' }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('supports field trigger arrays', async () => {
    const { wrapper, formRef, input } = createInputForm({
      trigger: ['focus', 'blur'],
      rules: [{ required: true, message: 'Username required' }],
    })

    await input().trigger('focus')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    formRef.value!.clearValidate(['username'])
    await flushForm()

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('prefers field validateTrigger over field trigger', async () => {
    const { wrapper, formRef, input } = createInputForm({
      trigger: 'change',
      validateTrigger: 'blur',
      rules: [{ required: true, message: 'Username required' }],
    })

    await makeFieldEmpty(wrapper)
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('does not validate on events when field validateTrigger is false', async () => {
    const { wrapper, formRef, input } = createInputForm({
      validateTrigger: false,
      rules: [{ required: true, message: 'Username required' }],
    })

    await makeFieldEmpty(wrapper)
    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })

    wrapper.unmount()
  })

  it('honors validateTrigger false before rule.validateTrigger checks', async () => {
    const { wrapper, formRef, input } = createInputForm({
      validateTrigger: false,
      rules: [{ required: true, message: 'Username required', validateTrigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })

    wrapper.unmount()
  })

  it('honors validateTrigger false before rule.trigger checks', async () => {
    const { wrapper, formRef, input } = createInputForm({
      validateTrigger: false,
      rules: [{ required: true, message: 'Username required', trigger: 'blur' }],
    })

    await makeFieldEmpty(wrapper)
    await input().trigger('blur')
    await flushForm()
    expect(formRef.value!.getFieldError('username')).toEqual([])

    await expect(formRef.value!.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })

    wrapper.unmount()
  })

  it('validates all rules on submit regardless of rule.validateTrigger', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ gender: undefined as number | undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{
          gender: [{ required: true, message: 'Gender required', validateTrigger: 'change' }],
        }}
      >
        <FormItem name="gender">
          <Select
            v-model:value={model.gender}
            open
            options={[
              { label: 'male', value: 1 },
              { label: 'female', value: 2 },
            ]}
          />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await selectFirstOption()
    await expect(formRef.value!.validateFields()).resolves.toEqual({ gender: 1 })

    wrapper.unmount()
  })

  it('validates all rules on submit regardless of rule.trigger', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ gender: undefined as number | undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form
        ref={formRef as any}
        model={model}
        rules={{
          gender: [{ required: true, message: 'Gender required', trigger: 'change' }],
        }}
      >
        <FormItem name="gender">
          <Select
            v-model:value={model.gender}
            open
            options={[
              { label: 'male', value: 1 },
              { label: 'female', value: 2 },
            ]}
          />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await selectFirstOption()
    await expect(formRef.value!.validateFields()).resolves.toEqual({ gender: 1 })

    wrapper.unmount()
  })

  it('does not validate select value changes when field validateTrigger is blur', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ gender: undefined as number | undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="gender"
          validateTrigger="blur"
          rules={[{
            validator: (_, value) => {
              if (value === 2) {
                return Promise.reject(new Error('Invalid gender'))
              }
              return Promise.resolve()
            },
          }]}
        >
          <Select
            v-model:value={model.gender}
            open
            options={[
              { label: 'male', value: 1 },
              { label: 'female', value: 2 },
            ]}
          />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await selectOptionByIndex(1)
    expect(formRef.value!.getFieldError('gender')).toEqual([])

    const vcSelect = wrapper.findComponent(VcSelect as any)
    ;(vcSelect.vm as any).$props.onBlur?.(new FocusEvent('blur'))
    await flushForm()
    expect(formRef.value!.getFieldError('gender')).toEqual(['Invalid gender'])

    wrapper.unmount()
  })

  it('does not validate select value changes when field validateTrigger is focus', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive({ gender: undefined as number | undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="gender"
          validateTrigger="focus"
          rules={[{
            validator: (_, value) => {
              if (value === 2) {
                return Promise.reject(new Error('Invalid gender'))
              }
              return Promise.resolve()
            },
          }]}
        >
          <Select
            v-model:value={model.gender}
            open
            options={[
              { label: 'male', value: 1 },
              { label: 'female', value: 2 },
            ]}
          />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await selectOptionByIndex(1)
    expect(formRef.value!.getFieldError('gender')).toEqual([])

    const vcSelect = wrapper.findComponent(VcSelect as any)
    ;(vcSelect.vm as any).$props.onFocus?.(new FocusEvent('focus'))
    await flushForm()
    expect(formRef.value!.getFieldError('gender')).toEqual(['Invalid gender'])

    wrapper.unmount()
  })
})
