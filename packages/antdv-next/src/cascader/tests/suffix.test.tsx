import { describe, expect, it, vi } from 'vitest'
import Cascader from '..'
import { resetWarned } from '../../_util/warning'
import ConfigProvider from '../../config-provider'
import Form, { FormItem } from '../../form'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59185
describe('cascader suffix', () => {
  const getSuffix = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-suffix')

  it('should support suffix prop', () => {
    const wrapper = mount(() => <Cascader suffix="suffix" />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should support suffix slot', () => {
    const wrapper = mount(() => <Cascader v-slots={{ suffix: () => 'slot' }} />)
    expect(getSuffix(wrapper).text()).toBe('slot')
  })

  it('should prefer suffix prop over suffixIcon prop', () => {
    const wrapper = mount(() => <Cascader suffix="suffix" suffixIcon={null} />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should support suffix in config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider cascader={{ suffix: 'suffix' }}>
        <Cascader />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should preserve suffixIcon config provider compatibility', () => {
    const wrapper = mount(() => (
      <ConfigProvider cascader={{ suffixIcon: 'legacy' }}>
        <Cascader />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('legacy')
  })

  it('should prefer suffix over suffixIcon in config provider', () => {
    const wrapper = mount(() => (
      <ConfigProvider cascader={{ suffix: 'suffix', suffixIcon: 'legacy' }}>
        <Cascader />
      </ConfigProvider>
    ))
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it.each([
    ['custom', 'suffix'],
    ['null', null],
  ])('should keep feedback icon with %s suffix', (_, suffix) => {
    const wrapper = mount(() => (
      <Form>
        <FormItem hasFeedback validateStatus="error">
          <Cascader suffix={suffix} />
        </FormItem>
      </Form>
    ))
    expect(wrapper.find('.ant-form-item-feedback-icon-error').exists()).toBe(true)
  })

  it('should warn when using deprecated suffixIcon prop', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <Cascader suffixIcon="suffix" />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Cascader] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    errSpy.mockRestore()
  })
})
