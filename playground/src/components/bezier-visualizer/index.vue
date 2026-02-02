<script setup lang="ts">
import { LinkOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { useSemanticLocale } from '@/composables/use-locale'

defineOptions({
  name: 'BezierVisualizer',
})

const props = withDefaults(defineProps<{
  value: string
  width?: number
  height?: number
}>(), {
  width: 180,
  height: 180,
})

const locales = {
  cn: {
    open: '在 cubic-bezier.com 中打开',
  },
  en: {
    open: 'Open in cubic-bezier.com',
  },
}

const locale = useSemanticLocale(locales)

const { token } = theme.useToken()

// Parse cubic-bezier value
const RE = /^cubic-bezier\((.*)\)$/i

const controls = computed(() => {
  const m = RE.exec(props.value.toLowerCase().trim())
  if (m && m[1]) {
    const values = m[1].split(',').map(v => Number.parseFloat(v.trim()))
    if (values.length === 4 && values.every(v => !Number.isNaN(v))) {
      return values as [number, number, number, number]
    }
  }
  return null
})

// Coordinate transformation
function scale(val: number, axis: 'x' | 'y'): number {
  return axis === 'x' ? val * props.width : props.height - val * props.height
}

const gridStep = computed(() => props.width / 5)

const cubicBezierUrl = computed(() => {
  if (!controls.value)
    return ''
  return `https://cubic-bezier.com/#${controls.value.join(',')}`
})

// Generate unique pattern ID
const patternId = computed(() => `bezier-pattern-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <a-flex v-if="controls" vertical gap="small">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <title>Cubic Bezier Visualizer</title>

      <!-- Background -->
      <rect width="100%" height="100%" :fill="token.colorBgContainer" />

      <!-- Grid pattern -->
      <defs>
        <pattern
          :id="patternId"
          :width="gridStep"
          :height="gridStep"
          patternUnits="userSpaceOnUse"
        >
          <path
            :d="`
              M 0 0 H ${gridStep}
              M 0 0 V ${gridStep}
              M ${gridStep} 0 V ${gridStep}
              M 0 ${gridStep} H ${gridStep}
            `"
            :stroke="token.colorBorderSecondary"
            :stroke-width="token.controlOutlineWidth"
            shape-rendering="crispEdges"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${patternId})`" />

      <!-- Bezier curve path -->
      <path
        :d="`
          M 0 ${height}
          C ${scale(controls[0], 'x')} ${scale(controls[1], 'y')},
            ${scale(controls[2], 'x')} ${scale(controls[3], 'y')},
            ${width} 0
        `"
        fill="none"
        :stroke="token.colorPrimary"
        :stroke-width="(token.controlOutlineWidth || 1) * 2"
      />

      <!-- Control point lines (dashed) -->
      <path
        :d="`
          M 0 ${height}
          L ${scale(controls[0], 'x')} ${scale(controls[1], 'y')}
          L ${scale(controls[2], 'x')} ${scale(controls[3], 'y')}
          L ${width} 0
        `"
        fill="none"
        :stroke="token.colorPrimaryActive"
        stroke-dasharray="4 2"
        :stroke-width="token.controlOutlineWidth"
      />

      <!-- Control points -->
      <circle
        :cx="scale(controls[0], 'x')"
        :cy="scale(controls[1], 'y')"
        r="5"
        fill="#f5222d"
      />
      <circle
        :cx="scale(controls[2], 'x')"
        :cy="scale(controls[3], 'y')"
        r="5"
        fill="#52c41a"
      />
    </svg>

    <a-flex align="center">
      <a-typography-text>{{ value }}</a-typography-text>
      <a-tooltip :title="locale.open">
        <a-button
          type="link"
          :href="cubicBezierUrl"
          target="_blank"
        >
          <template #icon>
            <LinkOutlined />
          </template>
        </a-button>
      </a-tooltip>
    </a-flex>
  </a-flex>
</template>
