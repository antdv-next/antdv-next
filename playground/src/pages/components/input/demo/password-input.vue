<docs lang="zh-CN">
密码框。
</docs>

<docs lang="en-US">
Input type of password.
</docs>

<script setup lang="ts">
import { EyeInvisibleOutlined, EyeTwoTone } from '@antdv-next/icons'
import { ref } from 'vue'

const passwordVisible = ref(false)
</script>

<template>
  <a-space direction="vertical">
    <a-input-password placeholder="input password" />
    <a-input-password placeholder="input password">
      <template #iconRender="{ visible }">
        <EyeTwoTone v-if="visible" />
        <EyeInvisibleOutlined v-else />
      </template>
    </a-input-password>
    <a-space>
      <a-input-password
        placeholder="input password"
        :visibility-toggle="{ visible: passwordVisible, onVisibleChange: (v: boolean) => passwordVisible = v }"
      />
      <a-button style="width: 80px;" @click="passwordVisible = !passwordVisible">
        {{ passwordVisible ? 'Hide' : 'Show' }}
      </a-button>
    </a-space>
    <a-input-password disabled placeholder="disabled input password" />
  </a-space>
</template>
