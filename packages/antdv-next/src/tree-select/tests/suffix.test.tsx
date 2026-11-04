import { describe, expect, it, vi } from 'vitest'
import TreeSelect from '..'
import { resetWarned } from '../../_util/warning'
import Form, { FormItem } from '../../form'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59185
describe('tree-select suffix', () => {
  const getSuffix = (wrapper: ReturnType<typeof mount>) => wrapper.find('.ant-select-suffix')

  it('should support suffix prop', () => {
    const wrapper = mount(() => <TreeSelect suffix="suffix" />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should support suffix slot', () => {
    const wrapper = mount(() => <TreeSelect v-slots={{ suffix: () => 'slot' }} />)
    expect(getSuffix(wrapper).text()).toBe('slot')
  })

  it('should prefer suffix prop over suffixIcon prop', () => {
    const wrapper = mount(() => <TreeSelect suffix="suffix" suffixIcon={null} />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
  })

  it('should keep showArrow compatibility with null suffix', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <TreeSelect showArrow suffix={null} />)
    expect(wrapper.find('.ant-select-show-arrow').exists()).toBe(true)
    errSpy.mockRestore()
  })

  it.each([
    ['custom', 'suffix'],
    ['null', null],
  ])('should keep feedback icon with %s suffix', (_, suffix) => {
    const wrapper = mount(() => (
      <Form>
        <FormItem hasFeedback validateStatus="error">
          <TreeSelect suffix={suffix} />
        </FormItem>
      </Form>
    ))
    expect(wrapper.find('.ant-form-item-feedback-icon-error').exists()).toBe(true)
  })

  it('should warn when using deprecated suffixIcon prop', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(() => <TreeSelect suffixIcon="suffix" />)
    expect(getSuffix(wrapper).text()).toBe('suffix')
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: TreeSelect] `suffixIcon` is deprecated. Please use `suffix` instead.',
    )
    errSpy.mockRestore()
  })
})
