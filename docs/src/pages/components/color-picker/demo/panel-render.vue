<docs lang="zh-CN">
通过 `panelRender` 自由控制面板的渲染。
</docs>

<docs lang="en-US">
Rendering of the free control panel via `panelRender`.
</docs>

<script setup lang="ts">
import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors'
import { theme } from 'antdv-next'
import { computed, shallowRef } from 'vue'

const { useToken } = theme
const { token } = useToken()

const color = shallowRef('#1677ff')
const layoutColor = shallowRef(token.value.colorPrimary)

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }))
}

const presets = computed<any[]>(() => genPresets({
  primary: generate(token.value.colorPrimary),
  red,
  green,
  cyan,
}))
</script>

<template>
  <a-space vertical>
    <a-space>
      <span>Add title:</span>
      <a-color-picker v-model:value="color">
        <template #panelRender="{ panel }">
          <div class="custom-panel">
            <div style="font-size: 12px;color: rgba(0,0,0,.88);line-height: 20px;margin-bottom: 8px">
              Color Picker
            </div>
            <component :is="panel" />
          </div>
        </template>
      </a-color-picker>
    </a-space>
    <a-space>
      <span>Horizontal layout:</span>
      <a-color-picker
        v-model:value="layoutColor"
        :styles="{ popup: { container: { width: '480px' } } }"
        :presets="presets"
      >
        <template #panelRender="{ extra: { components } }">
          <a-row justify="space-between" :wrap="false">
            <a-col :span="12">
              <component :is="components.Presets" />
            </a-col>
            <a-divider vertical style="height: auto" />
            <a-col flex="auto">
              <component :is="components.Picker" />
            </a-col>
          </a-row>
        </template>
      </a-color-picker>
    </a-space>
  </a-space>
</template>

<style>
.custom-panel {
  width: 100%;
}
</style>
