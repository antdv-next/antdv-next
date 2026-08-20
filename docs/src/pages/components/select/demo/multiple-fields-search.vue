<docs lang="zh-CN">
使用 `optionFilterProp` 的多字段搜索，通过传入字符串数组可以对多个字段进行 OR 匹配搜索。
例如搜索 `b11` 会同时匹配 `label` 和 `otherField` 字段。
</docs>

<docs lang="en-US">
Multiple field search using `optionFilterProp`. By passing a string array, multiple fields are searched with OR matching.
For example, searching `b11` will match both `label` and `otherField` fields.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef<string>()

const options = [
  { value: 'a11', label: 'a11', otherField: 'c11' },
  { value: 'b22', label: 'b22', otherField: 'b11' },
  { value: 'c33', label: 'c33', otherField: 'b33' },
  { value: 'd44', label: 'd44', otherField: 'd44' },
]
</script>

<template>
  <a-flex vertical gap="middle">
    <div>
      <div style="margin-bottom: 8px;">
        通过 <code>showSearch</code> 对象传入（对齐 React API）：
      </div>
      <a-select
        v-model:value="value"
        placeholder="Select an option"
        style="width: 200px"
        :options="options"
        :show-search="{ optionFilterProp: ['label', 'otherField'] }"
      />
    </div>
    <div>
      <div style="margin-bottom: 8px;">
        通过顶层 <code>optionFilterProp</code> 传入：
      </div>
      <a-select
        placeholder="Select an option"
        style="width: 200px"
        show-search
        :option-filter-prop="['label', 'otherField']"
        :options="options"
      />
    </div>
  </a-flex>
</template>
