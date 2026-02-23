import type { CSSObject } from '@antdv-next/cssinjs'
import type { CSSProperties } from 'vue'

import type { DrawerToken } from '.'
import type { GenerateStyle } from '../../theme/internal'

type Direction = 'left' | 'right' | 'top' | 'bottom'

function getMoveTranslate(direction: Direction) {
  const value = '100%'
  return {
    left: `translateX(-${value})`,
    right: `translateX(${value})`,
    top: `translateY(-${value})`,
    bottom: `translateY(${value})`,
  }[direction]
}

function getEnterLeaveStyle(startStyle: CSSProperties, endStyle: CSSProperties) {
  return {
    '&-enter, &-appear': {
      ...startStyle,
      '&-active': endStyle,
    },
    '&-leave': {
      ...endStyle,
      '&-active': startStyle,
    },
  }
}

function getFadeStyle(from: number, duration: string) {
  return {
    '&-enter, &-appear, &-leave': {
      '&-start': {
        transition: 'none',
      },
      '&-active': {
        transition: `all ${duration}`,
      },
    },
    ...getEnterLeaveStyle(
      {
        opacity: from,
      },
      {
        opacity: 1,
      },
    ),
  }
}

function getPanelMotionStyles(direction: Direction, duration: string) {
  return [
    getFadeStyle(0.7, duration),
    getEnterLeaveStyle(
      {
        transform: getMoveTranslate(direction),
      },
      {
        transform: 'none',
      },
    ),
  ]
}

const genMotionStyle: GenerateStyle<DrawerToken, CSSObject> = (token) => {
  const { componentCls, motionDurationSlow } = token
  return {
    [componentCls]: {
      // ======================== Mask ========================
      [`${componentCls}-mask-motion`]: getFadeStyle(0, motionDurationSlow),
      // ======================= Panel ========================
      [`${componentCls}-panel-motion`]: ['left', 'right', 'top', 'bottom'].reduce(
        (obj, direction) => {
          return {
            ...obj,
            [`&-${direction}`]: getPanelMotionStyles(direction as Direction, motionDurationSlow),
          }
        },
        {},
      ),
    },
  }
}

export default genMotionStyle
