import { describe, expect, it, vi } from 'vitest'
import ColorPicker from '../ColorPicker'
import { mount } from '/@tests/utils'

describe('color-picker attrs passthrough', () => {
  it('should pass attrs to the trigger', () => {
    const wrapper = mount(ColorPicker, {
      attrs: {
        'data-probe': 'yes',
        class: 'probe-class',
        style: { color: 'red' },
      },
    })
    const trigger = wrapper.find('.ant-color-picker-trigger')
    expect(trigger.attributes('data-probe')).toBe('yes')
    expect(trigger.classes()).toContain('probe-class')
    expect(trigger.attributes('style')).toContain('color: red')
  })

  it('should fire undeclared click once when trigger clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ColorPicker, { attrs: { onClick } })
    await wrapper.find('.ant-color-picker-trigger').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
