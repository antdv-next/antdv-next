<docs lang="zh-CN">
实色填底的单选按钮样式。
</docs>

<docs lang="en-US">
Solid radio button style.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef('a')
</script>

<template>
  <a-flex vertical gap="medium">
    <a-radio-group v-model:value="value" button-style="solid">
      <a-radio-button value="a">
        Hangzhou
      </a-radio-button>
      <a-radio-button value="b">
        Shanghai
      </a-radio-button>
      <a-radio-button value="c">
        Beijing
      </a-radio-button>
      <a-radio-button value="d">
        Chengdu
      </a-radio-button>
    </a-radio-group>
    <a-radio-group v-model:value="value" button-style="solid">
      <a-radio-button value="a">
        Hangzhou
      </a-radio-button>
      <a-radio-button value="b" disabled>
        Shanghai
      </a-radio-button>
      <a-radio-button value="c">
        Beijing
      </a-radio-button>
      <a-radio-button value="d">
        Chengdu
      </a-radio-button>
    </a-radio-group>
  </a-flex>
</template>
