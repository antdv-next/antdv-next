<script setup lang="ts">
import { FastColor } from '@ant-design/fast-color'
import { Popover, theme } from 'antdv-next'
import { computed } from 'vue'

defineOptions({
  name: 'ColorChunk',
})

const props = defineProps<{
  value: string
  enablePopover?: boolean
}>()

const { token } = theme.useToken()
const dotColor = computed(() => new FastColor(props.value).toHexString())

const styles = computed(() => ({
  codeSpan: {
    padding: '0.2em 0.4em',
    fontSize: '0.9em',
    background: token.value.colorFillQuaternary,
    borderRadius: `${token.value.borderRadiusSM}px`,
    fontFamily: 'monospace',
    border: `1px solid ${token.value.colorSplit}`,
  },
  dot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    marginInlineEnd: `${token.value.marginXXS}px`,
    backgroundColor: dotColor.value,
    border: `1px solid ${token.value.colorSplit}`,
  },
}))
</script>

<template>
  <Popover
    v-if="enablePopover"
    placement="left"
    :styles="{
      container: {
        padding: 0,
        backgroundColor: dotColor,
        width: 120,
        height: 120,
        borderRadius: token.borderRadiusLG,
      },
      root: {
        '--antd-arrow-background-color': dotColor,
        'backgroundColor': 'transparent',
      },

    }"
  >
    <template #content>
      <div
        :style="{
          backgroundColor: dotColor,
          width: '120px',
          height: '120px',
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      />
    </template>
    <span :style="styles.codeSpan">
      <span :style="styles.dot" />
      <slot>{{ dotColor }}</slot>
    </span>
  </Popover>
  <span v-else :style="styles.codeSpan">
    <span :style="styles.dot" />
    <slot>{{ dotColor }}</slot>
  </span>
</template>
