import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Form, { FormItem } from '..'
import { flushPromises, mount } from '/@tests/utils'

async function flushForm() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

// https://github.com/ant-design/ant-design/pull/59289
describe('form numeric zero extra', () => {
  it('renders extra and wires aria-describedby when extra is 0', async () => {
    const wrapper = mount(defineComponent(() => () => (
      <Form>
        <FormItem name="field" extra={0}>
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    const extra = wrapper.find('.ant-form-item-extra')
    expect(extra.exists()).toBe(true)
    expect(extra.text()).toBe('0')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('field_extra')

    wrapper.unmount()
  })

  it('omits extra for non-renderable values', async () => {
    const wrapper = mount(defineComponent(() => () => (
      <Form>
        <FormItem name="field" extra="">
          <input />
        </FormItem>
      </Form>
    )), { attachTo: document.body })

    await flushForm()
    expect(wrapper.find('.ant-form-item-extra').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()

    wrapper.unmount()
  })
})
