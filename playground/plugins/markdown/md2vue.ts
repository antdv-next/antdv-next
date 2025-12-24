import type { MarkdownItEnv } from '@mdit-vue/types'
import type { PluginOption } from 'vite'
import type { CreateMarkdownOptions } from './markdown'
import { LRUCache } from 'lru-cache'
import { findStaticImports } from 'mlly'
import pathe from 'pathe'
import { shortHash } from '../utils/shortHash'
import { useMarkdown } from './markdown'
import { SCRIPT_REGEX, STYLE_REGEX } from './shared'

export function formatPageData(env: MarkdownItEnv) {
  const pageData = {
    // id: env.id,
    title: env.title ?? '',
    frontmatter: env.frontmatter ?? {},
    headers: env.headers ?? [],
    description: '',
  }

  if (env.frontmatter?.description && typeof env.frontmatter?.description === 'string')
    pageData.description = env.frontmatter.description

  if (env.frontmatter?.title && typeof env.frontmatter?.title === 'string' && !env.title)
    pageData.title = env.frontmatter.title

  return pageData
}

export function checkPkgImport(findCode: string, pkg: string, importName: string) {
  if (findCode) {
    const imports = findStaticImports(findCode)
    for (const item of imports) {
      if (item.specifier === pkg && item.imports.includes(importName))
        return true
    }
  }
  return false
}

export function addScriptSetup(scriptTags: RegExpMatchArray | null, env: MarkdownItEnv) {
  const pageData = formatPageData(env)
  const baseCode = `const __pageData = ${JSON.stringify(pageData)};\nconst frontmatter = ${JSON.stringify(env.frontmatter)};\n`
  const importsCode = `import { inject, provide, ref } from 'vue';\n`
  const injectedCode = `const __parentPageData = ref({});provide('__pageData__',(data)=>{__parentPageData.value=data});const __pageDataFunc__ = inject('__pageData__',null);if(__pageDataFunc__)__pageDataFunc__(__pageData);provide('__pageInfo__',__pageData);`
  if (!scriptTags || !scriptTags.length) {
    return `<script setup lang="ts">\n${importsCode}${baseCode}${injectedCode}\n</script>\n`
  }
  const scriptSetupCode = scriptTags.find((v) => {
    // 只要是单行的script标签，中包含<script setup>的标签
    return /<script\b[^>]+\bsetup\b[^>]*>/i.test(v)
  })
  if (!scriptSetupCode) {
    // 如果没有找到script setup标签，则直接返回
    return `<script setup lang="ts">\n${importsCode}${baseCode}${injectedCode}\n</script>\n${scriptTags.join('\n')}\n`
  }
  // 剩余的script代码
  const restScriptTags = scriptTags.filter((v) => {
    return v !== scriptSetupCode
  })
  // 获取内部的代码
  const scriptContent = scriptSetupCode
    ? scriptSetupCode
        .replace(/<script\b[^>]+\bsetup\b[^>]*>/i, '')
        .replace(/<\/script>/i, '')
    : ''
  const hasProvide = checkPkgImport(scriptContent, 'vue', 'provide')
  const hasInject = checkPkgImport(scriptContent, 'vue', 'inject')
  const hasRef = checkPkgImport(scriptContent, 'vue', 'ref')
  let _importsCode = ''
  if (!hasRef || !hasProvide || !hasInject) {
    const importArr: string[] = []
    if (!hasProvide) {
      importArr.push('provide')
    }
    if (!hasInject) {
      importArr.push('inject')
    }
    if (!hasRef) {
      importArr.push('ref')
    }
    _importsCode = `import { ${importArr.join(', ')} } from 'vue';\n`
  }
  return `<script setup lang="ts">\n${_importsCode}${scriptContent}${baseCode}${injectedCode}\n</script>\n${restScriptTags.join('\n')}\n`
}

export function md2Vue(code: string, env: MarkdownItEnv) {
  const scriptTags = code.match(SCRIPT_REGEX)
  const styleTags = code.match(STYLE_REGEX)
  // Remove script and style tags from the original code
  code = code.replace(SCRIPT_REGEX, '').replace(STYLE_REGEX, '')
  // Create a Vue component string
  const vueComponent = `<template>\n<div class="ant-doc vp-doc">${code}</div>\n</template>\n`
  const scriptContent = addScriptSetup(scriptTags, env)
  const styleContent = styleTags ? styleTags.join('\n') : ''
  return `${scriptContent}\n${vueComponent}\n${styleContent}`
}

export function md2VuePlugin(options: CreateMarkdownOptions = {}): PluginOption {
  let md: ReturnType<typeof useMarkdown>
  const cache = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 10,
    allowStale: true,
    updateAgeOnGet: true,
  })
  return {
    configResolved(config) {
      md = useMarkdown({
        root: pathe.resolve(config.root ?? process.cwd(), '.'),
        ...options,
      })
    },
    name: 'vite:md2vue',
    transform: {
      filter: {
        id: /\.md$/,
      },
      async handler(code, id) {
        const key = shortHash(code)
        if (cache.has(key)) {
          return cache.get(key) as string
        }
        const env: MarkdownItEnv = {
          id,
        }
        const html = await md.renderAsync(code, env)
        const vueCode = md2Vue(html, env)
        cache.set(key, vueCode)
        return vueCode
      },
    },
  }
}
