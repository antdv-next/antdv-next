<docs lang="zh-CN">
一个带有远程搜索、防抖、请求顺序控制和加载状态的多选示例。
</docs>

<docs lang="en-US">
A complete multiple select sample with remote search, debounce fetch, ajax callback order flow, and loading state.
</docs>

<script setup lang="ts">
import { debounce } from 'es-toolkit'
import { shallowRef } from 'vue'

interface UserValue {
  label: string
  value: string
  avatar?: string
}

const value = shallowRef<UserValue[]>([])
const options = shallowRef<UserValue[]>([])
const fetching = shallowRef(false)

let fetchId = 0

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log('fetching user', username)
  return fetch(`https://660d2bd96ddfa2943b33731c.mockapi.io/api/users/?search=${username}`)
    .then(res => res.json())
    .then((res) => {
      const results = Array.isArray(res) ? res : []
      return results.map((user: { name: string, id: string, avatar: string }) => ({
        label: user.name,
        value: user.id,
        avatar: user.avatar,
      }))
    })
}

const debounceFetcher = debounce((val: string) => {
  fetchId += 1
  const currentFetchId = fetchId
  options.value = []
  fetching.value = true

  fetchUserList(val).then((newOptions) => {
    if (currentFetchId !== fetchId) {
      return
    }
    options.value = newOptions
    fetching.value = false
  })
}, 300)

function handleSearch(val: string) {
  debounceFetcher(val)
}
</script>

<template>
  <a-select
    v-model:value="value"
    mode="multiple"
    label-in-value
    show-search
    :auto-clear-search-value="false"
    :filter-option="false"
    placeholder="Select users"
    style="width: 100%"
    :options="options"
    @search="handleSearch"
  >
    <template #notFoundContent>
      <a-spin v-if="fetching" size="small" />
      <span v-else>No results found</span>
    </template>
    <template #optionRender="{ option }">
      <div style="display: flex; align-items: center">
        <a-avatar v-if="option.data.avatar" :src="option.data.avatar" style="margin-right: 8px" />
        {{ option.data.label }}
      </div>
    </template>
  </a-select>
</template>
