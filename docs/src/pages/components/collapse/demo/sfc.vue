<docs lang="zh-CN">
支持使用 `<a-collapse-panel>` 标签编写 SFC 模式。
</docs>

<docs lang="en-US">
Support SFC mode with `<a-collapse-panel>`.
</docs>

<script setup lang="ts">
function onChange(key: string[]) {
  console.log(key)
}
</script>

<template>
  <a-collapse :default-active-key="['1']" @change="onChange">
    <a-collapse-panel key="1" header="This is panel header 1">
      <p>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness.
      </p>
    </a-collapse-panel>
    <a-collapse-panel key="2">
      <template #header>
        <span>This is panel header 2</span>
      </template>
      <template #extra>
        <a-tag color="blue">
          Extra
        </a-tag>
      </template>
      <p>
        It can be found as a welcome guest in many households across the world.
      </p>
    </a-collapse-panel>
  </a-collapse>
</template>
