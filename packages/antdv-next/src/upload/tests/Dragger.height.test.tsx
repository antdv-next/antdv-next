import { describe, expect, it } from 'vitest'
import Upload from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59319
describe('upload dragger height', () => {
  it('keeps the style height when the height prop is unset', () => {
    const wrapper = mount({
      render: () => <Upload.Dragger style={{ height: '200px' }} />,
    })
    expect(wrapper.find('.ant-upload-drag').attributes('style')).toContain('height: 200px')
  })

  it('applies the height prop as pixels', () => {
    const wrapper = mount({
      render: () => <Upload.Dragger height={180} />,
    })
    expect(wrapper.find('.ant-upload-drag').attributes('style')).toContain('height: 180px')
  })

  it('lets the height prop win over the style height', () => {
    const wrapper = mount({
      render: () => <Upload.Dragger style={{ height: '200px' }} height={180} />,
    })
    const style = wrapper.find('.ant-upload-drag').attributes('style')
    expect(style).toContain('height: 180px')
    expect(style).not.toContain('height: 200px')
  })
})
