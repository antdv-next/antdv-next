<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Timeline 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Timeline by passing objects/functions through `classes` and `styles`.
</docs>

<script lang="ts" setup>
const classes = {
  root: 'custom-timeline-root',
}

const styles = {
  itemIcon: {
    borderColor: '#1890ff',
  },
}

function stylesFn(info: any) {
  if (info.props.orientation === 'vertical') {
    return {
      root: {
        padding: '10px 6px',
        border: '1px solid #A294F9',
      },
      itemIcon: {
        borderColor: '#A294F9',
      },
    }
  }
  return {}
}

const items = [
  {
    title: '2015-09-01',
    content: 'Create a services site',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Solve initial network problems',
  },
  {
    content: 'Technical testing',
  },
]
</script>

<template>
  <a-flex vertical gap="middle">
    <a-timeline :items="items" orientation="horizontal" :styles="styles" :classes="classes" />
    <a-timeline :items="items" orientation="vertical" :styles="stylesFn" :classes="classes" />
  </a-flex>
</template>

<style scoped>
.custom-timeline-root {
  padding: 8px;
  border-radius: 4px;
}
</style>
