import type { CSSObject } from '@antdv-next/cssinjs'
import type { GenerateStyle } from '../../theme/internal'

import type { TableToken } from './index'
import { unit } from '@antdv-next/cssinjs'

const genPaginationStyle: GenerateStyle<TableToken, CSSObject> = (token) => {
  const { componentCls, antCls, margin } = token
  return {
    [`${componentCls}-wrapper`]: {
      // ========================== Pagination ==========================
      [`${componentCls}-pagination${antCls}-pagination`]: {
        margin: `${unit(margin)} 0`,
      },

      [`${componentCls}-pagination`]: {
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: token.paddingXS,

        '> *': {
          flex: 'none',
        },
        '&-start': {
          justifyContent: 'flex-start',
        },

        '&-center': {
          justifyContent: 'center',
        },

        '&-end': {
          justifyContent: 'flex-end',
        },
      },
    },
  }
}

export default genPaginationStyle
