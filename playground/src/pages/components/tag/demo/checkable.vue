<docs lang="zh-CN">
可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。而 `CheckableTagGroup` 则提供了类似 `CheckboxGroup` 或 `RadioGroup` 的功能。
</docs>

<docs lang="en-US">
`CheckableTag` works like Checkbox, click it to toggle checked state. `CheckableTagGroup` provides function that is similar to `CheckboxGroup` or `RadioGroup`.
</docs>

<script setup lang="ts">
  import { ref } from 'vue'

  const tagsData = ['Movies', 'Books', 'Music', 'Sports']
  const checked = ref(true)
  const singleSelected = ref('Books')
  const multipleSelected = ref<string[]>(['Movies', 'Music'])
</script>

<template>
  <a-form :label-col="{ span: 6 }">
    <a-form-item label="Checkable">
      <a-checkable-tag :checked="checked" @change="checked = !checked">Yes</a-checkable-tag>
    </a-form-item>
    <a-form-item label="Single">
      <a-checkable-tag-group :checked="singleSelected" :options="tagsData" v-model:value="singleSelected" />
    </a-form-item>
    <a-form-item label="Multiple">
      <a-checkable-tag-group multiple :checked="multipleSelected" :options="tagsData" v-model:value="multipleSelected" />
    </a-form-item>
  </a-form>
</template>
