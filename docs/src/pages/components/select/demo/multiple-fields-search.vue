<docs lang="zh-CN">
多字段搜索，使用 `showSearch.optionFilterProp` 传入数组对多个字段进行匹配。
</docs>

<docs lang="en-US">
Multiple fields search with `showSearch.optionFilterProp` as array.
</docs>

<script setup lang="ts">
const options = [
  { value: 'a11', label: 'a11', otherField: 'c11' },
  { value: 'b22', label: 'b22', otherField: 'b11' },
  { value: 'c33', label: 'c33', otherField: 'b33' },
  { value: 'd44', label: 'd44', otherField: 'd44' },
]
</script>

<template>
  <a-select
    placeholder="Select an option"
    style="width: 200px"
    :show-search="{ optionFilterProp: ['label', 'otherField'] }"
    :options="options"
  />
</template>
