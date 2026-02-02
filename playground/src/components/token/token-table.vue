<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { useSemanticLocale } from '@/composables/use-locale'
import tokenMetaRes from '../../assets/token-meta.json'
import BezierVisualizer from '../bezier-visualizer/index.vue'
import ColorChunk from '../color-chunk/index.vue'

defineOptions({
  name: 'TokenTable',
})

const props = defineProps<{
  type: 'seed' | 'map' | 'alias'
}>()

const locales = {
  cn: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
  },
  en: {
    token: 'Token Name',
    description: 'Description',
    type: 'Type',
    value: 'Default Value',
  },
}

const locale = useSemanticLocale(locales)

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

const data = computed<TokenData[]>(() => {
  return Object.entries(tokenMeta.global)
    .filter(([, meta]) => meta.source === props.type)
    .map(([token, meta]) => ({
      name: token,
      desc: locale.value === locales.cn ? meta.desc : meta.descEn,
      type: meta.type,
      value: (defaultToken as Record<string, any>)[token],
    }))
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
