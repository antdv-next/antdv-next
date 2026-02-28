<docs lang="zh-CN">
[查询模式: 不确定类目](https://ant.design/docs/spec/reaction#lookup-patterns) 示例。
</docs>

<docs lang="en-US">
Demonstration of [Lookup Patterns: Uncertain Category](https://ant.design/docs/spec/reaction#lookup-patterns).
</docs>

<script setup lang="ts">
import { h, ref } from 'vue'

const getRandomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min

function searchResult(query: string) {
  return Array.from({ length: getRandomInt(5) }).map((_, idx) => {
    const category = `${query}${idx}`
    return {
      value: category,
      label: h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
          },
        },
        [
          h('span', [
            `Found ${query} on `,
            h(
              'a',
              {
                href: `https://s.taobao.com/search?q=${query}`,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              category,
            ),
          ]),
          h('span', `${getRandomInt(200, 100)} results`),
        ],
      ),
    }
  })
}

const options = ref<{ value: string, label: any }[]>([])

function handleSearch(value: string) {
  options.value = value ? searchResult(value) : []
}

function handleSelect(value: string) {
  console.log('onSelect', value)
}
</script>

<template>
  <a-auto-complete
    :popup-match-select-width="252"
    style="width: 300px"
    :options="options"
    placeholder="input here"
    :show-search="{ onSearch: handleSearch }"
    @select="handleSelect"
  >
    <a-input-search size="large" placeholder="input here" enter-button />
  </a-auto-complete>
</template>
