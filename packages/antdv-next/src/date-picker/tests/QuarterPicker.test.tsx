import { describe, expect, it, vi } from 'vitest'
import DatePicker from '..'
import { resetWarned } from '../../_util/warning'
import { mount } from '/@tests/utils'

const { QuarterPicker } = DatePicker

describe('quarter-picker', () => {
  it('should support style prop and warn legacy usage', () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(QuarterPicker, {
      props: {
        style: { width: '400px' },
      },
    })

    expect((wrapper.find('.ant-picker').element as HTMLElement).style.width).toBe('400px')
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: QuarterPicker] DatePicker.QuarterPicker is legacy usage. Please use DatePicker[picker=\'quarter\'] directly.',
      ),
    )

    errSpy.mockRestore()
  })
})
