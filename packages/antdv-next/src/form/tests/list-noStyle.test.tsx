import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, shallowRef } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('form list noStyle', () => {
  it('cleans nested noStyle errors when list row indexes shift', async () => {
    const Demo = defineComponent(() => {
      const model = reactive<{ users: Array<{ first: string }> }>({
        users: [{ first: '' }, { first: '' }],
      })
      const rows = shallowRef([0, 1])

      const removeRow = (index: number) => {
        rows.value = rows.value.filter((_, i) => i !== index)
        model.users.splice(index, 1)
      }

      return () => (
        <Form model={model}>
          {rows.value.map((rowKey, index) => (
            <div key={rowKey}>
              <FormItem>
                <FormItem noStyle name={['users', index, 'first']} rules={[{ required: true }]}>
                  <input
                    class={`user-input-${rowKey}`}
                    value={model.users[index]?.first ?? ''}
                    onInput={(e: Event) => {
                      if (!model.users[index]) {
                        model.users[index] = { first: '' }
                      }
                      model.users[index]!.first = (e.target as HTMLInputElement).value
                    }}
                  />
                </FormItem>
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
    // Error should remain visible immediately after index shift without waiting for re-validate.
    expect(wrapper.findAll('.ant-form-item-explain-error')).toHaveLength(1)

    await wrapper.find('form').trigger('submit')
    await flushForm()

    expect(wrapper.findAll('.ant-form-item-explain-error')).toHaveLength(1)
    expect(wrapper.find('.ant-form-item-explain-error').text()).toContain('users.0.first')

    wrapper.unmount()
  })
})
