<docs lang="zh-CN">
按钮样式的单选组合。
</docs>

<docs lang="en-US">
The combination of radio button style.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef('a')
</script>

<template>
  <a-flex vertical gap="medium">
    <a-radio-group v-model:value="value">
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
    <a-radio-group v-model:value="value">
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
    <a-radio-group v-model:value="value" disabled>
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
  </a-flex>
</template>
