import type { CSSObject, Keyframes } from '@antdv-next/cssinjs'

function initMotionCommon(duration: string): CSSObject {
  return {
    animationDuration: duration,
    animationFillMode: 'both',
  }
}

export function initMotion(motionCls: string, inKeyframes: Keyframes, outKeyframes: Keyframes, duration: string, sameLevel = false): CSSObject {
  const sameLevelPrefix = sameLevel ? '&' : ''

  return {
    [`
      ${sameLevelPrefix}${motionCls}-enter,
      ${sameLevelPrefix}${motionCls}-appear
    `]: {
      ...initMotionCommon(duration),
      animationPlayState: 'paused',
    },

    [`${sameLevelPrefix}${motionCls}-leave`]: {
      ...initMotionCommon(duration),
      animationPlayState: 'paused',
    },

    [`
      ${sameLevelPrefix}${motionCls}-enter${motionCls}-enter-active,
      ${sameLevelPrefix}${motionCls}-appear${motionCls}-appear-active
    `]: {
      animationName: inKeyframes,
      animationPlayState: 'running',
    },

    [`${sameLevelPrefix}${motionCls}-leave${motionCls}-leave-active`]: {
      animationName: outKeyframes,
      animationPlayState: 'running',
      pointerEvents: 'none',
    },
  }
}
