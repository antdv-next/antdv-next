<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Checkbox 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Checkbox by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CheckboxProps } from 'antdv-next'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const checked = ref(true)
const { token } = theme.useToken()

// Object styles — 静态样式对象
const stylesObject: CheckboxProps['styles'] = {
  icon: {
    borderRadius: '6px',
  },
  label: {
    color: 'blue',
  },
}

// Function classes — 根据 checked 状态动态返回类名
const classesFn: CheckboxProps['classes'] = (info) => {
  const base: Record<string, string> = {
    root: 'checkbox-demo-root',
    icon: 'checkbox-demo-icon',
    label: 'checkbox-demo-label',
  }
  if (info.props.checked) {
    return {
      root: base.root,
      icon: `${base.icon} checkbox-demo-icon-checked`,
      label: `${base.label} checkbox-demo-label-checked`,
    }
  }
  return base
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-checkbox :styles="stylesObject">
      Object styles
    </a-checkbox>
    <a-checkbox
      v-model:checked="checked"
      :classes="classesFn"
    >
      Function classes
    </a-checkbox>
  </a-flex>
</template>

<style>
.checkbox-demo-root {
  border-radius: v-bind('`${token.borderRadius}px`');
  background-color: v-bind('token.colorBgContainer');
}

.checkbox-demo-icon {
  border-color: v-bind('token.colorWarning') !important;
}

.checkbox-demo-icon-checked {
  background-color: v-bind('token.colorWarning') !important;
  border-color: v-bind('token.colorWarning') !important;
}

.checkbox-demo-label {
  color: v-bind('token.colorTextDisabled') !important;
  font-weight: bold;
}

.checkbox-demo-label-checked {
  color: v-bind('token.colorWarning') !important;
}
</style>
