import type { FormInstance } from '..'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('form list mode', () => {
  it('supports list-style array path fields and submit values', async () => {
    const onFinish = vi.fn()

    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: [] })
      const rows = shallowRef<number[]>([])
      let uid = 0

      const addRow = () => {
        rows.value = [...rows.value, uid++]
        model.list.push('')
      }

      const removeRow = (index: number) => {
        rows.value = rows.value.filter((_, i) => i !== index)
        model.list.splice(index, 1)
      }

      return () => (
        <Form model={model} onFinish={onFinish}>
          {rows.value.map((rowKey, index) => (
            <div key={rowKey}>
              <FormItem name={['list', index]}>
                <input
                  class={`list-input-${index}`}
                  value={model.list[index] ?? ''}
                  onInput={(e: Event) => {
                    model.list[index] = (e.target as HTMLInputElement).value
                  }}
                />
              </FormItem>
              <button class={`remove-${index}`} type="button" onClick={() => removeRow(index)}>
                Remove
              </button>
            </div>
          ))}
          <button class="add" type="button" onClick={addRow}>
            Add
          </button>
          <button class="submit" type="submit">
            Submit
          </button>
        </Form>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    await wrapper.find('.add').trigger('click')
    await wrapper.find('.add').trigger('click')
    await wrapper.find('.add').trigger('click')
    await flushForm()

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(3)

    await inputs[0]!.setValue('input1')
    await inputs[1]!.setValue('input2')
    await inputs[2]!.setValue('input3')
    await flushForm()

    await wrapper.find('form').trigger('submit')
    await flushForm()
    expect(onFinish).toHaveBeenLastCalledWith({ list: ['input1', 'input2', 'input3'] })

    await wrapper.find('.remove-0').trigger('click')
    await flushForm()
    await wrapper.find('form').trigger('submit')
    await flushForm()

    expect(onFinish).toHaveBeenLastCalledWith({ list: ['input2', 'input3'] })

    wrapper.unmount()
  })

  it('updates list validation errors after removing rows', async () => {
    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: ['', ''] })
      const rows = shallowRef([0, 1])

      const removeRow = (index: number) => {
        rows.value = rows.value.filter((_, i) => i !== index)
        model.list.splice(index, 1)
      }

      return () => (
        <Form model={model}>
          {rows.value.map((rowKey, index) => (
            <div key={rowKey}>
              <FormItem name={['list', index]} rules={[{ required: true }]}>
                <input
                  class={`list-input-${rowKey}`}
                  value={model.list[index] ?? ''}
                  onInput={(e: Event) => {
                    model.list[index] = (e.target as HTMLInputElement).value
                  }}
                />
              </FormItem>
              <button class={`remove-${index}`} type="button" onClick={() => removeRow(index)}>
                Remove
              </button>
            </div>
          ))}
          <button class="submit" type="submit">
            Submit
          </button>
        </Form>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    await wrapper.find('form').trigger('submit')
    await flushForm()
    expect(wrapper.findAll('.ant-form-item-explain-error')).toHaveLength(2)

    await wrapper.find('.remove-0').trigger('click')
    await flushForm()
    await wrapper.find('form').trigger('submit')
    await flushForm()

    expect(wrapper.findAll('.ant-form-item-explain-error')).toHaveLength(1)

    wrapper.unmount()
  })

  it('updates list fields through form instance array path APIs', async () => {
    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: ['', ''] })
      const formRef = shallowRef<FormInstance>()

      return () => (
        <div>
          <Form ref={formRef} model={model}>
            {[0, 1].map(index => (
              <FormItem key={index} name={['list', index]}>
                <input
                  class={`list-input-${index}`}
                  value={model.list[index] ?? ''}
                  onInput={(e: Event) => {
                    model.list[index] = (e.target as HTMLInputElement).value
                  }}
                />
              </FormItem>
            ))}
          </Form>
          <button
            class="set-second"
            type="button"
            onClick={() => formRef.value?.setFieldValue(['list', 1], 'second')}
          >
            Set second
          </button>
        </div>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    await wrapper.find('.set-second').trigger('click')
    await flushForm()

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('second')

    wrapper.unmount()
  })

  it('supports validateFields and clearValidate on list item paths', async () => {
    const formRef = shallowRef<FormInstance>()

    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: [''] })

      return () => (
        <Form ref={formRef} model={model}>
          <FormItem name={['list', 0]} rules={[{ required: true }]}>
            <input
              value={model.list[0] ?? ''}
              onInput={(e: Event) => {
                model.list[0] = (e.target as HTMLInputElement).value
              }}
            />
          </FormItem>
        </Form>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    let errorInfo: any
    try {
      await formRef.value!.validateFields([['list', 0]])
    }
    catch (err) {
      errorInfo = err
    }

    expect(errorInfo?.errorFields?.[0]?.name).toEqual(['list', 0])
    expect(formRef.value!.getFieldError(['list', 0]).length).toBeGreaterThan(0)

    formRef.value!.clearValidate([['list', 0]])
    await flushForm()

    expect(formRef.value!.getFieldError(['list', 0])).toEqual([])

    wrapper.unmount()
  })

  it('supports resetFields for specific list item path', async () => {
    const formRef = shallowRef<FormInstance>()

    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: ['a', 'b'] })

      return () => (
        <Form ref={formRef} model={model}>
          {[0, 1].map(index => (
            <FormItem key={index} name={['list', index]}>
              <input
                class={`list-input-${index}`}
                value={model.list[index] ?? ''}
                onInput={(e: Event) => {
                  model.list[index] = (e.target as HTMLInputElement).value
                }}
              />
            </FormItem>
          ))}
        </Form>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    formRef.value!.setFieldValue(['list', 0], 'x')
    formRef.value!.setFieldValue(['list', 1], 'y')
    await flushForm()

    formRef.value!.resetFields([['list', 1]])
    await flushForm()

    const inputs = wrapper.findAll('input')
    expect((inputs[0]!.element as HTMLInputElement).value).toBe('x')
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('b')

    wrapper.unmount()
  })

  it('emits valuesChange and fieldsChange for list item path updates', async () => {
    const onValuesChange = vi.fn()
    const onFieldsChange = vi.fn()
    const formRef = shallowRef<FormInstance>()

    const Demo = defineComponent(() => {
      const model = reactive<{ list: string[] }>({ list: ['', ''] })

      return () => (
        <Form
          ref={formRef}
          model={model}
          onValuesChange={onValuesChange}
          onFieldsChange={onFieldsChange}
        >
          {[0, 1].map(index => (
            <FormItem key={index} name={['list', index]}>
              <input
                value={model.list[index] ?? ''}
                onInput={(e: Event) => {
                  model.list[index] = (e.target as HTMLInputElement).value
                }}
              />
            </FormItem>
          ))}
        </Form>
      )
    })

    const wrapper = mount(Demo, { attachTo: document.body })

    formRef.value!.setFieldValue(['list', 1], 'changed')
    await flushForm()

    expect(onValuesChange).toHaveBeenCalled()
    // @ts-expect-error test
    const [changedValues, allValues] = onValuesChange.mock.calls.at(-1)!
    expect(Array.isArray(changedValues.list)).toBe(true)
    expect(changedValues.list[1]).toBe('changed')
    expect(allValues.list).toEqual(['', 'changed'])

    expect(onFieldsChange).toHaveBeenCalled()
    // @ts-expect-error test
    const [changedFields] = onFieldsChange.mock.calls.at(-1)!
    expect(changedFields[0].name).toEqual(['list', 1])
    expect(changedFields[0].value).toBe('changed')

    wrapper.unmount()
  })
})
