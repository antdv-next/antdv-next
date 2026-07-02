<docs lang="zh-CN">
当存在多个表单时，给 `useForm` 传入与 `Form` 的 `name` 相同的名称即可按名称连接，无需模板 ref。这样可以在一个组件里同时操作多个表单。
</docs>

<docs lang="en-US">
With multiple forms, pass the same `name` to `useForm` as the `Form`'s `name` to connect by name—no template ref needed. This lets you control several forms from one component.
</docs>

<script setup lang="ts">
import { useForm } from 'antdv-next'
import { reactive } from 'vue'

// 按 name 连接：useForm('xxx') 对应 <a-form name="xxx">
const loginForm = useForm('login')
const profileForm = useForm('profile')

const loginModel = reactive({ username: '', password: '' })
const profileModel = reactive({ nickname: '', bio: '' })

async function syncNickname() {
  // 跨表单读取：把登录用户名同步到资料昵称
  const { username } = await loginForm.validateFields()
  profileForm.setFieldsValue({ nickname: username })
}

function resetAll() {
  loginForm.resetFields()
  profileForm.resetFields()
}
</script>

<template>
  <a-space direction="vertical" size="large" style="width: 100%; max-width: 520px">
    <a-card title="Login" size="small">
      <a-form
        name="login"
        :model="loginModel"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item name="username" label="Username" :rules="[{ required: true }]">
          <a-input v-model:value="loginModel.username" />
        </a-form-item>
        <a-form-item name="password" label="Password">
          <a-input-password v-model:value="loginModel.password" />
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="Profile" size="small">
      <a-form
        name="profile"
        :model="profileModel"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item name="nickname" label="Nickname">
          <a-input v-model:value="profileModel.nickname" />
        </a-form-item>
        <a-form-item name="bio" label="Bio">
          <a-input v-model:value="profileModel.bio" />
        </a-form-item>
      </a-form>
    </a-card>

    <a-space>
      <a-button type="primary" @click="syncNickname">
        Sync username → nickname
      </a-button>
      <a-button @click="resetAll">
        Reset all
      </a-button>
    </a-space>
  </a-space>
</template>
