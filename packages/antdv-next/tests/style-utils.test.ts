import { describe, expect, it } from 'vitest'
import { genCalc } from '@antdv-next/cssinjs'

import { genCompactItemStyle } from '../src/style/compact-item'
import getArrowStyle, { getArrowOffsetToken } from '../src/style/placementArrow'
import { genRoundedArrow, getArrowToken } from '../src/style/roundedArrow'

const calc = genCalc('js', new Set())

const mockToken = {
  componentCls: '.ant-btn',
  antCls: '.ant',
  lineWidth: 1,
  colorText: '#000000',
  fontSize: 14,
  lineHeight: 1.57,
  motionDurationMid: '0.3s',
  motionDurationSlow: '0.3s',
  motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  sizePopupArrow: 16,
  borderRadiusXS: 2,
  borderRadiusOuter: 4,
  boxShadowPopoverArrow: '0 0 4px rgba(0,0,0,0.2)',
  calc,
} as any

describe('style helpers', () => {
  it('generates compact item style buckets', () => {
    const style = genCompactItemStyle(mockToken)
    expect(style['.ant-btn-compact']).toBeTruthy()
  })

  it('generates arrow styles with rounded arrow helpers', () => {
    const arrowToken = {
      ...mockToken,
      ...getArrowToken(mockToken),
      ...getArrowOffsetToken({ contentRadius: mockToken.borderRadiusOuter }),
    }
    const style = getArrowStyle(arrowToken as any, '#ffffff')
    const arrowCls = style[mockToken.componentCls] as Record<string, any>
    expect(arrowCls).toBeTruthy()

    const rounded = genRoundedArrow(arrowToken as any, '#ffffff', '0 0 4px rgba(0,0,0,0.2)')
    expect(rounded['&::before']).toBeDefined()
  })
})
