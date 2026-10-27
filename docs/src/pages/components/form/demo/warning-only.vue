<docs lang="zh-CN">
使用 warningOnly 规则展示非阻塞提示。
</docs>

<docs lang="en-US">
Use warningOnly rules without blocking submit.
</docs>

<script setup lang="ts">
import type { FormInstance, Rule } from 'antdv-next'
import { message } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  url: '',
})

const rules: Rule[] = [
  { required: true },
  { type: 'url', warningOnly: true },
  { type: 'string', min: 6 },
]

function handleFinish() {
  message.success('Submit success!')
}

function handleFinishFailed() {
  message.error('Submit failed!')
}

function handleFill() {
  formRef.value?.setFieldsValue?.({ url: 'https://taobao.com/' })
}
</script>

<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :model="model"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item name="url" label="URL" :rules="rules">
      <a-input v-model:value="model.url" placeholder="input placeholder" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleFill">
          Fill
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
