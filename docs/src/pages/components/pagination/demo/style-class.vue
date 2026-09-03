<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Pagination 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Pagination by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { PaginationProps } from 'antdv-next'
import { useCssModule } from 'vue'

const moduleStyles = useCssModule()

const classes: PaginationProps['classes'] = {
  root: moduleStyles.root,
}

const stylesObject: PaginationProps['styles'] = {
  item: {
    borderRadius: '999px',
  },
}

const stylesFn: PaginationProps['styles'] = ({ props }) => {
  if (props.size === 'small') {
    return {
      item: {
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        marginInlineEnd: '4px',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-pagination :total="500" :classes="classes" :styles="stylesObject" />
    <a-pagination :total="500" size="small" :classes="classes" :styles="stylesFn" />
  </a-flex>
</template>

<style module>
.root {
  border: 2px dashed #ccc;
  padding: 8px;
}
</style>
