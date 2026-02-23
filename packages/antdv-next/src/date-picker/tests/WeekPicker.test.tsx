import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import DatePicker from '..'
import { mount, resetMockDate, setMockDate } from '/@tests/utils'

const { WeekPicker } = DatePicker

describe('week-picker', () => {
  beforeEach(() => {
    setMockDate()
  })

  afterEach(() => {
    resetMockDate()
  })

  it('should support style prop', () => {
    const wrapper = mount(WeekPicker, {
      props: {
        style: { width: '400px' },
      },
    })

    expect((wrapper.find('.ant-picker').element as HTMLElement).style.width).toBe('400px')
  })
})
