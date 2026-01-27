<docs lang="zh-CN">
受控多行文本省略。
</docs>

<docs lang="en-US">
Controlled multi line text omission.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref(2)
const expanded = ref(false)

const text = 'Antdv Next, a design language for background applications, is refined by Ant UED Team.'.repeat(20)

function handleExpand(_: MouseEvent, info: { expanded: boolean }) {
  expanded.value = info.expanded
}
</script>

<template>
  <a-flex :gap="16" vertical>
    <a-flex :gap="16" align="center">
      <a-switch v-model:checked="expanded" style="flex: none;" />
      <a-slider v-model:value="rows" :min="1" :max="20" style="flex: auto;" />
    </a-flex>

    <a-typography-paragraph
      :ellipsis="{
        rows,
        expandable: 'collapsible',
        expanded,
        onExpand: handleExpand,
      }"
      copyable
    >
      {{ text }}
    </a-typography-paragraph>
  </a-flex>
</template>
