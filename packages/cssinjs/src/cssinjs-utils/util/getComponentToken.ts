import type { TokenType } from '../../theme'
import type {
  ComponentToken,
  ComponentTokenKey,
  GlobalToken,
  TokenMap,
  TokenMapKey,
} from '../interface'
import { warning } from '@v-c/util/dist/warning'

function getComponentToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
>(
  component: C,
  token: GlobalToken<CompTokenMap, AliasToken>,
  defaultToken: CompTokenMap[C],
  options?: {
    deprecatedTokens?: [
      ComponentTokenKey<CompTokenMap, AliasToken, C>,
      ComponentTokenKey<CompTokenMap, AliasToken, C>,
    ][]
  },
) {
  const customToken = {
    ...(token[component] as ComponentToken<CompTokenMap, AliasToken, C>),
  }

  if (options?.deprecatedTokens) {
    options.deprecatedTokens.forEach(([oldKey, newKey]) => {
      // @ts-expect-error this is fine
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !customToken?.[oldKey],
          `Component Token \`${String(oldKey)}\` of ${String(component)} is deprecated. Please use \`${String(newKey)}\` instead.`,
        )
      }

      if (customToken?.[oldKey] || customToken?.[newKey]) {
        customToken[newKey] ??= customToken?.[oldKey]
      }
    })
  }

  const mergedToken: any = { ...defaultToken, ...customToken }

  Object.keys(mergedToken).forEach((key) => {
    if (mergedToken[key] === (token as any)[key]) {
      delete mergedToken[key]
    }
  })

  return mergedToken
}

export default getComponentToken
