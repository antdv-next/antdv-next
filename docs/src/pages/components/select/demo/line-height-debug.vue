<docs lang="zh-CN">
`lineHeight` 被覆盖时，选中文本应该采用该行高，而组件高度保持 `controlHeight`。
</docs>

<docs lang="en-US">
Selected text should follow an overridden `lineHeight` while the control keeps its `controlHeight`.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const options = [{ value: 'light', label: 'Light' }]
const value = shallowRef('light')
const multipleValue = shallowRef(['light'])
</script>

<template>
  <a-flex vertical gap="middle">
    <a-config-provider :theme="{ token: { lineHeight: 2 } }">
      <a-flex vertical gap="small">
        <strong>Global lineHeight: 2</strong>
        <a-flex gap="small" wrap>
          <a-select v-model:value="value" :options="options" style="width: 180px" />
          <a-select v-model:value="multipleValue" mode="multiple" :options="options" style="width: 180px" />
          <a-select v-model:value="value" size="small" :options="options" style="width: 180px" />
          <a-select v-model:value="multipleValue" size="small" mode="multiple" :options="options" style="width: 180px" />
        </a-flex>
      </a-flex>
    </a-config-provider>

    <a-config-provider :theme="{ token: { lineHeightLG: 2 } }">
      <a-flex vertical gap="small">
        <strong>Global lineHeightLG: 2</strong>
        <a-flex gap="small" wrap>
          <a-select v-model:value="value" size="large" :options="options" style="width: 180px" />
          <a-select v-model:value="multipleValue" size="large" mode="multiple" :options="options" style="width: 180px" />
        </a-flex>
      </a-flex>
    </a-config-provider>

    <a-config-provider :theme="{ components: { Select: { lineHeight: 2 } } }">
      <a-flex vertical gap="small">
        <strong>Component lineHeight: 2</strong>
        <a-flex gap="small" wrap>
          <a-select v-model:value="value" :options="options" style="width: 180px" />
          <a-select v-model:value="multipleValue" mode="multiple" :options="options" style="width: 180px" />
          <a-select v-model:value="value" size="small" :options="options" style="width: 180px" />
          <a-select v-model:value="multipleValue" size="small" mode="multiple" :options="options" style="width: 180px" />
        </a-flex>
      </a-flex>
    </a-config-provider>
  </a-flex>
</template>
