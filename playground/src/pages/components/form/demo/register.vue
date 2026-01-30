<docs lang="zh-CN">
注册表单示例。
</docs>

<docs lang="en-US">
Registration form example.
</docs>

<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { computed, reactive, ref, shallowRef, watch } from 'vue'

const formRef = shallowRef<FormInstance>()

const model = reactive({
  email: '',
  password: '',
  confirm: '',
  nickname: '',
  residence: ['zhejiang', 'hangzhou', 'xihu'],
  phone: '',
  prefix: '86',
  website: '',
  age: 18,
  agreement: false,
})

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const prefixOptions = [
  { label: '+86', value: '86' },
  { label: '+87', value: '87' },
]

const autoCompleteResult = ref<string[]>([])

function onWebsiteChange(value: string) {
  autoCompleteResult.value = value
    ? ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
    : []
}

const websiteOptions = computed(() =>
  autoCompleteResult.value.map(website => ({ value: website })),
)

watch(
  () => model.password,
  () => {
    if (model.confirm) {
      formRef.value?.validateFields?.(['confirm'])
    }
  },
)

const confirmRules = [
  { required: true, message: 'Please confirm your password!' },
  {
    validator: async (_rule: any, value: string) => {
      if (!value || value === model.password) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('The new password that you entered do not match!'))
    },
  },
]

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <a-form
    ref="formRef"
    name="register"
    :model="model"
    :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
    style="max-width: 600px"
    scroll-to-first-error
    @finish="handleFinish"
  >
    <a-form-item
      name="email"
      label="E-mail"
      :rules="[
        { type: 'email', message: 'The input is not valid E-mail!' },
        { required: true, message: 'Please input your E-mail!' },
      ]"
    >
      <a-input v-model:value="model.email" />
    </a-form-item>

    <a-form-item
      name="password"
      label="Password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
      has-feedback
    >
      <a-input-password v-model:value="model.password" />
    </a-form-item>

    <a-form-item name="confirm" label="Confirm Password" :rules="confirmRules" has-feedback>
      <a-input-password v-model:value="model.confirm" />
    </a-form-item>

    <a-form-item
      name="nickname"
      label="Nickname"
      tooltip="What do you want others to call you?"
      :rules="[{ required: true, message: 'Please input your nickname!' }]"
    >
      <a-input v-model:value="model.nickname" />
    </a-form-item>

    <a-form-item
      name="residence"
      label="Habitual Residence"
      :rules="[{ required: true, message: 'Please select your habitual residence!' }]"
    >
      <a-cascader v-model:value="model.residence" :options="residences" />
    </a-form-item>

    <a-form-item name="phone" label="Phone Number" :rules="[{ required: true, message: 'Please input your phone number!' }]">
      <a-input v-model:value="model.phone" style="width: 100%">
        <template #addonBefore>
          <a-select v-model:value="model.prefix" style="width: 70px" :options="prefixOptions" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="website" label="Website" :rules="[{ required: true, message: 'Please input website!' }]">
      <a-auto-complete
        v-model:value="model.website"
        placeholder="website"
        :options="websiteOptions"
        @change="onWebsiteChange"
      />
    </a-form-item>

    <a-form-item name="age" :required="true" label="Age" :rules="[{ type: 'number', min: 0, max: 120 }]">
      <a-input-number v-model:value="model.age" style="width: 100%" />
    </a-form-item>

    <a-form-item name="agreement" :wrapper-col="{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }">
      <a-checkbox v-model:checked="model.agreement">
        I have read the <a href="">agreement</a>
      </a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }">
      <a-button type="primary" html-type="submit">
        Register
      </a-button>
    </a-form-item>
  </a-form>
</template>
