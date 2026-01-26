import type { DeclarationReflection } from 'typedoc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { Application, TSConfigReader, TypeDocReader } from 'typedoc'
import { normalizePath } from 'vite'

interface TokenMeta {
  seed: ReturnType<typeof getTokenList>
  map: ReturnType<typeof getTokenList>
  alias: ReturnType<typeof getTokenList>
  components: Record<string, ReturnType<typeof getTokenList>>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')
const playgroundDir = path.resolve(repoRoot, 'playground')
const packageRoot = path.resolve(repoRoot, 'packages/antdv-next')
const srcRoot = path.resolve(packageRoot, 'src')
const output = path.resolve(playgroundDir, 'src/assets/token-meta.json')

const specialComponentNames: Record<string, string> = {
  qrcode: 'QRCode',
}

function getEntryModuleName(file: any) {
  const sourceFile = file.sources?.[0]?.fileName
  const rawName = sourceFile ? normalizePath(sourceFile) : normalizePath(file.name ?? '')
  const srcIndex = rawName.lastIndexOf('/src/')
  const normalized = srcIndex >= 0 ? rawName.slice(srcIndex + '/src/'.length) : rawName.replace(/^src\//, '')
  return normalized.replace(/\/index(\.(ts|tsx))?$/, '')
}

function getComponentName(value: string) {
  if (specialComponentNames[value])
    return specialComponentNames[value]
  return value.replace(/(^(.)|-(.))/g, match => match.replace('-', '').toUpperCase())
}

function getTagText(item: DeclarationReflection, tagName: string) {
  return (
    item.comment?.blockTags
      ?.find(tag => tag.tag === tagName)
      ?.content
      .reduce((result, str) => result.concat(str.text), '') || ''
  )
}

function getTokenList(list?: DeclarationReflection[], source?: string) {
  return (list || [])
    .filter(
      item =>
        !item.comment?.blockTags?.some(
          tag => tag.tag === '@internal' || tag.tag === '@private' || tag.tag === '@deprecated',
        ),
    )
    .map(item => ({
      source,
      token: item.name,
      type: item?.type?.toString(),
      desc: getTagText(item, '@desc'),
      descEn: getTagText(item, '@descEN'),
      name: getTagText(item, '@nameZH'),
      nameEn: getTagText(item, '@nameEN'),
    }))
}

function getPresetColorsTokenList(presetColors: string[]) {
  return presetColors.map(item => ({
    source: 'seed',
    token: item,
    type: 'color',
    desc: `预设${item}颜色`,
    descEn: `Preset ${item} color`,
    name: `预设${item}颜色`,
    nameEn: `Preset ${item} color`,
  }))
}

async function main() {
  const app = await Application.bootstrap(
    {
      entryPoints: [
        path.resolve(srcRoot, 'theme/interface/index.ts'),
        path.resolve(srcRoot, '*/style/index.ts'),
        path.resolve(srcRoot, '*/style/index.tsx'),
        path.resolve(srcRoot, '*/style/token.ts'),
        path.resolve(srcRoot, '*/style/token.tsx'),
      ].map(target => normalizePath(target)),
      entryPointStrategy: 'expand',
      tsconfig: path.resolve(packageRoot, 'tsconfig.json'),
      skipErrorChecking: true,
      logLevel: 'Error',
    },
    [new TSConfigReader(), new TypeDocReader()],
  )

  const project = await app.convert()

  if (project) {
    const tokenMeta: TokenMeta = {
      seed: [],
      map: [],
      alias: [],
      components: {},
    }

    project.children?.forEach((file: any) => {
      const moduleName = getEntryModuleName(file)

      if (moduleName === 'theme/interface') {
        let presetColors: string[] = []
        file.children?.forEach((type: any) => {
          if (type.name === 'SeedToken') {
            tokenMeta.seed = getTokenList(type.children, 'seed')
          }
          else if (type.name === 'MapToken') {
            tokenMeta.map = getTokenList(type.children, 'map')
          }
          else if (type.name === 'AliasToken') {
            tokenMeta.alias = getTokenList(type.children, 'alias')
          }
          else if (type.name === 'PresetColors') {
            const elements = type?.type?.target?.elements || type?.type?.elements
            if (Array.isArray(elements))
              presetColors = elements.map((item: any) => item.value)
          }
        })

        tokenMeta.seed = tokenMeta.seed
          .filter(item => !presetColors.some(color => item.token.startsWith(color)))
          .concat(getPresetColorsTokenList(presetColors))
        tokenMeta.map = tokenMeta.map.filter(
          item => !presetColors.some(color => item.token.startsWith(color)),
        )
        tokenMeta.alias = tokenMeta.alias.filter(
          item => !presetColors.some(color => item.token.startsWith(color)),
        )

        tokenMeta.alias = tokenMeta.alias.filter(
          item => !tokenMeta.map.some(mapItem => mapItem.token === item.token),
        )
        tokenMeta.map = tokenMeta.map.filter(
          item => !tokenMeta.seed.some(seedItem => seedItem.token === item.token),
        )
      }
      else {
        const componentMatch = moduleName.match(/^([^/]+)\/style/)
        if (!componentMatch)
          return

        const component = getComponentName(componentMatch![1]!)
        const componentToken = file.children?.find((item: any) => item?.name === 'ComponentToken')
        if (componentToken) {
          const tokenList = getTokenList(componentToken.children, component)
          if (!tokenMeta.components[component] || tokenList.length > 0)
            tokenMeta.components[component] = tokenList
        }
      }
    })

    const finalMeta = Object.entries(tokenMeta).reduce<any>((acc, [key, value]) => {
      if (key !== 'components') {
        (value as any[]).forEach((item) => {
          acc.global = acc.global || {}
          acc.global[item.token] = {
            name: item.name,
            nameEn: item.nameEn,
            desc: item.desc,
            descEn: item.descEn,
            type: item.type,
            source: key,
          }
        })
      }
      else {
        acc.components = value
      }
      return acc
    }, {})

    fs.ensureDirSync(path.dirname(output))
    fs.writeJsonSync(output, finalMeta, 'utf8')
    console.log(`Token meta has been written to ${output}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
