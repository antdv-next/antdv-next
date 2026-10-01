export type { UseToken, UseTokenReturn } from './hooks/useToken'

export type {
  ComponentToken,
  ComponentTokenKey,
  GlobalToken,
  GlobalTokenWithComponent,
  OverrideTokenMap,
  TokenMap,
  TokenMapKey,
} from './interface'

export type {
  CSSUtil,
  CSSVarRegisterProps,
  FullToken,
  GenStyleFn,
  GetCompUnitless,
  GetDefaultToken,
  GetDefaultTokenFn,
  GetResetStyles,
  StyleInfo,
  SubStyleComponentProps,
  TokenWithCommonCls,
} from './util/genStyleUtils.ts'
export { default as genStyleUtils } from './util/genStyleUtils.ts'

export {
  merge as mergeToken,
  statistic,
  default as statisticToken,
} from './util/statistic'
