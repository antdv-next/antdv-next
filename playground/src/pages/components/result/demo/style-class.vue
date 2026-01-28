<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Result 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Result by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { ResultProps } from 'antdv-next'

const classesObject: ResultProps['classes'] = {
  root: 'demo-result-root',
  title: 'demo-result-title',
  subTitle: 'demo-result-subtitle',
  icon: 'demo-result-icon',
  extra: 'demo-result-extra',
  body: 'demo-result-body',
}

const classesFn: ResultProps['classes'] = (info) => {
  if (info.props.status === 'success') {
    return {
      root: 'demo-result-root--success',
    } satisfies ResultProps['classes']
  }
  return {
    root: 'demo-result-root--default',
  } satisfies ResultProps['classes']
}

const stylesObject: ResultProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed', padding: '16px' },
  title: { fontStyle: 'italic', color: '#1890ff' },
  subTitle: { fontWeight: 'bold' },
  icon: { opacity: 0.8 },
  extra: { backgroundColor: '#f0f0f0', padding: 'px' },
  body: { backgroundColor: '#fafafa', padding: '12px' },
}

const stylesFn: ResultProps['styles'] = (info) => {
  if (info.props.status === 'error') {
    return {
      root: { backgroundColor: '#fff2f0', borderColor: '#ff4d4f' },
      title: { color: '#ff4d4f' },
    } satisfies ResultProps['styles']
  }
  else {
    return {
      root: { backgroundColor: '#f6ffed', borderColor: '#52c41a' },
      title: { color: '#52c41a' },
    } satisfies ResultProps['styles']
  }
}
</script>

<template>
  <a-result
    status="info"
    title="classes Object"
    sub-title="This is a subtitle"
    :styles="stylesObject"
    :classes="classesObject"
  >
    <template #extra>
      <a-button type="primary">
        Action
      </a-button>
    </template>
    <div>Content area</div>
  </a-result>
  <a-result
    status="success"
    title="classes Function"
    sub-title="Dynamic class names"
    :styles="stylesFn"
    :classes="classesFn"
  >
    <template #extra>
      <a-button type="primary">
        Action
      </a-button>
    </template>
  </a-result>
</template>
