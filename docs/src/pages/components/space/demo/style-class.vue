<docs lang="zh-CN">
自定义语义化结构的样式和类名。支持对象和函数两种形式。
</docs>

<docs lang="en-US">
Customize semantic structure styles and class names. Supports both object and function forms.
</docs>

<script setup lang="ts">
import type { SpaceProps } from 'antdv-next'

const classesObject: SpaceProps['classes'] = {
  root: 'demo-space-root',
  item: 'demo-space-item',
  separator: 'demo-space-separator',
}

const classesFn: SpaceProps['classes'] = (info) => {
  if (info.props.orientation === 'vertical') {
    return {
      root: 'demo-space-root--vertical',
    } satisfies SpaceProps['classes']
  }
  else {
    return {
      root: 'demo-space-root--horizontal',
    } satisfies SpaceProps['classes']
  }
}

const stylesObject: SpaceProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed', padding: '8px', marginBottom: '10px' },
  item: { backgroundColor: '#f0f0f0', padding: '4px' },
  separator: { color: 'red', fontWeight: 'bold' },
}

const stylesFn: SpaceProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
        padding: '8px',
      },
    } satisfies SpaceProps['styles']
  }
  else {
    return {
      root: {
        backgroundColor: '#fff7e6',
        borderColor: '#fa8c16',
      },
    } satisfies SpaceProps['styles']
  }
}
</script>

<template>
  <div>
    <a-space :styles="stylesObject" :classes="classesObject" separator="•">
      <a-button>Styled Button 1</a-button>
      <a-button>Styled Button 2</a-button>
      <a-button>Styled Button 3</a-button>
    </a-space>
    <a-space size="large" :styles="stylesFn" :classes="classesFn">
      <a-button>Large Space Button 1</a-button>
      <a-button>Large Space Button 2</a-button>
      <a-button>Large Space Button 3</a-button>
    </a-space>
  </div>
</template>
