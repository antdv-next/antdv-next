<docs lang="zh-CN">
自定义间距大小。
</docs>

<docs lang="en-US">
Customize space size.
</docs>

<script setup lang="ts">
import type { SizeType } from 'antdv-next'
import { ref } from 'vue'

const size = ref<SizeType | 'customize'>('small')
const customizeSize = ref(0)
</script>

<template>
  <a-radio-group v-model:value="size">
    <a-radio value="small">
      Small
    </a-radio>
    <a-radio value="medium">
      Medium
    </a-radio>
    <a-radio value="large">
      Large
    </a-radio>
    <a-radio value="customize">
      Customize
    </a-radio>
  </a-radio-group>

  <br>
  <br>

  <template v-if="size === 'customize'">
    <a-slider v-model:value="customizeSize" />
    <br>
  </template>

  <a-space :size="size === 'customize' ? customizeSize : size">
    <a-button type="primary">
      Primary
    </a-button>
    <a-button>Default</a-button>
    <a-button type="dashed">
      Dashed
    </a-button>
    <a-button type="link">
      Link
    </a-button>
  </a-space>
</template>
