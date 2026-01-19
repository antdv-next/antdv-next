<docs lang="zh-CN">
用数组生成一组标签，可以动态添加和删除。
</docs>

<docs lang="en-US">
Generating a set of Tags by array, you can add and remove dynamically.
</docs>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { PlusOutlined } from '@antdv-next/icons';
  import { theme } from 'antdv-next'
  import { ref, watch } from 'vue'

  const tagInputStyle: CSSProperties = {
    width: '64px',
    height: '22px',
    marginInlineEnd: '8px',
    verticalAlign: 'top',
  }
  const { token } = theme.useToken()
  const tags = ref<string[]>(['Unremovable', 'Tag 2', 'Tag 3'])
  const inputVisible = ref(false)
  const inputValue = ref('')
  const editInputIndex = ref(-1)
  const editInputValue = ref('')
  const inputRef = ref()
  const editInputRef = ref()

  watch(inputVisible, (val: boolean) => {
    if (val) {
      inputRef.value?.$el?.focus()
    }
  })
  watch(editInputIndex, () => {
    editInputRef.value?.$el?.focus()
  })
  function handleClose(removedTag: string) {
    tags.value = tags.value.filter(tag => tag !== removedTag)
  }
  function showInput() {
    inputVisible.value = true
  }
  function handleInputConfirm() {
    if (inputValue.value && !tags.value.includes(inputValue.value)) {
      tags.value = [...tags.value, inputValue.value]
    }
    inputVisible.value = false
    inputValue.value = ''
  }
  function handleEditInputConfirm() {
    const newTags = [...tags.value];
    newTags[editInputIndex.value] = editInputValue.value;
    tags.value = newTags;
    editInputIndex.value = -1;
    editInputValue.value = '';
  }
  const tagPlusStyle:CSSProperties = {
    height: '22px',
    background: token.value?.colorBgContainer,
    borderStyle: 'dashed',
  }
</script>

<template>
  <a-flex gap="small" align="center" wrap>
    <template v-for="(tag, index) in tags">
      <template v-if="index === editInputIndex">
        <a-input
          :key="tag"
          ref="editInputRef"
          v-model:value="editInputValue"
          size="small"
          @blur="handleEditInputConfirm"
          @press.enter="handleEditInputConfirm"
          :style="tagInputStyle"
        />
      </template>
      <template v-if="tag.length > 20">
        <a-tooltip :title="tag" :key="tag">
          <a-tag :key="tag" :closable="index !== 0" @close="handleClose(tag)" style="user-select: none;">
            <span
             @doubleClick="(e: MouseEvent) => {
              if (index !== 0) {
                editInputIndex = index
                editInputValue = tag
                e.preventDefault()
              }
            }">{{ `${tag.slice(0, 20)}...` }}</span>
          </a-tag>
        </a-tooltip>
      </template>
      <template v-else>
        <a-tag :key="tag" :closable="index !== 0" @close="handleClose(tag)" style="user-select: none;">
          <span
           @doubleClick="(e: MouseEvent) => {
            if (index !== 0) {
              editInputIndex = index
              editInputValue = tag
              e.preventDefault()
            }
          }">{{ tag }}</span>
        </a-tag>
      </template>
    </template>
    <template v-if="inputVisible">
      <a-input
        ref="inputRef"
        v-model:value="inputValue"
        type="text" size="small"
        @blur="handleInputConfirm"
        @press.enter="handleInputConfirm"
        :style="tagInputStyle"
      />
    </template>
    <template v-else>
      <a-tag :style="tagPlusStyle" @click="showInput">
        <PlusOutlined />
        New Tag
      </a-tag>
    </template>
  </a-flex>
</template>

<style scoped></style>
