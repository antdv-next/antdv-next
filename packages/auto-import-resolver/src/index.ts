export interface AntdvNextResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]
  /**
   * resolve `antdv-next' icons
   *
   * requires package `@antdv-next/icons`
   *
   * @default false
   */
  resolveIcons?: boolean
  /**
   * rename package
   *
   * @default 'antdv-next'
   */
  packageName?: string
  /**
   * customize prefix of component
   * @default 'A'
   */
  prefix?: string
}
/**
 * Resolver for Ant Design Vue
 */
export function AntdvNextResolver(options: AntdvNextResolverOptions = {}) {
  const originPrefix = options.prefix ?? 'A'
  return {
    type: 'component' as const,
    resolve: (name: string) => {
      if (options.resolveIcons && name.match(/(Outlined|Filled|TwoTone)$/)) {
        return {
          name,
          from: '@antdv-next/icons',
        }
      }

      const [compName, prefix] = [name.slice(originPrefix.length), name.slice(0, originPrefix.length)]
      if (prefix === originPrefix && !options?.exclude?.includes(compName)) {
        const { packageName = 'antdv-next' } = options
        const path = `${packageName}`
        return {
          name: compName,
          from: path,
          sideEffects: '',
        }
      }
    },
  }
}