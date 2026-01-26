<script setup lang="ts">
import type { AnyObject } from '@v-c/util/dist/type'
import {
  LinkOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@antdv-next/icons'
import {
  ConfigProvider,
  Flex,
  Popover,
  Table,
  theme,
  Typography,
} from 'antdv-next'
import useLocale from 'antdv-next/locale/useLocale'
import { computed, ref } from 'vue'
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

const [, lang] = useLocale('Table')
const locale = computed(() => {
  return lang?.value.toLowerCase() === 'zh-cn' ? locales.cn : locales.en
})

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

        return {
          name,
          desc: lang?.value === 'zh-cn' ? meta.desc : meta.descEn,
          type: meta.type,
          value: component
            ? data[component]?.component?.[name]
            : defToken[name],
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
  return `<ConfigProvider
  theme={{
    components: {
      ${props.component}: {
        /* ${locale.value.componentComment} */
      },
    },
  }}
>
  ...
</ConfigProvider>`
})

const globalCode = computed(() => {
  return `<ConfigProvider
  theme={{
    token: {
      /* ${locale.value.globalComment} */
    },
  }}
>
  ...
</ConfigProvider>`
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
        <Flex class="text-16px font-bold" gap="small" justify="flex-start" align="center">
          {{ locale.componentToken }}
          <Popover
            title=""
            destroy-on-hidden
            :overlay-style="{ width: '400px' }"
          >
            <template #content>
              <Typography>
                <pre dir="ltr" style="font-size: 12px;"><code dir="ltr">{{ componentCode }}</code></pre>
                <a class="text-[#999]" :href="locale.customizeTokenLink" target="_blank" rel="noreferrer">
                  <LinkOutlined style="margin-inline-end: 4px;" />
                  {{ locale.help }}
                </a>
              </Typography>
            </template>
            <span class="text-12px font-normal text-[#999]" @click.stop>
              <QuestionCircleOutlined style="margin-inline-end: 4px;" />
              {{ locale.help }}
            </span>
          </Popover>
        </Flex>
      </div>
      <div v-if="componentOpen">
        <ConfigProvider :theme="{ token: { borderRadius: 0 } }">
          <Table
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
          </Table>
        </ConfigProvider>
      </div>
    </div>

    <!-- Global Token Section -->
    <div v-if="mergedGlobalTokens.length > 0">
      <div class="cursor-pointer relative flex items-center justify-start leading-[40px] gap-2" @click="globalOpen = !globalOpen">
        <RightOutlined
          class="text-16px transition-all duration-300"
          :rotate="globalOpen ? 90 : 0"
        />
        <Flex class="text-16px font-bold" gap="small" justify="flex-start" align="center">
          {{ locale.globalToken }}
          <Popover
            title=""
            destroy-on-hidden
            :overlay-style="{ width: '400px' }"
          >
            <template #content>
              <Typography>
                <pre dir="ltr" style="font-size: 12px;"><code dir="ltr">{{ globalCode }}</code></pre>
                <a class="text-[#999]" :href="locale.customizeComponentTokenLink" target="_blank" rel="noreferrer">
                  <LinkOutlined style="margin-inline-end: 4px;" />
                  {{ locale.help }}
                </a>
              </Typography>
            </template>
            <span class="text-12px font-normal text-[#999]" @click.stop>
              <QuestionCircleOutlined style="margin-inline-end: 4px;" />
              {{ locale.help }}
            </span>
          </Popover>
        </Flex>
      </div>
      <div v-if="globalOpen">
        <ConfigProvider :theme="{ token: { borderRadius: 0 } }">
          <Table
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
          </Table>
        </ConfigProvider>
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
