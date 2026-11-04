import { describe, expect, it, vi } from 'vitest'
import AutoComplete from '..'
import { resetWarned } from '../../_util/warning'
import Form, { FormItem } from '../../form'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59185
describe('auto-complete suffix', () => {
  const getSuffix = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-suffix')

  it('should not warn when rendering the internal suffix prop', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <AutoComplete />)
    expect(errSpy).not.toHaveBeenCalledWith(
      'Warning: [antd: AutoComplete] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    expect(errSpy).not.toHaveBeenCalledWith(
      'Warning: [antd: Select] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    expect(getSuffix(wrapper).exists()).toBe(false)
    errSpy.mockRestore()
  })

  it('should support deprecated suffixIcon prop', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <AutoComplete suffixIcon="foobar" />)
    expect(getSuffix(wrapper).text()).toBe('foobar')
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: AutoComplete] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    errSpy.mockRestore()
  })

  it('should support suffix prop', () => {
    const wrapper = mount(() => <AutoComplete suffix="suffix" />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should support suffix slot', () => {
    const wrapper = mount(() => <AutoComplete v-slots={{ suffix: () => 'slot' }} />)
    expect(getSuffix(wrapper).text()).toBe('slot')
  })

  it('should prefer suffix prop over suffixIcon prop', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <AutoComplete suffix="suffix" suffixIcon={null} />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
    errSpy.mockRestore()
  })

  it('should keep form feedback icon', () => {
    const wrapper = mount(() => (
      <Form>
        <FormItem hasFeedback validateStatus="error">
          <AutoComplete />
        </FormItem>
      </Form>
    ))
    expect(wrapper.find('.ant-form-item-feedback-icon-error').exists()).toBe(true)
  })
})
