<script setup lang="ts">
import type { RectType } from './index'
import { ref, watch } from 'vue'
import Marker from './marker.vue'

defineOptions({
  name: 'SemanticMarkers',
})

const props = defineProps<{
  targetClassName: string | null
  containerRef: HTMLDivElement | null
}>()

const rectList = ref<RectType[]>([])

// Check if element is visible (simplified version)
function isVisible(element: HTMLElement): boolean {
  if (!element)
    return false
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
}

watch(
  [() => props.targetClassName, () => props.containerRef],
  () => {
    const container = props.containerRef
    if (!container) {
      rectList.value = []
      return
    }

    const allElements = props.targetClassName
      ? Array.from(container.querySelectorAll<HTMLElement>(`.${props.targetClassName}`))
      : []

    // Filter out elements with opacity 0 in parent chain
    const targetElements = allElements.filter((element) => {
      let currentElement: HTMLElement | null = element
      let count = 0

      while (currentElement && count <= 5) {
        const computedStyle = window.getComputedStyle(currentElement)
        const opacity = Number.parseFloat(computedStyle.opacity)

        if (opacity === 0) {
          return false
        }

        currentElement = currentElement.parentElement
        count++
      }

      return true
    })

    const containerRect = container.getBoundingClientRect()

    const targetRectList = targetElements.map<RectType>((targetElement) => {
      const rect = targetElement.getBoundingClientRect()

      return {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
        visible: isVisible(targetElement),
      }
    })

    // Merge with previous rects for smooth transitions
    rectList.value = Array.from({
      length: Math.max(rectList.value.length, targetRectList.length),
    }).map<RectType>((_, index) => {
      const prevRect = rectList.value[index] || {}
      const nextRect = targetRectList[index] || {}
      return {
        left: nextRect.left ?? prevRect.left ?? 0,
        top: nextRect.top ?? prevRect.top ?? 0,
        width: nextRect.width ?? prevRect.width ?? 0,
        height: nextRect.height ?? prevRect.height ?? 0,
        visible: !!nextRect.visible,
      }
    })
  },
  { immediate: true },
)
</script>

<template>
  <template v-for="(rect, index) in rectList" :key="`marker-${index}`">
    <Marker :rect="rect" :primary="index === 0" />
  </template>
</template>
