<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 AutoComplete 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of AutoComplete by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const stylesObject = {
  popup: {
    root: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#1890ff',
    },
    list: {
      backgroundColor: 'rgba(240, 240, 240, 0.85)',
    },
    listItem: {
      color: '#272727',
    },
  },
}

function stylesFn({ props }: { props: { variant?: string } }) {
  if (props.variant === 'filled') {
    return {
      popup: {
        root: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#ccc',
        },
        list: {
          backgroundColor: 'rgba(240, 240, 240, 0.85)',
        },
        listItem: {
          color: '#272727',
        },
      },
    }
  }
  return {}
}

const options = [
  { value: 'Burnaby' },
  { value: 'Seattle' },
  { value: 'Los Angeles' },
  { value: 'San Francisco' },
  { value: 'Meet student' },
]

const sharedProps = {
  options,
  classes: {
    root: 'auto-complete-style-root',
  },
  style: { width: '200px' },
}

const value = ref('')
</script>

<template>
  <a-flex vertical gap="medium">
    <a-auto-complete v-model:value="value" v-bind="sharedProps" placeholder="object styles" :styles="stylesObject" />
    <a-auto-complete
      v-model:value="value"
      v-bind="sharedProps"
      placeholder="function styles"
      :styles="stylesFn"
      variant="filled"
    />
  </a-flex>
</template>

<style>
.auto-complete-style-root {
  border-radius: 4px;
}
</style>
