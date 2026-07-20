import type { FormInstance } from '..'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import Form, { FormItem } from '..'
import Input from '../../input'
import { mount } from '/@tests/utils'

describe('form getFieldInstance', () => {
  it('returns the rendered control for a native element', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })

    const wrapper = mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <input />
        </FormItem>
      </Form>
    ))
    await nextTick()

    const instance = formRef.value!.getFieldInstance('username')
    expect(instance).toBeTruthy()
    expect(instance).toBe(wrapper.find('input').element)
  })

  it('returns the component instance for antdv controls', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <Input v-model={[model.username, 'value']} />
        </FormItem>
      </Form>
    ))
    await nextTick()

    const instance = formRef.value!.getFieldInstance('username')
    expect(instance).toBeTruthy()
    expect(typeof instance.focus).toBe('function')
  })

  // The form name is not part of the lookup key — this used to be prefixed
  // through `getFieldId`, which made every lookup miss. See #663.
  it('works when the form declares a name', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })

    mount(() => (
      <Form ref={formRef} name="basic" model={model}>
        <FormItem name="username" label="Username">
          <input />
        </FormItem>
      </Form>
    ))
    await nextTick()

    expect(formRef.value!.getFieldInstance('username')).toBeTruthy()
  })

  it('supports nested name paths', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ profile: { nickname: '' } })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name={['profile', 'nickname']} label="Nickname">
          <input />
        </FormItem>
      </Form>
    ))
    await nextTick()

    expect(formRef.value!.getFieldInstance(['profile', 'nickname'])).toBeTruthy()
    expect(formRef.value!.getFieldInstance('missing')).toBeUndefined()
  })

  it('does not break a user supplied ref on the control', async () => {
    const formRef = ref<FormInstance>()
    const inputRef = ref<any>()
    const model = reactive({ username: '' })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <input ref={inputRef} />
        </FormItem>
      </Form>
    ))
    await nextTick()

    expect(inputRef.value).toBeTruthy()
    expect(formRef.value!.getFieldInstance('username')).toBe(inputRef.value)
  })

  it('releases the instance when the field unmounts', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })
    const visible = ref(true)

    mount(() => (
      <Form ref={formRef} model={model}>
        {visible.value
          ? (
              <FormItem name="username" label="Username">
                <input />
              </FormItem>
            )
          : null}
      </Form>
    ))
    await nextTick()
    expect(formRef.value!.getFieldInstance('username')).toBeTruthy()

    visible.value = false
    await nextTick()
    expect(formRef.value!.getFieldInstance('username')).toBeUndefined()
  })

  it('focusField prefers the control focus method', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })
    const focus = vi.fn()

    const CustomControl = defineComponent({
      setup(_, { expose }) {
        expose({ focus })
        return () => <input />
      },
    })

    mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <CustomControl />
        </FormItem>
      </Form>
    ))
    await nextTick()

    formRef.value!.focusField('username')
    expect(focus).toHaveBeenCalledTimes(1)
  })

  it('focusField falls back to the rendered DOM node', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: '' })

    const wrapper = mount(() => (
      <Form ref={formRef} model={model}>
        <FormItem name="username" label="Username">
          <input />
        </FormItem>
      </Form>
    ), { attachTo: document.body })
    await nextTick()

    formRef.value!.focusField('username')
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })
})
