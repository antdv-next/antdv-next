<docs lang="zh-CN">
使用嵌套路径为字段命名。
</docs>

<docs lang="en-US">
Use nested paths for field names.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

interface Address {
  city: string
  street: string
}

const model = reactive({
  user: {
    name: '',
    contact: {
      email: '',
    },
  },
  addresses: [
    { city: '', street: '' },
  ] as [Address],
})
</script>

<template>
  <a-form layout="vertical" :model="model" style="max-width: 600px">
    <a-form-item :name="['user', 'name']" label="User Name" :rules="[{ required: true }]">
      <a-input v-model:value="model.user.name" />
    </a-form-item>
    <a-form-item :name="['user', 'contact', 'email']" label="Email" :rules="[{ type: 'email' }]">
      <a-input v-model:value="model.user.contact.email" />
    </a-form-item>
    <a-form-item label="Address">
      <a-space direction="vertical" style="width: 100%">
        <a-form-item :name="['addresses', 0, 'city']" label="City" :rules="[{ required: true }]">
          <a-input v-model:value="model.addresses[0].city" />
        </a-form-item>
        <a-form-item :name="['addresses', 0, 'street']" label="Street">
          <a-input v-model:value="model.addresses[0].street" />
        </a-form-item>
      </a-space>
    </a-form-item>
  </a-form>
</template>
