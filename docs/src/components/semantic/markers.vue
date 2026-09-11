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

interface Bounds {
  left: number
  top: number
  right: number
  bottom: number
}

const CLIPPING_OVERFLOWS = new Set(['auto', 'clip', 'hidden', 'scroll'])

function getBounds(element: HTMLElement): Bounds {
  const rect = element.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  }
}

function intersectBounds(first: Bounds, second: Bounds): Bounds | null {
  const bounds = {
    left: Math.max(first.left, second.left),
    top: Math.max(first.top, second.top),
    right: Math.min(first.right, second.right),
    bottom: Math.min(first.bottom, second.bottom),
  }

  return bounds.right > bounds.left && bounds.bottom > bounds.top ? bounds : null
}

function isStyleVisible(element: HTMLElement, container: HTMLElement): boolean {
  let currentElement: HTMLElement | null = element

  while (currentElement) {
    const style = window.getComputedStyle(currentElement)
    const opacity = Number.parseFloat(style.opacity)

    if (
      style.display === 'none'
      || style.visibility === 'hidden'
      || style.visibility === 'collapse'
      || opacity === 0
    ) {
      return false
    }

    if (currentElement === container) {
      break
    }

    currentElement = currentElement.parentElement
  }

  return true
}

function isClippingElement(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return CLIPPING_OVERFLOWS.has(style.overflowX) || CLIPPING_OVERFLOWS.has(style.overflowY)
}

function getVisibleBounds(
  element: HTMLElement,
  container: HTMLElement,
  containerBounds: Bounds,
  elementBounds = getBounds(element),
): Bounds | null {
  if (!element.isConnected || !isStyleVisible(element, container)) {
    return null
  }

  let bounds = intersectBounds(elementBounds, containerBounds)
  if (!bounds) {
    return null
  }

  let currentElement = element.parentElement
  while (currentElement && currentElement !== container && bounds) {
    if (isClippingElement(currentElement)) {
      bounds = intersectBounds(bounds, getBounds(currentElement))
    }
    currentElement = currentElement.parentElement
  }

  return bounds
}

watch(
  [() => props.targetClassName, () => props.containerRef],
  () => {
    const container = props.containerRef
    if (!container) {
      rectList.value = []
      return
    }

    const targetElements = props.targetClassName
      ? Array.from(container.querySelectorAll<HTMLElement>(`.${props.targetClassName}`))
      : []

    const containerBounds = getBounds(container)

    const targetRectList = targetElements.flatMap<RectType>((targetElement) => {
      const elementBounds = getBounds(targetElement)
      const visibleBounds = getVisibleBounds(targetElement, container, containerBounds, elementBounds)
      if (!visibleBounds) {
        return []
      }

      return {
        left: elementBounds.left - containerBounds.left,
        top: elementBounds.top - containerBounds.top,
        width: elementBounds.right - elementBounds.left,
        height: elementBounds.bottom - elementBounds.top,
        visible: true,
      }
    })

    // Merge with previous rects for smooth transitions
    rectList.value = Array.from({
      length: Math.max(rectList.value.length, targetRectList.length),
    }).map<RectType>((_, index) => {
      const prevRect = rectList.value[index]
      const nextRect = targetRectList[index]
      return {
        left: nextRect?.left ?? prevRect?.left ?? 0,
        top: nextRect?.top ?? prevRect?.top ?? 0,
        width: nextRect?.width ?? prevRect?.width ?? 0,
        height: nextRect?.height ?? prevRect?.height ?? 0,
        visible: !!nextRect?.visible,
      }
    })
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <template v-for="(rect, index) in rectList" :key="`marker-${index}`">
    <Marker :rect="rect" :primary="index === 0" />
  </template>
</template>
