import type { Locale } from './locale'
import antd from '.'

// Re-export the full named surface (components, `install`, `theme`, …) so the
// with-locales UMD/ESM global carries `install` at the top level and
// `app.use(window.antd)` works directly. See src/index.ts.
export * from '.'

interface LocaleModule { default: Locale }

const localeModules = import.meta.glob<LocaleModule>('./locale/*_*.ts', {
  eager: true,
})

export const locales: Record<string, Locale> = Object.fromEntries(
  Object.entries(localeModules)
    .map(([path, mod]) => {
      const matches = path.match(/\/([A-Za-z]+_[A-Za-z]+)\.ts$/)
      const localeName = matches?.[1]

      if (!localeName)
        return null

      return [localeName, mod.default] as const
    })
    .filter((item): item is readonly [string, Locale] => item !== null),
)

const antdWithLocales = {
  ...antd,
  locales,
}

export default antdWithLocales
