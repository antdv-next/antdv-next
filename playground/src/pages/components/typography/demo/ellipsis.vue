<docs lang="zh-CN">
多行文本省略。你可以通过 `tooltip` 属性配置省略展示内容，大量文本时推荐优先使用 `expandable`。
</docs>

<docs lang="en-US">
Multiple line ellipsis support. You can use `tooltip` to configure ellipsis tooltip. The `expandable` property is recommended when you have lots of content.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const ellipsis = ref(true)
</script>

<template>
  <a-switch v-model:checked="ellipsis" />

  <a-typography-paragraph :ellipsis="ellipsis">
    Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team.
  </a-typography-paragraph>

  <a-typography-paragraph :ellipsis="ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false">
    Antdv Next, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team. Ant
    Design, a design language for background applications, is refined by Ant UED Team.
  </a-typography-paragraph>

  <a-typography-text
    :style="ellipsis ? { width: '200px' } : undefined"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
  >
    Antdv Next, a design language for background applications, is refined by Ant UED Team.
  </a-typography-text>

  <a-typography-text
    code
    :style="ellipsis ? { width: '200px' } : undefined"
    :ellipsis="ellipsis ? { tooltip: 'I am ellipsis now!' } : false"
  >
    Antdv Next, a design language for background applications, is refined by Ant UED Team.
  </a-typography-text>
</template>
