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

/**
 * Flat variant for call sites already nested inside a pseudo-element
 * selector, where the `&::before` expansion of `genNoMotionStyle` would
 * emit invalid selectors like `.foo::before::before` (rejected by
 * lightningcss during the docs build).
 */
export function genNoMotionRawStyle(): CSSObject {
  return {
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      animation: 'none',
    },
  }
}
