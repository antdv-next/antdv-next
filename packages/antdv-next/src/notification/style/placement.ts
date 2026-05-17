import type { CSSObject } from '@antdv-next/cssinjs'
import type { NotificationToken } from '.'

import type { GenerateStyle } from '../../theme/internal'
import type { NotificationPlacement } from '../interface'
import { unit } from '@antdv-next/cssinjs'
import { NotificationPlacements } from '../interface'

type VerticalPlacement = 'top' | 'bottom'
type HorizontalPlacement = 'left' | 'right'

interface PlacementOffset {
  blockEnd: VerticalPlacement
  inlineEnd: HorizontalPlacement
}
interface PlacementMotionOffset {
  x?: string
  y?: string
}

interface PlacementStyleConfig {
  placement: NotificationPlacement
  vertical: VerticalPlacement
  blockEnd: VerticalPlacement
  horizontal: HorizontalPlacement
  inlineEnd: HorizontalPlacement
  motionOffset: PlacementMotionOffset
  baseMotionOffset?: PlacementMotionOffset
  isCenterPlacement: boolean
}

const notificationMarginEdgeVar = '--notification-margin-edge'

// ============================== Shared ==============================

/** Resolve the opposite block and inline edges for a placement. */
function getPlacementOffset(vertical: VerticalPlacement, horizontal: HorizontalPlacement): PlacementOffset {
  return {
    blockEnd: vertical === 'top' ? 'bottom' : 'top',
    inlineEnd: horizontal === 'left' ? 'right' : 'left',
  }
}

/** Convert placement offsets into the transform used by notice motion. */
function getMotionTransform(motionOffset?: PlacementMotionOffset) {
  const x = motionOffset?.x ?? '0'
  const y = motionOffset?.y ?? '0'

  return `translate3d(${x}, ${y}, 0) scale(var(--notification-scale, 1))`
}

/** Build the placement metadata used by position and motion styles. */
function getPlacementStyleConfig(placement: NotificationPlacement, motionOffset: string): PlacementStyleConfig {
  const vertical = placement.startsWith('bottom') ? 'bottom' : 'top'
  const horizontal = placement.endsWith('Right') ? 'right' : 'left'
  const { blockEnd, inlineEnd } = getPlacementOffset(vertical, horizontal)
  const isCenterPlacement = placement === 'top' || placement === 'bottom'
  const offset
    = placement === 'top' || placement.endsWith('Left') ? `-${motionOffset}` : motionOffset

  return {
    placement,
    vertical,
    blockEnd,
    horizontal,
    inlineEnd,
    motionOffset: isCenterPlacement ? { x: '-50%', y: offset } : { x: offset },
    baseMotionOffset: isCenterPlacement ? { x: '-50%' } : undefined,
    isCenterPlacement,
  }
}

/** Get the list direction for a vertical placement. */
function getPlacementFlexDirection(vertical: VerticalPlacement) {
  return vertical === 'bottom' ? 'column-reverse' : 'column'
}

/** Keep configured top/bottom as the visible notice edge while list padding preserves shadows. */
function getPlacementInset(vertical: VerticalPlacement) {
  const marginEdge = `var(${notificationMarginEdgeVar}, 0px)`

  return `calc(var(--notification-${vertical}, ${marginEdge}) - ${marginEdge})`
}

/** Get the transform origin used by stacked notice scaling. */
function getPlacementTransformOrigin(vertical: VerticalPlacement) {
  return vertical === 'bottom' ? 'center top' : 'center bottom'
}

/** Calculate the clip offset that preserves stack shadows. */
function getStackShadowClipOffset(token: NotificationToken) {
  return unit(token.calc(token.marginXXL).mul(-1).equal())
}

/** Build the default stack clip-path for a visible notice. */
function getStackNoticeClipPath(token: NotificationToken) {
  const offset = getStackShadowClipOffset(token)
  return `inset(${offset} ${offset} ${offset} ${offset})`
}

/** Build the collapsed stack clip-path for a placement. */
function getPlacementStackClipPath(token: NotificationToken, vertical: VerticalPlacement) {
  const offset = getStackShadowClipOffset(token)

  return vertical === 'bottom'
    ? `inset(${offset} ${offset} 50% ${offset})`
    : `inset(50% ${offset} ${offset} ${offset})`
}

// ============================= Placement =============================

/** Generate styles for a single notification placement. */
function genPlacementStyle(token: NotificationToken, config: PlacementStyleConfig): CSSObject {
  const { componentCls } = token
  const {
    placement,
    vertical,
    blockEnd,
    horizontal,
    inlineEnd,
    // Horizontal centered
    isCenterPlacement,
  } = config

  const noticeCls = `${componentCls}-notice`
  const noticeMotionCls = `${noticeCls}${componentCls}-fade`

  // Transform used for enter start and leave end states.
  const enterTransform = getMotionTransform(config.motionOffset)
  // Transform used when fully visible; top/bottom keep translateX(-50%) for centering.
  const baseTransform = getMotionTransform(config.baseMotionOffset)
  const transformOrigin = getPlacementTransformOrigin(vertical)

  return {
    [`&${componentCls}-${placement}`]: {
      [vertical]: getPlacementInset(vertical),
      [blockEnd]: 'auto',
      display: 'flex',
      flexDirection: getPlacementFlexDirection(vertical),
      ...(isCenterPlacement
        ? {
            marginInline: 0,
            left: '50%',
            right: 'auto',
            transform: 'translateX(-50%)',
          }
        : {
            [horizontal]: 0,
            [inlineEnd]: 'auto',
          }),

      [noticeCls]: {
        [vertical]: 'var(--notification-y, 0)',
        ...(isCenterPlacement
          ? {
              left: '50%',
              transform: baseTransform,
            }
          : {
              [horizontal]: 'var(--notification-x, 0)',
            }),
        transformOrigin,
      },

      [`${noticeMotionCls}-appear-prepare, ${noticeMotionCls}-enter-prepare`]: {
        opacity: 0,
        transform: enterTransform,
        transition: 'none',
      },

      [`${noticeMotionCls}-appear-start, ${noticeMotionCls}-enter-start`]: {
        opacity: 0,
        transform: enterTransform,
      },

      [`${noticeMotionCls}-appear-active, ${noticeMotionCls}-enter-active`]: {
        opacity: 1,
        transform: baseTransform,
      },

      [`${noticeMotionCls}-leave-start`]: {
        opacity: 1,
        transform: baseTransform,
      },

      [`${noticeMotionCls}-leave-active`]: {
        opacity: 0,
        transform: enterTransform,
      },

      [`&${componentCls}-stack:not(${componentCls}-stack-expanded)`]: {
        [noticeCls]: {
          clipPath: getPlacementStackClipPath(token, vertical),
        },

        [`${noticeCls}[data-notification-index='0']`]: {
          clipPath: getStackNoticeClipPath(token),
        },
      },
    },
  }
}

/** Generate placement styles for all enabled notification placements. */
function genNotificationPlacementRootStyle(token: NotificationToken, placements: readonly NotificationPlacement[] = NotificationPlacements): CSSObject {
  const { notificationMotionOffset } = token
  const motionOffset = unit(notificationMotionOffset)

  return {
    ...placements.reduce<CSSObject>(
      (styles, placement) => ({
        ...styles,
        ...genPlacementStyle(token, getPlacementStyleConfig(placement, motionOffset)),
      }),
      {},
    ),
  }
}

// ============================== Export ==============================

/** Wrap placement styles under the component root selector. */
const genNotificationPlacementStyle: GenerateStyle<NotificationToken, CSSObject> = (token) => {
  const { componentCls } = token

  return {
    [componentCls]: genNotificationPlacementRootStyle(token),
  }
}

export default genNotificationPlacementStyle
