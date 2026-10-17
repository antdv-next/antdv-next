import type { AllowClear } from '../hooks/useAllowClear'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import DatePicker from '../../date-picker'
import useAllowClear from '../hooks/useAllowClear'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59548
describe('useAllowClear', () => {
  it('preserves false for callers that check whether clearing is enabled', () => {
    expect(useAllowClear({ allowClear: undefined })).toBe(false)
    expect(useAllowClear({ allowClear: false })).toBe(false)

    const wrapper = mount(() => <DatePicker defaultValue={dayjs('2026-10-14')} allowClear={false} />)
    expect(wrapper.find('.ant-picker-clear').exists()).toBe(false)
  })

  it('inherits omitted fields and preserves explicit false, zero and empty labels', () => {
    const contextAllowClear = {
      clearIcon: 'Global icon',
      disabled: true,
      tabIndex: -1,
      label: 'Global clear',
    }
    const merge = (allowClear: AllowClear) => useAllowClear({ allowClear, contextAllowClear })

    expect(merge(true)).toEqual(contextAllowClear)
    expect(merge({ disabled: false, tabIndex: 0, label: '' })).toEqual({
      clearIcon: 'Global icon',
      disabled: false,
      tabIndex: 0,
      label: '',
    })
    expect(merge(false)).toBe(false)
  })

  it('uses default labels only when component and global labels are absent', () => {
    const merge = (allowClear: AllowClear, contextAllowClear?: AllowClear) =>
      useAllowClear({ allowClear, contextAllowClear, defaultLabel: 'Clear' })

    expect(merge(true)).toMatchObject({ label: 'Clear' })
    expect(merge(true, { label: 'Global clear' })).toMatchObject({ label: 'Global clear' })
    expect(merge({ label: 'Local clear' }, { label: 'Global clear' })).toMatchObject({ label: 'Local clear' })
  })

  it('preserves an explicit null clear icon', () => {
    expect(
      useAllowClear({
        allowClear: { clearIcon: null },
        contextAllowClear: { clearIcon: 'Global icon' },
      }),
    ).toMatchObject({ clearIcon: null })
  })

  it('resolves clearIcon from allowClear, then clearIcon, then the context', () => {
    expect(useAllowClear({
      allowClear: { clearIcon: 'allowClear' },
      clearIcon: 'prop',
      contextAllowClear: { clearIcon: 'context allowClear' },
      contextClearIcon: 'context prop',
    })).toMatchObject({ clearIcon: 'allowClear' })
    expect(useAllowClear({
      allowClear: true,
      clearIcon: 'prop',
      contextAllowClear: { clearIcon: 'context allowClear' },
      contextClearIcon: 'context prop',
    })).toMatchObject({ clearIcon: 'prop' })
    expect(useAllowClear({
      allowClear: true,
      contextAllowClear: { clearIcon: 'context allowClear' },
      contextClearIcon: 'context prop',
    })).toMatchObject({ clearIcon: 'context allowClear' })
    expect(useAllowClear({
      allowClear: true,
      contextClearIcon: 'context prop',
    })).toMatchObject({ clearIcon: 'context prop' })
  })
})
