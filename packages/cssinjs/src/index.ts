import type { CSSInterpolation, CSSObject } from './hooks/useStyleRegister'
import type { Linter } from './linters'
import type { StyleProviderProps } from './StyleContext'
import type { AbstractCalculator, DerivativeFunc, TokenType } from './theme'
import type { Transformer } from './transformers/interface'
import extractStyle from './extractStyle'
import useCacheToken, { getComputedToken } from './hooks/useCacheToken'
import useCSSVarRegister from './hooks/useCSSVarRegister'
import useStyleRegister from './hooks/useStyleRegister'
import Keyframes from './Keyframes'
import {
  legacyNotSelectorLinter,
  logicalPropertiesLinter,
  NaNLinter,
  parentSelectorLinter,
} from './linters'
import { collectStyleText, setStyleCollector } from './ssr/styleCollector'
import { createCache, provideStyleContext, StyleProvider, useStyleContext, useStyleContextProvide } from './StyleContext'
import { createTheme, genCalc, Theme } from './theme'
import autoPrefixTransformer from './transformers/autoPrefix'
import legacyLogicalPropertiesTransformer from './transformers/legacyLogicalProperties'
import px2remTransformer from './transformers/px2rem'
import { hash, supportLogicProps, supportWhere, token2CSSVar, unit } from './util'

export {
  // Transformer
  autoPrefixTransformer,
  collectStyleText,
  createCache,
  createTheme,
  extractStyle,
  genCalc,
  getComputedToken,
  hash,
  Keyframes,
  legacyLogicalPropertiesTransformer,
  legacyNotSelectorLinter,
  // Linters
  logicalPropertiesLinter,

  NaNLinter,
  parentSelectorLinter,
  provideStyleContext,
  px2remTransformer,
  setStyleCollector,
  StyleProvider,

  Theme,
  // util
  token2CSSVar,
  unit,
  useCacheToken,
  useCSSVarRegister,

  // StyleContext,
  useStyleContext,
  useStyleContextProvide,
  useStyleRegister,
}
export type {
  AbstractCalculator,
  CSSInterpolation,
  CSSObject,
  DerivativeFunc,
  Linter,
  StyleProviderProps,
  TokenType,
  Transformer,
}

export const _experimental = {
  supportModernCSS: () => supportWhere() && supportLogicProps(),
}

export * from './cssinjs-utils'
