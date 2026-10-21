import { describe, expect, it } from 'vitest'
import Form, { FormItem } from '..'
import { mount } from '/@tests/utils'

describe('form item label', () => {
  // https://github.com/ant-design/ant-design/pull/59599
  it('should only strip a trailing colon from string label', () => {
    const wrapper = mount(() => (
      <Form>
        <FormItem label="Name:" name="name"><input /></FormItem>
        <FormItem label="姓名：" name="cnName"><input /></FormItem>
        <FormItem label="A|B|" name="pipe"><input /></FormItem>
      </Form>
    ))
    const labels = wrapper.findAll('.ant-form-item-label label').map(label => label.text())
    expect(labels).toEqual(['Name', '姓名', 'A|B|'])
  })
})
