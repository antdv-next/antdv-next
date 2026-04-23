import { describe, expect, it } from 'vitest'
import { getFieldId } from '../util'

describe('form util', () => {
  it('avoids generating field ids that shadow native form properties', () => {
    expect(getFieldId(['tagName'])).toBe('form_item_tagName')
    expect(getFieldId(['parentNode'])).toBe('form_item_parentNode')
    expect(getFieldId(['nextSibling'])).toBe('form_item_nextSibling')
  })
})
