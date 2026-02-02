<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'SemanticMarker',
})

const props = withDefaults(defineProps<{
  rect: RectType
  primary?: boolean
}>(), {
  primary: false,
})

export interface RectType {
  left: number
  top: number
  width: number
  height: number
  visible: boolean
}

const { token } = theme.useToken()

// Keep track of last visible rect for smooth transitions
const rectRef = ref<RectType>(props.rect)
watch(
  () => props.rect,
  (newRect) => {
    if (newRect.visible) {
      rectRef.value = newRect
    }
  },
  { immediate: true },
)

const visible = ref(false)
watch(
  () => props.rect.visible,
  (newVisible) => {
    visible.value = newVisible
  },
  { immediate: true },
)

const markerStyle = computed(() => ({
  '--rect-left': rectRef.value.left,
  '--rect-top': rectRef.value.top,
  '--rect-width': rectRef.value.width,
  '--rect-height': rectRef.value.height,
  '--mark-border-size': props.primary && visible.value ? '2px' : '1px',
  '--motion-duration': token.value.motionDurationSlow,
  '--color-warning': token.value.colorWarning,
}))
</script>

<template>
  <div
    class="semantic-marker"
    :class="{
      'semantic-marker-active': visible,
      'semantic-marker-primary': primary,
    }"
    :style="markerStyle"
  />
</template>

<style scoped>
.semantic-marker {
  position: absolute;
  border: var(--mark-border-size) solid var(--color-warning);
  box-sizing: border-box;
  z-index: 999999;
  pointer-events: none;
  left: calc(var(--rect-left) * 1px - var(--mark-border-size));
  top: calc(var(--rect-top) * 1px - var(--mark-border-size));
  width: calc(var(--rect-width) * 1px + var(--mark-border-size) * 2);
  height: calc(var(--rect-height) * 1px + var(--mark-border-size) * 2);
  opacity: 0;
  transition: all var(--motion-duration) ease;
}

.semantic-marker-active {
  opacity: 0.85;
}

.semantic-marker-primary.semantic-marker-active {
  opacity: 1;
  box-shadow: 0 0 0 1px #fff;
  z-index: 1000000;
}
</style>
