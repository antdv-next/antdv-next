import { describe, expect, it } from 'vitest'
import esUS from '../es_US'
import zhTW from '../zh_TW'

describe('locale es_US', () => {
  it('should extend es_ES and override locale codes for picker', () => {
    expect(esUS.locale).toBe('es-us')
    expect(esUS.global?.placeholder).toBe('Seleccione')
    expect(esUS.DatePicker?.lang.locale).toBe('en_US')
    expect(esUS.Calendar?.lang.locale).toBe('en_US')
    expect(esUS.Table?.filterTitle).toBe('Filtrar menú')
  })
})

describe('locale zh_TW', () => {
  it('uses Taiwan terminology for picker controls', () => {
    expect(zhTW.DatePicker?.lang.ok).toBe('確定')
    expect(zhTW.ColorPicker?.gradientColor).toBe('漸層色')
  })
})
