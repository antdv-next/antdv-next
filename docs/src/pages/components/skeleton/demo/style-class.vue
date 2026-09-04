<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象或者函数可以自定义 Skeleton 组件的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Skeleton by passing objects or functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
const classes = {
  root: 'skeleton-root',
  header: 'skeleton-header',
}

const styles = {
  avatar: {
    border: '1px solid #aaa',
  },
  title: {
    border: '1px solid #aaa',
  },
}

function stylesFn(info: { props: { active?: boolean } }) {
  if (info.props?.active) {
    return {
      root: {
        border: '1px solid rgba(229, 243, 254, 0.3)',
      },
      title: {
        backgroundColor: 'rgba(229, 243, 254, 0.5)',
        height: '20px',
        borderRadius: '20px',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="medium">
    <a-skeleton
      :classes="classes"
      :styles="styles"
      avatar
      :paragraph="false"
    />
    <a-skeleton
      :classes="{ ...classes, paragraph: 'skeleton-paragraph' }"
      :styles="stylesFn"
      active
    />
  </a-flex>
</template>

<style scoped>
.skeleton-root {
  border-radius: 10px;
  padding: 12px;
}

.skeleton-header {
  margin-bottom: 12px;
}

.skeleton-paragraph > li {
  background-color: rgba(229, 243, 254, 0.5);
}
</style>
