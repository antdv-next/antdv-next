<docs lang="zh-CN">
带有搜索按钮的输入框。
</docs>

<docs lang="en-US">
Example of creating a search box by grouping a standard input with a search button.
</docs>

<script setup lang="ts">
import { AudioOutlined } from '@antdv-next/icons'

function onSearch(value: string, _e?: Event, info?: { source?: string }) {
  console.log(info?.source, value)
}
</script>

<template>
  <a-space direction="vertical">
    <a-input-search placeholder="input search text" style="width: 200px;" @search="onSearch" />
    <a-input-search placeholder="input search text" allow-clear style="width: 200px;" @search="onSearch" />
    <a-space-compact>
      <a-space-addon>https://</a-space-addon>
      <a-input-search placeholder="input search text" allow-clear @search="onSearch" />
    </a-space-compact>

    <a-input-search placeholder="input search text" enter-button @search="onSearch" />
    <a-input-search
      placeholder="input search text"
      allow-clear
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <a-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    >
      <template #suffix>
        <AudioOutlined style="font-size: 16px; color: #1677ff;" />
      </template>
    </a-input-search>
  </a-space>
</template>
