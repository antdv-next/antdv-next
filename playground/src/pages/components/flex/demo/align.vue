<docs lang="zh-CN">设置对齐方式。</docs>

<docs lang="en-US">Set align.</docs>

<template>
  <a-flex gap="middle" align="start" vertical>
    <p>Select justify :</p>
    <a-segmented v-model:value="justify" :options="justifyOptions" />
    <p>Select align :</p>
    <a-segmented v-model:value="alignItems" :options="alignOptions" />
    <a-flex :style="{ ...boxStyle }" :justify="justify" :align="alignItems">
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { ref } from 'vue';

  const justifyOptions = [
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ];

  const alignOptions = ['flex-start', 'center', 'flex-end'];
  const justify = ref(justifyOptions[0]);
  const alignItems = ref(alignOptions[0]);
  const boxStyle: CSSProperties = {
    width: '100%',
    height: '120px',
    borderRadius: '6px',
    border: '1px solid #40a9ff',
  };
</script>
