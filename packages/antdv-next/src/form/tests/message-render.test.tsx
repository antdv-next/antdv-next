import type { FormInstance } from '..'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('form rule message as render function', () => {
  it('renders the function result and updates reactively without re-validating', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ name?: string }>({ name: undefined })
    const locale = ref<'en' | 'zh'>('en')
    const message = vi.fn(() => (locale.value === 'zh' ? '请输入名称' : 'Name is required'))

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="name" rules={[{ required: true, message }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await formRef.value!.validateFields().catch(() => {})
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain').text()).toBe('Name is required')

    locale.value = 'zh'
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain').text()).toBe('请输入名称')
    expect(wrapper.find('.ant-form-item').classes()).toContain('ant-form-item-has-error')

    wrapper.unmount()
  })

  it('does not re-run validators when the message re-renders', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ name?: string }>({ name: undefined })
    const locale = ref<'en' | 'zh'>('en')
    const validator = vi.fn(() => Promise.reject(new Error('fail')))

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="name"
          rules={[{
            validator,
            message: () => (locale.value === 'zh' ? '校验失败' : 'Validation failed'),
          }]}
        >
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await formRef.value!.validateFields().catch(() => {})
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain').text()).toBe('Validation failed')
    expect(validator).toHaveBeenCalledTimes(1)

    locale.value = 'zh'
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain').text()).toBe('校验失败')
    expect(validator).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('supports returning a vnode from the message function', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ name?: string }>({ name: undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem
          name="name"
          rules={[{ required: true, message: () => h('span', { class: 'custom-message' }, 'Required') }]}
        >
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await formRef.value!.validateFields().catch(() => {})
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain .custom-message').text()).toBe('Required')

    wrapper.unmount()
  })

  it('keeps plain string and vnode messages working as before', async () => {
    const formRef = shallowRef<FormInstance>()
    const model = reactive<{ name?: string }>({ name: undefined })

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model}>
        <FormItem name="name" rules={[{ required: true, message: 'plain message' }]}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await formRef.value!.validateFields().catch(() => {})
    await flushForm()

    expect(wrapper.find('.ant-form-item-explain').text()).toBe('plain message')

    wrapper.unmount()
  })
})
