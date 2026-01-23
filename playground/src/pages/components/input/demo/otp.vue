<docs lang="zh-CN">
一次性密码输入框。
</docs>

<docs lang="en-US">
One time password input.
</docs>

<script setup lang="ts">
function onChange(text: string) {
  console.log('onChange:', text)
}

function onInput(value: string) {
  console.log('onInput:', value)
}
</script>

<template>
  <a-flex gap="middle" align="flex-start" vertical>
    <a-typography-title :level="5">
      With formatter (Upcase)
    </a-typography-title>
    <a-input-otp :formatter="(str: string) => str.toUpperCase()" @change="onChange" @input="onInput" />

    <a-typography-title :level="5">
      With Disabled
    </a-typography-title>
    <a-input-otp disabled @change="onChange" @input="onInput" />

    <a-typography-title :level="5">
      With Length (8)
    </a-typography-title>
    <a-input-otp :length="8" @change="onChange" @input="onInput" />

    <a-typography-title :level="5">
      With variant
    </a-typography-title>
    <a-input-otp variant="filled" @change="onChange" @input="onInput" />

    <a-typography-title :level="5">
      With custom display character
    </a-typography-title>
    <a-input-otp mask="🔒" @change="onChange" @input="onInput" />

    <a-typography-title :level="5">
      With custom ReactNode separator
    </a-typography-title>
    <a-input-otp @change="onChange" @input="onInput">
      <template #separator>
        <span>/</span>
      </template>
    </a-input-otp>

    <a-typography-title :level="5">
      With custom function separator
    </a-typography-title>
    <a-input-otp @change="onChange" @input="onInput">
      <template #separator="{ index }">
        <span :style="{ color: index & 1 ? 'red' : 'blue' }">—</span>
      </template>
    </a-input-otp>
  </a-flex>
</template>
