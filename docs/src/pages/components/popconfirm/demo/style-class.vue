<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Popconfirm 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Popconfirm by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { PopconfirmProps } from 'antdv-next'

const classes: PopconfirmProps['classes'] = {
  container: 'demo-popconfirm-container',
}

const stylesObject: PopconfirmProps['styles'] = {
  container: {
    backgroundColor: '#eee',
    boxShadow: 'inset 5px 5px 3px #fff, inset -5px -5px 3px #ddd, 0 0 3px rgba(0,0,0,0.2)',
  },
  title: {
    color: '#262626',
  },
  content: {
    color: '#262626',
  },
}

const stylesFn: PopconfirmProps['styles'] = (info) => {
  if (info?.props?.arrow === false) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        borderRadius: '4px',
      },
      title: {
        color: '#fff',
      },
      content: {
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="medium">
    <a-popconfirm
      title="Object text"
      description="Object description"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    >
      <a-button>Object Style</a-button>
    </a-popconfirm>
    <a-popconfirm
      title="Function text"
      description="Function description"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
      :ok-button-props="{ styles: { root: { backgroundColor: 'rgba(53, 71, 125, 0.6)', color: '#fff' } } }"
      :cancel-button-props="{ styles: { root: { borderColor: 'rgba(53, 71, 125, 0.6)', backgroundColor: '#fff', color: 'rgba(53, 71, 125, 0.8)' } } }"
    >
      <a-button type="primary">
        Function Style
      </a-button>
    </a-popconfirm>
  </a-flex>
</template>

<style>
.demo-popconfirm-container {
  padding: 10px;
}
</style>
