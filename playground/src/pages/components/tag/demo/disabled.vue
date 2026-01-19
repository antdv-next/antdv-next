<docs lang="zh-CN">
设置 `disabled` 属性后，标签将不可用。
</docs>

<docs lang="en-US">
Set the `disabled` property to make the tag unusable.
</docs>

<script setup lang="ts">
  import { CheckCircleOutlined, CloseCircleOutlined } from '@antdv-next/icons'
  import { message } from 'antdv-next'
  import { ref } from 'vue'

  const selectedTags = ref<string[]>(['Books'])
  function handleClose(tagName: string) {
    console.log(`Tag ${tagName} closed`);
    message.info(`Tag ${tagName} closed`);
  };
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="small" wrap>
      <a-tag disabled>Basic Tag</a-tag>
      <a-tag disabled>
        <a href="https://ant.design">Link Tag</a>
      </a-tag>
      <a-tag disabled href="https://ant.design">
        Href Tag
      </a-tag>
      <a-tag disabled color="success">
        Icon Tag
        <template #icon>
          <CheckCircleOutlined />
        </template>
      </a-tag>
    </a-flex>
  </a-flex>

  <a-flex gap="small" wrap>
    <a-tag disabled color="red">
      Preset Color Red
    </a-tag>
    <a-tag disabled color="#f50">
      Custom Color #f50 Outlined
    </a-tag>
    <a-tag disabled color="#f50" variant="solid">
      Custom Color #f50 Filled
    </a-tag>
    <a-tag disabled color="#f50" variant="filled">
      Custom Color #f50 Borderless
    </a-tag>
    <a-tag disabled color="success">
      Preset Status Success
    </a-tag>
  </a-flex>

  <a-flex gap="small" wrap>
    <template v-for="tag in ['Books', 'Movies', 'Music']" :key="tag">
      <a-checkable-tag :checked="selectedTags.includes(tag)" disabled :value="selectedTags.includes(tag)">{{ tag }}</a-checkable-tag>
    </template>
  </a-flex>

  <a-flex gap="small" wrap>
    <a-tag disabled closable @close="() => handleClose('Closable')">
      Closable Tag
    </a-tag>
    <a-tag disabled closable color="success" @close="() => handleClose('Closable Success')">
    Closable with Icon
    <template #icon>
      <CheckCircleOutlined />
    </template>
    </a-tag>
    <a-tag disabled closable>
    Closable with Custom Icon
    <template #closeIcon>
      <CloseCircleOutlined />
    </template>
    </a-tag>
  </a-flex>

  <a-flex gap="small" wrap>
    <a-tag disabled variant="filled">
      Borderless Basic
    </a-tag>
    <a-tag disabled variant="filled" color="success">
      Borderless with Icon
      <template #icon>
        <CheckCircleOutlined />
      </template>
    </a-tag>
    <a-tag disabled variant="filled" closable @close="() => handleClose('Borderless Closable')">
      Borderless Closable
    </a-tag>
  </a-flex>
</template>

<style scoped></style>
