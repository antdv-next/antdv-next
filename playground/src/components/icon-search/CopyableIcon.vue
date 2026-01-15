<script setup lang="ts">
import * as AntdIcons from '@antdv-next/icons/all'
import { message } from 'antdv-next'
import { computed } from 'vue'

type ThemeType = 'Filled' | 'Outlined' | 'TwoTone'

const props = defineProps<{
  name: string
  isNew: boolean
  theme: ThemeType
  justCopied: string | null
}>()

const emit = defineEmits<{
  (e: 'copied', type: string, text: string): void
}>()

const iconName = computed(() => `${props.name}`)

const iconComponent = computed(() => AntdIcons[iconName.value])

const copyText = computed(() => `<${iconName.value} />`)

const errorMessage = computed(() =>
  navigator.language && navigator.language.toLowerCase().startsWith('zh')
    ? '复制名称失败，请重试'
    : 'Copy icon name failed, please try again.',
)

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const result = document.execCommand('copy')
    document.body.removeChild(textarea)
    return result
  }
  catch {
    return false
  }
};

async function handleClick() {
  const ok = await copyToClipboard(copyText.value)
  if (ok) {
    emit('copied', props.name, copyText.value)
  }
  else {
    message.error(errorMessage.value)
  }
};
</script>

<template>
  <li
    class="icon-item"
    :class="[theme, { copied: justCopied === name }]"
    @click="handleClick"
  >
    <component :is="iconComponent" />
    <span class="anticon-cls">
      <a-badge :dot="isNew">
        {{ name }}
      </a-badge>
    </span>
  </li>
</template>

<style scoped>
.icon-item {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  padding-inline-end: 0;
  position: relative;
  width: 200px;
  height: 100px;
  overflow: hidden;
  color: #555;
  text-align: center;
  list-style: none;
  background-color: inherit;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.icon-item :deep(svg) {
  margin: 4px 0;
  font-size: 36px;
  transition: transform 0.3s ease-in-out;
  will-change: transform;
}

.icon-item:hover {
  color: #fff;
  background-color: #1677ff;
}

.icon-item:hover :deep(svg) {
  transform: scale(1.3);
}

.icon-item:hover :deep(.ant-badge) {
  color: #fff;
}

.icon-item.TwoTone:hover {
  background-color: #8ecafe;
}

.icon-item.copied:hover {
  color: rgba(255, 255, 255, 0.2);
}

.icon-item::after {
  content: 'Copied!';
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 100%;
  line-height: 100px;
  color: #fff;
  text-align: center;
  background-color: #1677ff;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.icon-item.copied::after {
  opacity: 1;
}

.anticon-cls {
  display: block;
  font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  white-space: nowrap;
  text-align: center;
  transform: scale(0.8);
}

.anticon-cls :deep(.ant-badge) {
  transition: color 0.3s ease-in-out;
}
</style>
