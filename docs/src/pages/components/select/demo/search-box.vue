<docs lang="zh-CN">
搜索和远程数据结合。
</docs>

<docs lang="en-US">
Search with remote data.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

interface OptionItem {
  value: string
  label: string
}

let timeout: ReturnType<typeof setTimeout> | null = null
let currentValue = ''

const data = shallowRef<OptionItem[]>([])
const value = shallowRef<string>()

function fetchData(val: string, callback: (data: OptionItem[]) => void) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = val

  const params = new URLSearchParams({ code: 'utf-8', q: val })

  const fake = () => {
    fetch(`https://suggest.taobao.com/sug?${params.toString()}`)
      .then(response => response.json())
      .then(({ result }) => {
        if (currentValue === val) {
          const options = result.map((item: string[]) => ({
            value: item[0],
            label: item[0],
          }))
          callback(options)
        }
      })
  }

  if (val) {
    timeout = setTimeout(fake, 300)
  }
  else {
    callback([])
  }
}

function handleSearch(val: string) {
  fetchData(val, (options) => {
    data.value = options
  })
}
</script>

<template>
  <a-select
    v-model:value="value"
    show-search
    :filter-option="false"
    placeholder="input search text"
    style="width: 200px"
    :default-active-first-option="false"
    :suffix="null"
    :not-found-content="null"
    :options="data"
    @search="handleSearch"
  />
</template>
