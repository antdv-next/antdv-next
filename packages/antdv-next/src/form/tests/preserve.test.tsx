import type { FormInstance } from '..'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

function mountForm(options?: { preserve?: boolean, clearOnDestroy?: boolean }) {
  const formRef = ref<FormInstance>()
  const model = reactive({ username: 'foo', nested: { value: 'bar' }, other: 'baz' })
  const visible = ref(true)
  const nestedVisible = ref(true)

  const wrapper = mount(defineComponent(() => () => (
    <Form
      ref={formRef as any}
      model={model}
      preserve={options?.preserve}
      clearOnDestroy={options?.clearOnDestroy}
    >
      {visible.value
        ? (
            <FormItem name="username">
              <input />
            </FormItem>
          )
        : null}
      {nestedVisible.value
        ? (
            <FormItem name={['nested', 'value']}>
              <input />
            </FormItem>
          )
        : null}
      <FormItem name="other">
        <input />
      </FormItem>
    </Form>
  )), { attachTo: document.body })

  return { wrapper, formRef, model, visible, nestedVisible }
}

describe('form preserve', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('removes the value when a field with preserve=false unmounts', async () => {
    const { wrapper, formRef, model, visible } = mountForm({ preserve: false })

    visible.value = false
    await flushForm()

    expect(model.username).toBeUndefined()
    expect(formRef.value?.getFieldsValue(true)).toEqual({
      nested: { value: 'bar' },
      other: 'baz',
    })

    wrapper.unmount()
  })

  it('keeps the value and exposes it through getFieldsValue(true) when preserve=true', async () => {
    const { wrapper, formRef, model, visible } = mountForm({ preserve: true })

    visible.value = false
    await flushForm()

    expect(model.username).toBe('foo')
    expect(formRef.value?.getFieldsValue()).toEqual({
      nested: { value: 'bar' },
      other: 'baz',
    })
    expect(formRef.value?.getFieldsValue(true)).toEqual({
      username: 'foo',
      nested: { value: 'bar' },
      other: 'baz',
    })

    wrapper.unmount()
  })

  it('lets FormItem preserve override the Form-level preserve', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ keep: 'keep', drop: 'drop' })
    const hideKeep = ref(true)
    const hideDrop = ref(true)

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model} preserve={false}>
        {hideKeep.value
          ? (
              <FormItem name="keep" preserve>
                <input />
              </FormItem>
            )
          : null}
        {hideDrop.value
          ? (
              <FormItem name="drop">
                <input />
              </FormItem>
            )
          : null}
      </Form>
    )), { attachTo: document.body })

    hideKeep.value = false
    hideDrop.value = false
    await flushForm()

    expect(model.keep).toBe('keep')
    expect(model.drop).toBeUndefined()
    expect(formRef.value?.getFieldsValue(true)).toEqual({ keep: 'keep' })

    wrapper.unmount()
  })

  it('lets FormItem preserve=false override the Form-level preserve=true', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ drop: 'drop' })
    const visible = ref(true)

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model} preserve>
        {visible.value
          ? (
              <FormItem name="drop" preserve={false}>
                <input />
              </FormItem>
            )
          : null}
      </Form>
    )), { attachTo: document.body })

    visible.value = false
    await flushForm()

    expect(model.drop).toBeUndefined()
    expect(formRef.value?.getFieldsValue(true)).toEqual({})

    wrapper.unmount()
  })
  it('removes values for nested fields that are not preserved', async () => {
    const { wrapper, formRef, model, nestedVisible } = mountForm({ preserve: false })

    nestedVisible.value = false
    await flushForm()

    expect(model.nested.value).toBeUndefined()
    expect(formRef.value?.getFieldsValue(true)).toEqual({
      username: 'foo',
      nested: {},
      other: 'baz',
    })

    wrapper.unmount()
  })

  it('clears model values on unmount when clearOnDestroy is true', async () => {
    const { wrapper, model } = mountForm({ clearOnDestroy: true })

    wrapper.unmount()
    await flushForm()

    expect(model).toEqual({})
  })

  it('does not remove a value while another field still owns the same name', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: 'foo' })
    const hideFirst = ref(true)

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model} preserve={false}>
        {hideFirst.value
          ? (
              <FormItem name="username">
                <input />
              </FormItem>
            )
          : null}
        <FormItem name="username">
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    hideFirst.value = false
    await flushForm()

    expect(model.username).toBe('foo')
    expect(formRef.value?.getFieldsValue(true)).toEqual({ username: 'foo' })

    wrapper.unmount()
  })

  it('does not clear values when FormItem unmounts but Form stays mounted', async () => {
    const formRef = ref<FormInstance>()
    const model = reactive({ username: 'foo' })
    const visible = ref(true)

    const wrapper = mount(defineComponent(() => () => (
      <Form ref={formRef as any} model={model} clearOnDestroy>
        {visible.value
          ? (
              <FormItem name="username">
                <input />
              </FormItem>
            )
          : null}
      </Form>
    )), { attachTo: document.body })

    visible.value = false
    await flushForm()

    expect(formRef.value?.getFieldsValue(true)).toEqual({ username: 'foo' })

    wrapper.unmount()
  })

  it('keeps model values on unmount when clearOnDestroy is false', async () => {
    const { wrapper, model } = mountForm({ clearOnDestroy: false })

    wrapper.unmount()
    await flushForm()

    expect(model).toEqual({ username: 'foo', nested: { value: 'bar' }, other: 'baz' })
  })
})
