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
    // A component token that mirrors the global alias token of the same name
    // is dropped so no redundant CSS variable gets emitted. Keys the user set
    // explicitly must never be dropped: the component style always references
    // the component-level variable (`--ant-<component>-<key>`), so skipping it
    // leaves a dangling `var()` reference. See e.g.
    // `theme.components.Alert.borderRadius = 6` where the global
    // `borderRadius` alias token happens to be `6` as well.
    if (!(key in customToken) && mergedToken[key] === (token as any)[key]) {
      delete mergedToken[key]
    }
  })

  return mergedToken
}

export default getComponentToken
