<docs lang="zh-CN">
通过切换布局展示表单的三种排列方式。

`horizontal` 布局默认会在视口宽度不超过 `575px` 时将标签和控件上下排列，以适应窄屏。可通过 `labelCol` 和 `wrapperCol` 的 `xs` 配置自定义窄屏下的列宽。
</docs>

<docs lang="en-US">
Switch between horizontal, vertical, and inline layouts.

By default, the `horizontal` layout stacks labels above controls when the viewport width is `575px` or less to accommodate narrow screens. Use the `xs` settings in `labelCol` and `wrapperCol` to customize column widths on narrow screens.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: '',
})
</script>

<template>
  <a-form
    :model="model"
    :layout="model.layout as any"
    :style="{ maxWidth: model.layout === 'inline' ? 'none' : '600px' }"
  >
    <a-form-item label="Form Layout" name="layout">
      <a-radio-group v-model:value="model.layout">
        <a-radio-button value="horizontal">
          Horizontal
        </a-radio-button>
        <a-radio-button value="vertical">
          Vertical
        </a-radio-button>
        <a-radio-button value="inline">
          Inline
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Field A" name="fieldA">
      <a-input v-model:value="model.fieldA" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item label="Field B" name="fieldB">
      <a-input v-model:value="model.fieldB" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
