<docs lang="zh-CN">
`message` 传入渲染函数时，错误提示在渲染时才求值。切换语言后，已经显示的校验信息会自动更新，且不会重新触发校验。
</docs>

<docs lang="en-US">
When `message` is a render function, the error text is evaluated at render time. Switching the locale updates messages that are already displayed, without re-running validation.
</docs>

<script setup lang="ts">
import type { Rule } from 'antdv-next'
import { reactive, ref } from 'vue'

const locale = ref<'en' | 'zh'>('en')

const messages = {
  username: { en: 'Please input your username', zh: '请输入用户名' },
  email: { en: 'Please input a valid email', zh: '请输入合法的邮箱' },
} as const

const model = reactive({
  username: '',
  email: '',
})

const usernameRules: Rule[] = [
  { required: true, message: () => messages.username[locale.value] },
]
const emailRules: Rule[] = [
  { required: true, type: 'email', message: () => messages.email[locale.value] },
]
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-radio-group v-model:value="locale">
      <a-radio value="en">
        English
      </a-radio>
      <a-radio value="zh">
        中文
      </a-radio>
    </a-radio-group>
    <a-form layout="vertical" :model="model" style="max-width: 600px">
      <a-form-item name="username" label="Username" :rules="usernameRules">
        <a-input v-model:value="model.username" placeholder="username" />
      </a-form-item>
      <a-form-item name="email" label="Email" :rules="emailRules">
        <a-input v-model:value="model.email" placeholder="email" />
      </a-form-item>
      <a-form-item :label="null">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </a-space>
</template>
