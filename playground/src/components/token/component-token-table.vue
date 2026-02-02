<script setup lang="ts">
import type { AnyObject } from '@v-c/util/dist/type'
import {
  LinkOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed, ref } from 'vue'
import { useSemanticLocale } from '@/composables/use-locale'
import tokenMetaRes from '../../assets/token-meta.json'
import tokenDataRes from '../../assets/token.json'
import ColorChunk from '../color-chunk/index.vue'

defineOptions({
  name: 'ComponentTokenTable',
})

const props = defineProps<{
  component: string
}>()

const locales = {
  cn: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
    componentToken: '组件 Token',
    globalToken: '全局 Token',
    componentComment: '这里是你的组件 token',
    globalComment: '这里是你的全局 token',
    help: '如何定制？',
    customizeTokenLink: '/docs/vue/customize-theme-cn#修改主题变量',
    customizeComponentTokenLink: '/docs/vue/customize-theme-cn#修改组件变量',
  },
  en: {
    token: 'Token Name',
    description: 'Description',
    type: 'Type',
    value: 'Default Value',
    componentToken: 'Component Token',
    globalToken: 'Global Token',
    componentComment: 'here is your component tokens',
    globalComment: 'here is your global tokens',
    help: 'How to use?',
    customizeTokenLink: '/docs/vue/customize-theme#customize-design-token',
    customizeComponentTokenLink: 'docs/react/customize-theme#customize-component-token',
  },
}

const locale = useSemanticLocale(locales)

const { token: tokenState } = theme.useToken()

const tokenMeta = tokenMetaRes as AnyObject
const tokenData = tokenDataRes as AnyObject

interface TokenData {
  name: string
  desc: string
  type: string
  value: any
}

function compare(token1: string, token2: string) {
  const hasColor1 = token1.toLowerCase().includes('color')
  const hasColor2 = token2.toLowerCase().includes('color')
  if (hasColor1 && !hasColor2) {
    return -1
  }
  if (!hasColor1 && hasColor2) {
    return 1
  }
  return token1 < token2 ? -1 : 1
}

const defaultToken = theme.getDesignToken()

// Convert CSS variable name to token name
// e.g., "font-size-heading-3" -> "fontSizeHeading3"
// e.g., "margin-xs" -> "marginXS"
// e.g., "padding-content-vertical-sm" -> "paddingContentVerticalSM"
function cssVarToTokenName(cssVar: string): string {
  // First convert kebab-case to camelCase
  let tokenName = cssVar.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())

  // Then handle common uppercase suffixes (XS, SM, MD, LG, XL, XXL, etc.)
  tokenName = tokenName
    .replace(/Xs$/, 'XS')
    .replace(/Sm$/, 'SM')
    .replace(/Md$/, 'MD')
    .replace(/Lg$/, 'LG')
    .replace(/Xl$/, 'XL')
    .replace(/Xxl$/, 'XXL')

  return tokenName
}

// Resolve CSS variable value to actual value
// e.g., "var(--ant-font-size-heading-3)" -> actual value from defaultToken
function resolveValue(value: any): any {
  if (typeof value !== 'string') {
    return value
  }

  // Match CSS variable pattern: var(--ant-xxx)
  const cssVarMatch = value.match(/^var\(--ant-([^)]+)\)(.*)$/)
  if (cssVarMatch && cssVarMatch[1]) {
    const tokenName = cssVarToTokenName(cssVarMatch[1])
    const suffix = cssVarMatch[2] // e.g., "px" or other suffix
    const tokenValue = (defaultToken as Record<string, any>)[tokenName]

    if (tokenValue !== undefined) {
      // If there's a suffix like "px", append it
      if (suffix) {
        return `${tokenValue}${suffix}`
      }
      return tokenValue
    }
  }

  // Handle complex expressions with multiple CSS variables
  // e.g., "var(--ant-padding-md)px var(--ant-padding-content-horizontal-lg)px"
  const complexMatch = value.match(/var\(--ant-([^)]+)\)/g)
  if (complexMatch && complexMatch.length > 0) {
    let resolvedValue = value
    for (const match of complexMatch) {
      const varName = match.match(/var\(--ant-([^)]+)\)/)?.[1]
      if (varName != null) {
        const tokenName = cssVarToTokenName(varName)
        const tokenValue = (defaultToken as Record<string, any>)[tokenName]
        if (tokenValue !== undefined) {
          resolvedValue = resolvedValue.replace(match, String(tokenValue))
        }
      }
    }
    return resolvedValue
  }

  return value
}

// Columns definition
const columns = computed(() => [
  {
    title: locale.value.token,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: locale.value.description,
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: locale.value.type,
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: locale.value.value,
    dataIndex: 'value',
    key: 'value',
  },
])

// SubTokenTable Logic
const componentTokens = computed(() => {
  const components = tokenMeta.components as Record<string, any>
  if (!props.component || !components[props.component])
    return []
  return components[props.component].map((item: any) => item.token)
})

const mergedGlobalTokens = computed(() => {
  const globalTokenSet = new Set<string>()
  if (props.component) {
    props.component.split(',').forEach((comp) => {
      const data = tokenData as Record<string, any>
      const { global: globalTokens = [] } = data[comp] || {}
      globalTokens.forEach((token: string) => {
        globalTokenSet.add(token)
      })
    })
  }
  return Array.from(globalTokenSet)
})

function useSubTableData(
  tokens: string[],
  component?: string,
) {
  return computed(() => {
    return [...tokens]
      .sort(component ? undefined : compare)
      .map<TokenData>((name) => {
        const components = tokenMeta.components as Record<string, any>
        const globalMeta = tokenMeta.global as Record<string, any>

        const meta = component
          ? components[component]?.find((item: any) => item.token === name)
          : globalMeta[name]

        if (!meta) {
          return null as unknown as TokenData
        }

        const data = tokenData as Record<string, any>
        const defToken = defaultToken as Record<string, any>

        const rawValue = component
          ? data[component]?.component?.[name]
          : defToken[name]

        return {
          name,
          desc: locale.value === locales.cn ? meta.desc : meta.descEn,
          type: meta.type,
          value: component ? resolveValue(rawValue) : rawValue,
        }
      })
      .filter(Boolean)
  })
}

const componentData = computed(() => {
  if (!componentTokens.value.length)
    return []
  return useSubTableData(componentTokens.value, props.component).value
})

const globalData = computed(() => {
  return useSubTableData(mergedGlobalTokens.value).value
})

// Open state
const componentOpen = ref(true)
const globalOpen = ref(import.meta.env.DEV)

// Code generation
const componentCode = computed(() => {
  return `<a-config-provider
  :theme="{
    components: {
      ${props.component}: {
        /* ${locale.value.componentComment} */
      },
    },
  }"
>
  ...
</a-config-provider>`
})

const globalCode = computed(() => {
  return `<a-config-provider
  :theme="{
    token: {
      /* ${locale.value.globalComment} */
    },
  }"
>
  ...
</a-config-provider>`
})
</script>

<template>
  <div class="component-token-table">
    <!-- Component Token Section -->
    <div v-if="componentTokens.length > 0">
      <div class="cursor-pointer relative flex items-center justify-start leading-[40px] gap-2" @click="componentOpen = !componentOpen">
        <RightOutlined
          class="text-16px transition-all duration-300"
          :rotate="componentOpen ? 90 : 0"
        />
        <a-flex class="text-16px font-bold" gap="small" justify="flex-start" align="center">
          {{ locale.componentToken }}
          <a-popover
            destroy-on-hidden
            :overlay-style="{ width: '400px' }"
          >
            <template #content>
              <a-typography>
                <pre dir="ltr" style="font-size: 12px;"><code dir="ltr">{{ componentCode }}</code></pre>
                <a class="text-[#999]" :href="locale.customizeTokenLink" target="_blank" rel="noreferrer">
                  <LinkOutlined style="margin-inline-end: 4px;" />
                  {{ locale.help }}
                </a>
              </a-typography>
            </template>
            <span class="text-12px font-normal text-[#999]" @click.stop>
              <QuestionCircleOutlined style="margin-inline-end: 4px;" />
              {{ locale.help }}
            </span>
          </a-popover>
        </a-flex>
      </div>
      <div v-if="componentOpen">
        <a-config-provider :theme="{ token: { borderRadius: 0 } }">
          <a-table
            size="middle"
            :columns="columns"
            bordered
            :data-source="componentData"
            :style="{ marginBottom: `${tokenState.margin}px` }"
            :pagination="false"
            row-key="name"
          >
            <template #bodyCell="{ column, text, record }">
              <span
                v-if="column.key === 'type'" :style="{
                  margin: '0 1px',
                  padding: '0.2em 0.4em',
                  fontSize: '0.9em',
                  background: tokenState.colorFillQuaternary,
                  border: `1px solid ${tokenState.colorSplit}`,
                  borderRadius: `${tokenState.borderRadiusSM}px`,
                  fontFamily: 'monospace',
                }"
              >{{ record.type }}</span>
              <template v-if="column.key === 'value'">
                <ColorChunk
                  v-if="typeof text === 'string' && (text.startsWith('#') || text.startsWith('rgb') || text.startsWith('rgba'))"
                  :value="text"
                  enable-popover
                >
                  {{ text }}
                </ColorChunk>
                <template v-else>
                  {{ text }}
                </template>
              </template>
            </template>
          </a-table>
        </a-config-provider>
      </div>
    </div>

    <!-- Global Token Section -->
    <div v-if="mergedGlobalTokens.length > 0">
      <div class="cursor-pointer relative flex items-center justify-start leading-[40px] gap-2" @click="globalOpen = !globalOpen">
        <RightOutlined
          class="text-16px transition-all duration-300"
          :rotate="globalOpen ? 90 : 0"
        />
        <a-flex class="text-16px font-bold" gap="small" justify="flex-start" align="center">
          {{ locale.globalToken }}
          <a-popover
            destroy-on-hidden
            :overlay-style="{ width: '400px' }"
          >
            <template #content>
              <a-typography>
                <pre dir="ltr" style="font-size: 12px;"><code dir="ltr">{{ globalCode }}</code></pre>
                <a class="text-[#999]" :href="locale.customizeComponentTokenLink" target="_blank" rel="noreferrer">
                  <LinkOutlined style="margin-inline-end: 4px;" />
                  {{ locale.help }}
                </a>
              </a-typography>
            </template>
            <span class="text-12px font-normal text-[#999]" @click.stop>
              <QuestionCircleOutlined style="margin-inline-end: 4px;" />
              {{ locale.help }}
            </span>
          </a-popover>
        </a-flex>
      </div>
      <div v-if="globalOpen">
        <a-config-provider :theme="{ token: { borderRadius: 0 } }">
          <a-table
            size="middle"
            :columns="columns"
            bordered
            :data-source="globalData"
            :style="{ marginBottom: `${tokenState.margin}px` }"
            :pagination="false"
            row-key="name"
          >
            <template #bodyCell="{ column, text, record }">
              <span
                v-if="column.key === 'type'" :style="{
                  margin: '0 1px',
                  padding: '0.2em 0.4em',
                  fontSize: '0.9em',
                  background: tokenState.colorFillQuaternary,
                  border: `1px solid ${tokenState.colorSplit}`,
                  borderRadius: `${tokenState.borderRadiusSM}px`,
                  fontFamily: 'monospace',
                }"
              >{{ record.type }}</span>
              <template v-if="column.key === 'value'">
                <ColorChunk
                  v-if="typeof text === 'string' && (text.startsWith('#') || text.startsWith('rgb') || text.startsWith('rgba'))"
                  :value="text"
                  enable-popover
                >
                  {{ text }}
                </ColorChunk>
                <template v-else>
                  {{ text }}
                </template>
              </template>
            </template>
          </a-table>
        </a-config-provider>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-token-table :deep(table) {
  display: table;
  margin: 0;
}
</style>
