<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { HomeRecommendIcon, HomeRecommendItem } from '@/config/home-recommends'
import { computed, onBeforeUnmount, shallowRef, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  item: HomeRecommendItem
  index: number
  icon?: HomeRecommendIcon
  cardClass?: string
}>()

const router = useRouter()
const cardRef = useTemplateRef<HTMLAnchorElement>('card')
const mouseX = shallowRef(0)
const mouseY = shallowRef(0)
const visualMouseX = shallowRef(0)
const visualMouseY = shallowRef(0)
let rafId = 0

const isHot = computed(() => props.index === 0)
const isExternalLink = computed(() => props.item.href.startsWith('https://'))
const cardStyle = computed<CSSProperties>(() => ({
  '--mouse-x': `${visualMouseX.value}px`,
  '--mouse-y': `${visualMouseY.value}px`,
}) as CSSProperties)

function stepMousePosition() {
  const deltaX = (mouseX.value - visualMouseX.value) * 0.1
  const deltaY = (mouseY.value - visualMouseY.value) * 0.1

  visualMouseX.value += deltaX
  visualMouseY.value += deltaY

  if (Math.abs(deltaX) >= 0.5 || Math.abs(deltaY) >= 0.5) {
    rafId = window.requestAnimationFrame(stepMousePosition)
  }
  else {
    rafId = 0
  }
}

function syncMousePosition(event: MouseEvent) {
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect)
    return

  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top

  if (!rafId)
    rafId = window.requestAnimationFrame(stepMousePosition)
}

function handleCardClick(event: MouseEvent) {
  if (isExternalLink.value)
    return

  event.preventDefault()
  router.push(props.item.href)
}

function handleCardKeydown(event: KeyboardEvent) {
  if (isExternalLink.value)
    return

  event.preventDefault()
  router.push(props.item.href)
}

onBeforeUnmount(() => {
  if (rafId)
    window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <a-badge-ribbon
    v-if="isHot"
    text="HOT"
    color="red"
    root-class="antdv-home-recommend-ribbon"
  >
    <a
      ref="card"
      :href="isExternalLink ? item.href : undefined"
      :target="isExternalLink ? '_blank' : undefined"
      :rel="isExternalLink ? 'noopener noreferrer' : undefined"
      class="antdv-home-recommend-card"
      :class="cardClass"
      :style="cardStyle"
      tabindex="0"
      role="link"
      @click="handleCardClick"
      @mousemove="syncMousePosition"
      @keydown.enter="handleCardKeydown"
      @keydown.space="handleCardKeydown"
    >
      <a-typography-title :level="5" class="antdv-home-recommend-title">
        {{ item.title }}
      </a-typography-title>
      <a-typography-paragraph type="secondary" class="antdv-home-recommend-description">
        {{ item.description }}
      </a-typography-paragraph>
      <a-flex justify="space-between" align="center" class="antdv-home-recommend-footer">
        <a-typography-text class="antdv-home-recommend-date">
          {{ item.date }}
        </a-typography-text>
        <img
          v-if="icon?.href"
          :src="icon.href"
          :alt="item.source"
          draggable="false"
          class="antdv-home-recommend-source"
        >
      </a-flex>
    </a>
  </a-badge-ribbon>

  <a
    v-else
    ref="card"
    :href="isExternalLink ? item.href : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    class="antdv-home-recommend-card"
    :class="cardClass"
    :style="cardStyle"
    tabindex="0"
    role="link"
    @click="handleCardClick"
    @mousemove="syncMousePosition"
    @keydown.enter="handleCardKeydown"
    @keydown.space="handleCardKeydown"
  >
    <a-typography-title :level="5" class="antdv-home-recommend-title">
      {{ item.title }}
    </a-typography-title>
    <a-typography-paragraph type="secondary" class="antdv-home-recommend-description">
      {{ item.description }}
    </a-typography-paragraph>
    <a-flex justify="space-between" align="center" class="antdv-home-recommend-footer">
      <a-typography-text class="antdv-home-recommend-date">
        {{ item.date }}
      </a-typography-text>
      <img
        v-if="icon?.href"
        :src="icon.href"
        :alt="item.source"
        draggable="false"
        class="antdv-home-recommend-source"
      >
    </a-flex>
  </a>
</template>

<style scoped>
.antdv-home-recommend-card {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: stretch;
  min-height: 178px;
  padding-block: var(--ant-padding-md);
  padding-inline: var(--ant-padding-lg);
  position: relative;
  box-sizing: border-box;
  text-align: start;
  text-decoration: none;
  color: inherit;
  background: color-mix(in srgb, var(--ant-color-bg-container) 30%, transparent);
  backdrop-filter: blur(8px);
  border: var(--ant-line-width) solid var(--ant-color-border-secondary);
  border-radius: var(--ant-border-radius-lg);
  transition: all var(--ant-motion-duration-slow);
}

.antdv-home-recommend-card::before {
  content: '';
  position: absolute;
  inset: calc(var(--ant-line-width) * -1);
  padding: 1px;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    circle 150px at var(--mouse-x, 0) var(--mouse-y, 0),
    var(--ant-color-primary-border-hover),
    var(--ant-color-border-secondary)
  );

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;

  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;

  transition: opacity 0.3s ease;
}

.antdv-home-recommend-card:hover {
  color: inherit;
  background: color-mix(in srgb, var(--ant-color-bg-container) 90%, transparent);
  backdrop-filter: blur(0);
}

.antdv-home-recommend-card:hover::before {
  opacity: 1;
}

.antdv-home-recommend-title {
  margin-block: 0 var(--ant-margin-xs) !important;
}

.antdv-home-recommend-description {
  flex: auto;
  margin-bottom: var(--ant-margin-md) !important;
}

.antdv-home-recommend-footer {
  margin-top: auto;
}

.antdv-home-recommend-date {
  color: var(--ant-color-text);
}

.antdv-home-recommend-source {
  height: var(--ant-font-size);
  max-width: 96px;
  object-fit: contain;
}
</style>
