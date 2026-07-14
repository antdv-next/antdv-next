import type { CSSObject } from '@antdv-next/cssinjs'

export function genNoMotionStyle(): CSSObject {
  return {
    '@media (prefers-reduced-motion: reduce)': {
      '&, &::before, &::after': {
        transition: 'none',
        animation: 'none',
      },
    },
  }
}
