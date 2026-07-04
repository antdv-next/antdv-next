import type { Locale } from '..'
import { describe, expect, it } from 'vitest'
import enUS from '../en_US'
import zhCN from '../zh_CN'

// https://github.com/ant-design/ant-design/pull/58575
describe('locale completeness', () => {
  const modules = import.meta.glob<Locale>('../*.ts', { eager: true, import: 'default' })
  const locales = Object.entries(modules).filter(
    ([, locale]) => locale && typeof locale.locale === 'string',
  )

  it('collects all locale files', () => {
    expect(locales.length).toBeGreaterThan(70)
  })

  it('every locale provides global.sortable', () => {
    const missing = locales
      .filter(([, locale]) => typeof locale.global?.sortable !== 'string')
      .map(([file]) => file)
    expect(missing).toEqual([])
  })

  it('base locales provide the newly added fields', () => {
    for (const locale of [zhCN, enUS]) {
      expect(typeof locale.Transfer?.deselectAll).toBe('string')
      expect(typeof locale.QRCode?.scanned).toBe('string')
      expect(typeof locale.ColorPicker?.presetEmpty).toBe('string')
      expect(typeof locale.Table?.filterCheckAll).toBe('string')
      expect(typeof (locale as any).Text?.collapse).toBe('string')
    }
  })
})
