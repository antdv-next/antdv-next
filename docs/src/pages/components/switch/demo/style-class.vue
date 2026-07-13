<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Switch 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Switch by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes = {
  root: 'custom-switch-root',
}

const stylesObject = {
  root: {
    backgroundColor: '#F5D2D2',
  },
}

function stylesFn(info: any) {
  if (info.props.size === 'medium') {
    return {
      root: {
        backgroundColor: '#BDE3C3',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical align="flex-start" justify="flex-start" gap="medium">
    <a-switch
      size="small"
      checked-children="on"
      un-checked-children="off"
      :styles="stylesObject"
      :classes="{ root: 'custom-switch-root' }"
    />
    <a-switch
      size="medium"
      checked-children="on"
      un-checked-children="off"
      :styles="stylesFn"
      :classes="classes"
    />
    <a-switch
      default-checked
      :classes="{ root: 'mui-root', indicator: 'mui-indicator' }"
    />
  </a-flex>
</template>

<style scoped>
.custom-switch-root {
  width: 40px;
  background-color: v-bind('token.colorPrimary');
}

.mui-root {
  min-width: 32px;
  height: 14px;
  line-height: 14px;
}

.mui-root.mui-root.ant-switch-checked {
  background-color: rgb(25 118 210 / 50%);
}

.mui-root.mui-root.ant-switch-checked :deep(.ant-switch-handle) {
  inset-inline-start: calc(100% - 17px);
}

:deep(.mui-indicator) {
  top: -3px;
  width: 20px;
  height: 20px;
}

:deep(.mui-indicator.mui-indicator.mui-indicator) {
  inset-inline-start: -3px;
}

:deep(.mui-indicator.mui-indicator.mui-indicator)::before {
  background-color: rgb(25 118 210);
  border-radius: 999px;
  box-shadow:
    rgba(0, 0, 0, 0.2) 0 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0 1px 1px 0,
    rgba(0, 0, 0, 0.12) 0 1px 4px 0;
}
</style>
