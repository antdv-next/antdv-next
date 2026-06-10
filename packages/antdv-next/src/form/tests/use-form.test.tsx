import type { FormInstance } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import Form, { FormItem, useForm, useFormInstance } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('form useForm hook', () => {
  let errSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) as any
  })

  afterEach(() => {
    errSpy.mockRestore()
  })

  it('is exposed as Form.useForm and Form.useFormInstance', () => {
    expect((Form as any).useForm).toBe(useForm)
    expect((Form as any).useFormInstance).toBe(useFormInstance)
  })

  it('binds explicitly via template function ref', async () => {
    let form!: ReturnType<typeof useForm>
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => {
      form = useForm()
      return () => (
        <Form ref={form as any} model={model}>
          <FormItem name="username" rules={[{ required: true, message: 'Username required' }]}>
            <input />
          </FormItem>
        </Form>
      )
    }), { attachTo: document.body })

    expect(form.getFieldsValue()).toEqual({ username: '' })
    await expect(form.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })
    expect(form.getFieldError('username')).toEqual(['Username required'])

    wrapper.unmount()
  })

  it('auto connects a single form via provide/inject', async () => {
    let form!: ReturnType<typeof useForm>
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => {
      form = useForm()
      return () => (
        <Form model={model}>
          <FormItem name="username" rules={[{ required: true, message: 'Username required' }]}>
            <input />
          </FormItem>
        </Form>
      )
    }), { attachTo: document.body })

    expect(form.getFieldsValue()).toEqual({ username: '' })
    await expect(form.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })
    form.resetFields()
    await flushForm()
    expect(form.getFieldError('username')).toEqual([])

    wrapper.unmount()
  })

  it('connects multiple forms by matching name', async () => {
    let loginForm!: ReturnType<typeof useForm>
    let profileForm!: ReturnType<typeof useForm>
    const loginModel = reactive({ username: '' })
    const profileModel = reactive({ nickname: 'foo' })

    const wrapper = mount(defineComponent(() => {
      loginForm = useForm('login')
      profileForm = useForm('profile')
      // Mount order is intentionally reversed against hook declaration order
      return () => (
        <div>
          <Form name="profile" model={profileModel}>
            <FormItem name="nickname">
              <input />
            </FormItem>
          </Form>
          <Form name="login" model={loginModel}>
            <FormItem name="username" rules={[{ required: true, message: 'Username required' }]}>
              <input />
            </FormItem>
          </Form>
        </div>
      )
    }), { attachTo: document.body })

    expect(loginForm.getFieldsValue()).toEqual({ username: '' })
    expect(profileForm.getFieldsValue()).toEqual({ nickname: 'foo' })
    await expect(loginForm.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: ['username'], errors: ['Username required'] }],
    })
    await expect(profileForm.validateFields()).resolves.toEqual({ nickname: 'foo' })

    wrapper.unmount()
  })

  it('connects unnamed instances by declaration order with a warning', async () => {
    let formA!: ReturnType<typeof useForm>
    let formB!: ReturnType<typeof useForm>
    const modelA = reactive({ a: '1' })
    const modelB = reactive({ b: '2' })

    const wrapper = mount(defineComponent(() => {
      formA = useForm()
      formB = useForm()
      return () => (
        <div>
          <Form model={modelA}>
            <FormItem name="a">
              <input />
            </FormItem>
          </Form>
          <Form model={modelB}>
            <FormItem name="b">
              <input />
            </FormItem>
          </Form>
        </div>
      )
    }), { attachTo: document.body })

    expect(formA.getFieldsValue()).toEqual({ a: '1' })
    expect(formB.getFieldsValue()).toEqual({ b: '2' })
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('Multiple unnamed `useForm` instances'))

    wrapper.unmount()
  })

  it('prefers explicit template ref and does not consume other entries', async () => {
    let formA!: ReturnType<typeof useForm>
    let formB!: ReturnType<typeof useForm>
    const modelA = reactive({ a: '1' })
    const modelB = reactive({ b: '2' })

    const wrapper = mount(defineComponent(() => {
      formA = useForm()
      formB = useForm()
      // The first mounted form is explicitly bound to `formB`; `formA` should
      // auto connect to the second form instead of being consumed by the first.
      return () => (
        <div>
          <Form ref={formB as any} model={modelB}>
            <FormItem name="b">
              <input />
            </FormItem>
          </Form>
          <Form model={modelA}>
            <FormItem name="a">
              <input />
            </FormItem>
          </Form>
        </div>
      )
    }), { attachTo: document.body })

    expect(formB.getFieldsValue()).toEqual({ b: '2' })
    expect(formA.getFieldsValue()).toEqual({ a: '1' })

    wrapper.unmount()
  })

  it('unbinds on unmount and rebinds on remount', async () => {
    let form!: ReturnType<typeof useForm>
    const visible = ref(true)
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => {
      form = useForm()
      return () => (visible.value
        ? (
            <Form model={model}>
              <FormItem name="username">
                <input />
              </FormItem>
            </Form>
          )
        : null)
    }), { attachTo: document.body })

    expect(form.getFieldsValue()).toEqual({ username: '' })

    visible.value = false
    await flushForm()
    errSpy.mockClear()
    expect(form.getFieldsValue()).toBeUndefined()
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('not connected to any Form'))

    visible.value = true
    await flushForm()
    expect(form.getFieldsValue()).toEqual({ username: '' })

    wrapper.unmount()
  })

  it('warns when instance is never connected', () => {
    let form!: ReturnType<typeof useForm>

    const wrapper = mount(defineComponent(() => {
      form = useForm()
      return () => <div />
    }))

    expect(form.getFieldsValue()).toBeUndefined()
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('not connected to any Form'))

    wrapper.unmount()
  })

  it('useFormInstance returns the closest form instance in children', async () => {
    let captured: FormInstance | undefined
    const model = reactive({ username: 'foo' })

    const Child = defineComponent(() => {
      captured = useFormInstance()
      return () => <div />
    })

    const wrapper = mount(defineComponent(() => () => (
      <Form model={model}>
        <FormItem name="username">
          <input />
        </FormItem>
        <Child />
      </Form>
    )), { attachTo: document.body })

    expect(captured).toBeTruthy()
    expect(captured!.getFieldsValue()).toEqual({ username: 'foo' })
    await expect(captured!.validateFields()).resolves.toEqual({ username: 'foo' })

    wrapper.unmount()
  })

  it('delegates instance methods through the proxy', async () => {
    let form!: ReturnType<typeof useForm>
    const model = reactive({ username: '' })

    const wrapper = mount(defineComponent(() => {
      form = useForm()
      return () => (
        <Form model={model}>
          <FormItem name="username" rules={[{ required: true, message: 'Username required' }]}>
            <input />
          </FormItem>
        </Form>
      )
    }), { attachTo: document.body })

    form.setFieldValue('username', 'bar')
    await flushForm()
    expect(model.username).toBe('bar')
    expect(form.getFieldValue('username')).toBe('bar')
    expect(form.isFieldTouched('username')).toBe(true)

    await expect(form.validateFields(['username'])).resolves.toEqual({ username: 'bar' })
    expect(form.nativeElement).toBeInstanceOf(HTMLFormElement)

    wrapper.unmount()
  })
})
