<docs lang="zh-CN">
通过 `color` 配置单色字符串或渐变停靠点数组，可以为流光指定主题。`percent` 使用 `0 ~ 100` 的输入区间，组件内部会自动为尾部透明过渡预留空间。
</docs>

<docs lang="en-US">
Use the `color` prop to feed BorderBeam a solid color string or an array of gradient stops. `percent` accepts values from `0` to `100`; BorderBeam reserves tail space for the transparent fade automatically.
</docs>

<script setup lang="ts">
import type { BorderBeamGradient } from 'antdv-next'
import { computed, ref } from 'vue'

interface Preset {
  key: string
  name: string
  usage: string
  description: string
  color: BorderBeamGradient
}

const presets: Preset[] = [
  {
    key: 'ocean',
    name: 'Ocean',
    usage: 'Dashboard',
    description: 'A calm blue-green accent that works well for data views and cloud tooling.',
    color: [
      { color: '#1677ff', percent: 0 },
      { color: '#36cfc9', percent: 52 },
      { color: '#95de64', percent: 100 },
    ],
  },
  {
    key: 'sunset',
    name: 'Sunset',
    usage: 'Upgrade',
    description: 'A warm highlight for upgrade prompts, featured cards, and marketing blocks.',
    color: [
      { color: '#ff7a45', percent: 0 },
      { color: '#ff4d4f', percent: 49 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
  {
    key: 'aurora',
    name: 'Aurora',
    usage: 'AI',
    description: 'A vivid cool-toned beam suited for AI assistants, copilots, and automation panels.',
    color: [
      { color: '#7c3aed', percent: 0 },
      { color: '#06b6d4', percent: 57 },
      { color: '#67e8f9', percent: 100 },
    ],
  },
  {
    key: 'forest',
    name: 'Forest',
    usage: 'Recommendation',
    description: 'A bright natural palette that feels good on recommendation and growth-oriented cards.',
    color: [
      { color: '#22c55e', percent: 0 },
      { color: '#a3e635', percent: 54 },
      { color: '#facc15', percent: 100 },
    ],
  },
  {
    key: 'ember',
    name: 'Ember',
    usage: 'Alert',
    description: 'A high-energy warm gradient for important alerts, launch cards, and hot paths.',
    color: [
      { color: '#fa541c', percent: 0 },
      { color: '#ff7875', percent: 46 },
      { color: '#ffd666', percent: 100 },
    ],
  },
  {
    key: 'nebula',
    name: 'Nebula',
    usage: 'Labs',
    description: 'A cool purple-pink mix that fits experimental modules and product lab surfaces.',
    color: [
      { color: '#2f54eb', percent: 0 },
      { color: '#722ed1', percent: 44 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
]

const currentKey = ref<string>(presets[0].key)
const currentPreset = computed(() => presets.find(item => item.key === currentKey.value) ?? presets[0])
const segmentOptions = computed(() => presets.map(preset => ({ label: preset.name, value: preset.key })))
</script>

<template>
  <a-flex vertical :gap="16" :style="{ maxWidth: '480px' }">
    <a-segmented
      v-model:value="currentKey"
      block
      :options="segmentOptions"
    />
    <a-border-beam :color="currentPreset.color">
      <a-card
        :title="currentPreset.name"
        :styles="{ body: { display: 'flex', flexDirection: 'column', gap: '16px' } }"
      >
        <template #extra>
          <a-tag variant="filled">
            {{ currentPreset.usage }}
          </a-tag>
        </template>
        <a-typography-text type="secondary">
          {{ currentPreset.description }}
        </a-typography-text>
        <a-flex :gap="8" wrap>
          <a-tag
            v-for="item in currentPreset.color"
            :key="`${item.color}-${item.percent}`"
            :color="item.color"
            variant="filled"
          >
            {{ item.color }} · {{ item.percent }}%
          </a-tag>
        </a-flex>
        <a-typography-text type="secondary">
          Stop positions use the public 0-100 input range.
        </a-typography-text>
      </a-card>
    </a-border-beam>
  </a-flex>
</template>
