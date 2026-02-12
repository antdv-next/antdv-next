import type { CSSObject } from '@antdv-next/cssinjs'
import type { CascaderToken } from '.'

import type { GenerateStyle } from '../../theme/internal'
import { unit } from '@antdv-next/cssinjs'
import { prepareComponentToken } from '.'
import { genComponentStyleHook } from '../../theme/internal'
import getColumnsStyle from './columns'

// ============================== Panel ===============================
const genPanelStyle: GenerateStyle<CascaderToken> = (token: CascaderToken): CSSObject => {
  const { componentCls } = token

  return {
    [`${componentCls}-panel`]: [
      getColumnsStyle(token),
      {
        display: 'inline-flex',
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorSplit}`,
        borderRadius: token.borderRadiusLG,
        overflowX: 'auto',
        maxWidth: '100%',

        [`${componentCls}-menus`]: {
          alignItems: 'stretch',
        },
        [`${componentCls}-menu`]: {
          height: 'auto',
        },

        '&-empty': {
          padding: token.paddingXXS,
        },
      },
    ],
  }
}

// ============================== Export ==============================
export default genComponentStyleHook(['Cascader', 'Panel'], genPanelStyle, prepareComponentToken, {
  resetFont: false,
})
