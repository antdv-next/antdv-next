<docs lang="zh-CN">
你可以通过 `icon` 插槽为标签添加自定义图标
</docs>

<docs lang="en-US">
You can add a custom icon to the tag via the `icon` slot.
</docs>

<script setup lang="ts">
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, YoutubeOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const checked = ref<[boolean, boolean, boolean, boolean]>([true, false, false, false])

function handleChange(index: number, value: boolean) {
  checked.value[index] = value
}
</script>

<template>
  <a-divider title-placement="start">
    Tag with icon
  </a-divider>
  <a-flex gap="small" wrap align="center">
    <a-tag color="#55acee">
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </a-tag>
    <a-tag color="#cd201f">
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </a-tag>
    <a-tag color="#3b5999">
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </a-tag>
    <a-tag color="#55acee">
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </a-tag>
  </a-flex>
  <a-divider title-placement="start">
    CheckableTag with icon
  </a-divider>
  <a-flex gap="small" wrap align="center">
    <a-checkable-tag
      :checked="checked[0]"
      @change="(value: boolean) => handleChange(0, value)"
    >
      <template #icon>
        <TwitterOutlined />
      </template>
      Twitter
    </a-checkable-tag>
    <a-checkable-tag
      :checked="checked[1]"
      @change="(value: boolean) => handleChange(1, value)"
    >
      <template #icon>
        <YoutubeOutlined />
      </template>
      Youtube
    </a-checkable-tag>
    <a-checkable-tag
      :checked="checked[2]"
      @change="(value: boolean) => handleChange(2, value)"
    >
      <template #icon>
        <FacebookOutlined />
      </template>
      Facebook
    </a-checkable-tag>
    <a-checkable-tag
      :checked="checked[3]"
      @change="(value: boolean) => handleChange(3, value)"
    >
      <template #icon>
        <LinkedinOutlined />
      </template>
      LinkedIn
    </a-checkable-tag>
  </a-flex>
</template>
