<docs lang="zh-CN">
通过 `theme.token.focusOutline` 全局关闭组件聚焦时的可见描边。用 Tab 键在下面的控件间移动即可对比效果。
</docs>

<docs lang="en-US">
Turn off the visible focus outline of all components globally with `theme.token.focusOutline`. Move across the controls below with the Tab key to compare.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const focusOutline = ref(true)

const themeConfig = computed(() => ({
  token: {
    focusOutline: focusOutline.value,
  },
}))

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'orange', label: 'Orange' },
  { value: 'banana', label: 'Banana' },
]

const current = ref(0)

function onStepChange(value: number) {
  current.value = value
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-space>
      focusOutline
      <a-switch v-model:checked="focusOutline" />
    </a-space>

    <a-config-provider :theme="themeConfig">
      <a-space direction="vertical" style="width: 100%">
        <a-input placeholder="Outlined" style="max-width: 240px" />
        <a-input variant="borderless" placeholder="Borderless" style="max-width: 240px" />
        <a-select :options="options" variant="borderless" placeholder="Borderless select" style="width: 240px" />
        <a-rate :default-value="3" />
        <a-steps
          :current="current"
          :items="[{ title: 'First' }, { title: 'Second' }, { title: 'Third' }]"
          @change="onStepChange"
        />
        <a-splitter style="height: 100px; border: 1px solid var(--ant-color-border)">
          <a-splitter-panel collapsible>
            First
          </a-splitter-panel>
          <a-splitter-panel>
            Second
          </a-splitter-panel>
        </a-splitter>
        <a-button>Button</a-button>
      </a-space>
    </a-config-provider>
  </a-space>
</template>
