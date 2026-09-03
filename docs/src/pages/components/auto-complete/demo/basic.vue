<docs lang="zh-CN">
基本使用，通过 `options` 设置自动完成的数据源。
</docs>

<docs lang="en-US">
Basic Usage, set data source of autocomplete with `options` property.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref<{ value: string }[]>([])
const anotherOptions = ref<{ value: string }[]>([])

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) })

function getPanelValue(searchText: string) {
  return searchText
    ? [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    : []
}

function handleSearch(text: string) {
  options.value = getPanelValue(text)
}

function handleAnotherSearch(text: string) {
  anotherOptions.value = getPanelValue(text)
}

function handleSelect(data: string) {
  console.log('onSelect', data)
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-auto-complete
      :options="options"
      style="width: 200px"
      placeholder="input here"
      :show-search="{ onSearch: handleSearch }"
      @select="handleSelect"
    />
    <a-auto-complete
      v-model:value="value"
      :options="anotherOptions"
      style="width: 200px"
      placeholder="control mode"
      :show-search="{ onSearch: handleAnotherSearch }"
      @select="handleSelect"
    />
  </a-flex>
</template>
