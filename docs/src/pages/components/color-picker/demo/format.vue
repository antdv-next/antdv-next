<docs lang="zh-CN">
编码格式，支持 `HEX`、`HSB`、`RGB`。
</docs>

<docs lang="en-US">
Encoding formats, support `HEX`, `HSB`, `RGB`.
</docs>

<script setup lang="ts">
import type { ColorPickerProps, ColorValueType } from 'antdv-next'
import { computed, shallowRef } from 'vue'

type Color = Extract<ColorValueType, string | { cleared: any }>

type FormatType = ColorPickerProps['format']

const colorHex = shallowRef<Color>('#1677ff')
const formatHex = shallowRef<FormatType>('hex')

const hexString = computed(() => {
  return typeof colorHex.value === 'string' ? colorHex.value : colorHex.value?.toHexString?.() ?? ''
})

const colorHsb = shallowRef<Color>('hsb(215, 91%, 100%)')
const formatHsb = shallowRef<FormatType>('hsb')

const hsbString = computed(() => {
  return typeof colorHsb.value === 'string' ? colorHsb.value : colorHsb.value?.toHsbString?.() ?? ''
})

const colorRgb = shallowRef<Color>('rgb(22, 119, 255)')
const formatRgb = shallowRef<FormatType>('rgb')

const rgbString = computed(() => {
  return typeof colorRgb.value === 'string' ? colorRgb.value : colorRgb.value?.toRgbString?.() ?? ''
})
</script>

<template>
  <a-space vertical size="medium" style="display: flex">
    <a-space>
      <a-color-picker
        v-model:value="colorHex"
        v-model:format="formatHex"
      />
      <span>HEX: {{ hexString }}</span>
    </a-space>
    <a-space>
      <a-color-picker
        v-model:value="colorHsb"
        v-model:format="formatHsb"
      />
      <span>HSB: {{ hsbString }}</span>
    </a-space>
    <a-space>
      <a-color-picker
        v-model:value="colorRgb"
        v-model:format="formatRgb"
      />
      <span>RGB: {{ rgbString }}</span>
    </a-space>
  </a-space>
</template>
