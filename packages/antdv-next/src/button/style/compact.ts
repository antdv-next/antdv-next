// Style as inline component
import type { CSSObject } from '@antdv-next/cssinjs'

import type { GenerateStyle } from '../../theme/internal'
import type { ButtonToken } from './token'
import { genCompactItemStyle } from '../../style/compact-item'
import { genCompactItemVerticalStyle } from '../../style/compact-item-vertical'
import { genSubStyleComponent } from '../../theme/internal'
import { prepareComponentToken, prepareToken } from './token'

const genButtonCompactStyle: GenerateStyle<ButtonToken> = (token) => {
  const { componentCls, colorPrimaryHover, lineWidth, calc } = token
  const insetOffset = calc(lineWidth).mul(-1).equal()
  const getCompactBorderStyle = (vertical?: boolean) => {
    const selector = `${componentCls}-compact${vertical ? '-vertical' : ''}-item${componentCls}-primary:not([disabled])`
    return {
      [`${selector} + ${selector}::before`]: {
        position: 'absolute',
        top: vertical ? insetOffset : 0,
        insetInlineStart: vertical ? 0 : insetOffset,
        backgroundColor: colorPrimaryHover,
        content: '""',
        width: vertical ? '100%' : lineWidth,
        height: vertical ? lineWidth : '100%',
      } as CSSObject,
    }
  }
  // Special styles for Primary Button
  return {
    ...getCompactBorderStyle(),
    ...getCompactBorderStyle(true),
  }
}

// ============================== Export ==============================
export default genSubStyleComponent(
  ['Button', 'compact'],
  (token: any) => {
    const buttonToken = prepareToken(token)

    return [
      // Space Compact
      genCompactItemStyle(buttonToken),
      genCompactItemVerticalStyle(buttonToken),
      genButtonCompactStyle(buttonToken),
    ]
  },
  prepareComponentToken,
)
