<docs lang="zh-CN">
可选 `outlined` `filled` `borderless` `underlined` 四种形态。
</docs>

<docs lang="en-US">
There are `outlined`, `filled`, `borderless`, and `underlined` variants to choose from.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref<{ value: string }[]>([])

const mockVal = (str: string, repeat = 1) => ({ value: str.repeat(repeat) })

function getPanelValue(searchText: string) {
  return searchText
    ? [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    : []
}

function handleSearch(text: string) {
  options.value = getPanelValue(text)
}

function handleSelect(value: string) {
  console.log('onSelect', value)
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-auto-complete
      :options="options"
      style="width: 200px"
      placeholder="Outlined"
      :show-search="{ onSearch: handleSearch }"
      @select="handleSelect"
    />
    <a-auto-complete
      :options="options"
      style="width: 200px"
      placeholder="Filled"
      :show-search="{ onSearch: handleSearch }"
      variant="filled"
      @select="handleSelect"
    />
    <a-auto-complete
      :options="options"
      style="width: 200px"
      placeholder="Borderless"
      :show-search="{ onSearch: handleSearch }"
      variant="borderless"
      @select="handleSelect"
    />
    <a-auto-complete
      :options="options"
      style="width: 200px"
      placeholder="Underlined"
      :show-search="{ onSearch: handleSearch }"
      variant="underlined"
      @select="handleSelect"
    />
  </a-flex>
</template>
