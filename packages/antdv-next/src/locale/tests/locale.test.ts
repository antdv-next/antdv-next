import { describe, expect, it } from 'vitest'
import csCZ from '../cs_CZ'
import esUS from '../es_US'
import koKR from '../ko_KR'
import neNP from '../ne_NP'
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

// https://github.com/ant-design/ant-design/pull/59499
describe('locale ne_NP', () => {
  it('uses the Nepali Pagination locale instead of en_US fallback', () => {
    expect(neNP.Pagination?.prev_page).toBe('अघिल्लो पृष्ठ')
    expect(neNP.Pagination?.next_page).toBe('अर्को पृष्ठ')
    expect(neNP.Pagination?.page_size).toBe('पृष्ठ आकार')
  })
})

// https://github.com/ant-design/ant-design/pull/59787
describe('locale cs_CZ', () => {
  it('uses improved Czech translations', () => {
    expect(csCZ.global?.clear).toBe('Vymazat')
    expect(csCZ.Transfer?.selectCurrent).toBe('Vybrat aktuální stránku')
    expect(csCZ.Transfer?.deselectAll).toBe('Zrušit výběr všech')
    expect((csCZ as any).Text?.collapse).toBe('Sbalit')

    expect(csCZ.Input?.otpCell).toBe('Znak ${index} z ${total}')
  })
})

// https://github.com/ant-design/ant-design/pull/59978
// https://github.com/ant-design/ant-design/pull/59982
describe('locale ko_KR', () => {
  it('provides Korean clear and OTP cell labels', () => {
    expect(koKR.global?.clear).toBe('지우기')
    expect(koKR.Input?.otpCell).toBe('${total}자 중 ${index}번째 문자')
  })

  it('uses natural word order and particles in form validation messages', () => {
    const messages = koKR.Form?.defaultValidateMessages as any
    expect(messages.required).toBe('${label}을(를) 입력해 주세요')
    expect(messages.types.email).toBe('${label}은(는) 유효한 ${type}이(가) 아닙니다')
    expect(messages.string.range).toBe('${label}은(는) ${min}~${max}자 사이여야 합니다')
    expect(messages.array.len).toBe('${label}은(는) ${len}개여야 합니다')
    expect(messages.pattern.mismatch).toBe('${label}이(가) ${pattern} 패턴과 일치하지 않습니다')
  })
})
