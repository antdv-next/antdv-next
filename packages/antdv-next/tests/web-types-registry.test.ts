import { describe, expect, it } from 'vitest'
import { parseGlobalDts, Registry, toTagName } from '../scripts/web-types/registry'

describe('web-types registry', () => {
  it('parses GlobalComponents declarations', () => {
    const entries = parseGlobalDts(`
export {}

declare module 'vue' {
  export interface GlobalComponents {
    ATextarea: typeof import('antdv-next')['TextArea']
    AInputOtp: typeof import('antdv-next')['InputOTP']
    ARangePicker: typeof import('antdv-next')['DateRangePicker']
  }
}
`)
    expect(entries.map(entry => [entry.name, entry.exportName, entry.tagName])).toEqual([
      ['ATextarea', 'TextArea', 'a-textarea'],
      ['AInputOtp', 'InputOTP', 'a-input-otp'],
      ['ARangePicker', 'DateRangePicker', 'a-range-picker'],
    ])
  })

  it('derives tag names the same way Vue resolves them', () => {
    expect(toTagName('AFloatBackTop')).toBe('a-float-back-top')
    expect(toTagName('ATableSummaryCell')).toBe('a-table-summary-cell')
    expect(toTagName('AQrcode')).toBe('a-qrcode')
  })

  it('looks components up by any spelling', () => {
    const registry = Registry.fromNames(['ADatePicker', 'AQrcode'])
    expect(registry.lookup('date-picker')?.name).toBe('ADatePicker')
    expect(registry.lookup('DatePicker')?.name).toBe('ADatePicker')
    expect(registry.lookup('QR-Code')?.name).toBe('AQrcode')
    expect(registry.lookup('unknown')).toBeUndefined()
    expect(registry.get('ADatePicker')?.tagName).toBe('a-date-picker')
  })
})
