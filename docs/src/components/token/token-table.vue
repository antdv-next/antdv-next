<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { useMobile } from '@/composables/mobile'
import { useLocale } from '@/composables/use-locale'
import tokenMetaRes from '../../assets/token-meta.json'
import BezierVisualizer from '../bezier-visualizer/index.vue'
import ColorChunk from '../color-chunk/index.vue'

defineOptions({
  name: 'TokenTable',
})

const props = defineProps<{
  type: 'seed' | 'map' | 'alias'
}>()

const { t, messages } = useLocale()
const { isMobile } = useMobile()

const { token: tokenState } = theme.useToken()

interface TokenMeta {
  name: string
  nameEn: string
  desc: string
  descEn: string
  type: string
  source: string
}

interface TokenData {
  name: string
  desc: string
  type: string
  value: any
}

const defaultToken = theme.getDesignToken()
const tokenMeta = tokenMetaRes as { global: Record<string, TokenMeta> }

const columns = computed(() => [
  {
    title: t('components.tokenTable.token'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('components.tokenTable.description'),
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: t('components.tokenTable.type'),
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: t('components.tokenTable.value'),
    dataIndex: 'value',
    key: 'value',
  },
])

const data = computed<TokenData[]>(() => {
  return Object.entries(tokenMeta.global)
    .filter(([, meta]) => meta.source === props.type)
    .map(([token, meta]) => {
      const currentLocale = messages.value.components
      const isChinese = 'tokenTable' in currentLocale && currentLocale.tokenTable.token === 'Token 名称'

      return {
        name: token,
        desc: isChinese ? meta.desc : meta.descEn,
        type: meta.type,
        value: (defaultToken as Record<string, any>)[token],
      }
    })
})

function isColor(value: any): boolean {
  return typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'))
}

function isBezier(value: any): boolean {
  return typeof value === 'string' && value.toLowerCase().trim().startsWith('cubic-bezier')
}

function formatValue(value: any): string {
  return typeof value !== 'string' ? JSON.stringify(value) : value
}
</script>

<template>
  <a-table
    bordered
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :scroll="isMobile ? { x: 'max-content' } : undefined"
    row-key="name"
  >
    <template #bodyCell="{ column, text, record }">
      <span
        v-if="column.key === 'type'"
        :style="{
          margin: '0 1px',
          padding: '0.2em 0.4em',
          fontSize: '0.9em',
          background: tokenState.colorFillQuaternary,
          border: `1px solid ${tokenState.colorSplit}`,
          borderRadius: `${tokenState.borderRadiusSM}px`,
          fontFamily: 'monospace',
        }"
      >
        {{ record.type }}
      </span>
      <template v-else-if="column.key === 'value'">
        <ColorChunk
          v-if="isColor(text)"
          :value="text"
          enable-popover
        >
          {{ text }}
        </ColorChunk>
        <BezierVisualizer
          v-else-if="isBezier(text)"
          :value="text"
        />
        <template v-else>
          {{ formatValue(text) }}
        </template>
      </template>
    </template>
  </a-table>
</template>
