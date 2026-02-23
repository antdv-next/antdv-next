import type { CSSObject } from '@antdv-next/cssinjs'
import type { AliasToken, GenerateStyle } from '../theme/internal'

import { unit } from '@antdv-next/cssinjs'

export const textEllipsis: CSSObject = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export function resetComponent(token: AliasToken, needInheritFontFamily = false): CSSObject {
  return {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    color: token.colorText,
    fontSize: token.fontSize,
    // font-variant: @font-variant-base;
    lineHeight: token.lineHeight,
    listStyle: 'none',
    // font-feature-settings: @font-feature-settings-base;
    fontFamily: needInheritFontFamily ? 'inherit' : token.fontFamily,
  }
}

export function resetIcon(): CSSObject {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'inherit',
    fontStyle: 'normal',
    lineHeight: 0,
    textAlign: 'center',
    textTransform: 'none',
    // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
    verticalAlign: '-0.125em',
    textRendering: 'optimizeLegibility',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',

    '> *': {
      lineHeight: 1,
    },

    svg: {
      display: 'inline-block',
    },
  }
}

export function clearFix(): CSSObject {
  return {
  // https://github.com/ant-design/ant-design/issues/21301#issuecomment-583955229
    '&::before': {
      display: 'table',
      content: '""',
    },

    '&::after': {
    // https://github.com/ant-design/ant-design/issues/21864
      display: 'table',
      clear: 'both',
      content: '""',
    },
  }
}

export const genLinkStyle: GenerateStyle<AliasToken, CSSObject> = token => ({
  a: {
    color: token.colorLink,
    textDecoration: token.linkDecoration,
    backgroundColor: 'transparent', // remove the gray background on active links in IE 10.
    outline: 'none',
    cursor: 'pointer',
    transition: `color ${token.motionDurationSlow}`,
    '-webkit-text-decoration-skip': 'objects', // remove gaps in links underline in iOS 8+ and Safari 8+.

    '&:hover': {
      color: token.colorLinkHover,
    },

    '&:active': {
      color: token.colorLinkActive,
    },

    '&:active, &:hover': {
      textDecoration: token.linkHoverDecoration,
      outline: 0,
    },

    // https://github.com/ant-design/ant-design/issues/22503
    '&:focus': {
      textDecoration: token.linkFocusDecoration,
      outline: 0,
    },

    '&[disabled]': {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  },
})

export function genCommonStyle(token: AliasToken, componentPrefixCls: string, rootCls?: string, resetFont?: boolean): CSSObject {
  const prefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`
  const rootPrefixSelector = rootCls ? `.${rootCls}` : prefixSelector

  const resetStyle: CSSObject = {
    boxSizing: 'border-box',

    '&::before, &::after': {
      boxSizing: 'border-box',
    },
  }

  let resetFontStyle: CSSObject = {}

  if (resetFont !== false) {
    resetFontStyle = {
      fontFamily: token.fontFamily,
      fontSize: token.fontSize,
    }
  }

  return {
    [rootPrefixSelector]: {
      ...resetFontStyle,
      ...resetStyle,

      [prefixSelector]: resetStyle,
    },
  }
}

export function genFocusOutline(token: AliasToken, offset?: number): CSSObject {
  return {
    outline: `${unit(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
    outlineOffset: offset ?? 1,
    transition: [`outline-offset`, `outline`].map(prop => `${prop} 0s`).join(', '),
  }
}

export function genFocusStyle(token: AliasToken, offset?: number): CSSObject {
  return {
    '&:focus-visible': genFocusOutline(token, offset),
  }
}

export function genIconStyle(iconPrefixCls: string): CSSObject {
  return {
    [`.${iconPrefixCls}`]: {
      ...resetIcon(),
      [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
        display: 'block',
      },
    },
  }
}

export const operationUnit: GenerateStyle<AliasToken, CSSObject> = token => ({
  // FIXME: This use link but is a operation unit. Seems should be a colorPrimary.
  // And Typography use this to generate link style which should not do this.
  color: token.colorLink,
  textDecoration: token.linkDecoration,
  outline: 'none',
  cursor: 'pointer',
  transition: `all ${token.motionDurationSlow}`,
  border: 0,
  padding: 0,
  background: 'none',
  userSelect: 'none',

  ...genFocusStyle(token),

  '&:hover': {
    color: token.colorLinkHover,
    textDecoration: token.linkHoverDecoration,
  },

  '&:focus': {
    color: token.colorLinkHover,
    textDecoration: token.linkFocusDecoration,
  },

  '&:active': {
    color: token.colorLinkActive,
    textDecoration: token.linkHoverDecoration,
  },
})
