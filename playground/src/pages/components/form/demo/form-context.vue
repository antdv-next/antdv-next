<docs lang="zh-CN">
多表单协作示例。
</docs>

<docs lang="en-US">
Coordinate data between multiple forms.
</docs>

<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { SmileOutlined, UserOutlined } from '@antdv-next/icons'
import { reactive, ref, shallowRef } from 'vue'

interface UserType { name: string, age: number }

const open = ref(false)
const users = ref<UserType[]>([])

const mainForm = reactive({
  group: '',
})

const userForm = reactive({
  name: '',
  age: undefined as number | undefined,
})

const userFormRef = shallowRef<FormInstance>()

function showUserModal() {
  open.value = true
}

function hideUserModal() {
  open.value = false
  userFormRef.value?.resetFields?.()
}

function handleUserFinish(values: any) {
  users.value = [...users.value, values as UserType]
  hideUserModal()
}

function handleFinish(values: any) {
  console.log('Finish:', values)
}
</script>

<template>
  <a-form
    name="basicForm"
    :model="mainForm"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item name="group" label="Group Name" :rules="[{ required: true }]">
      <a-input v-model:value="mainForm.group" />
    </a-form-item>

    <a-form-item label="User List">
      <a-flex v-if="users.length" vertical gap="8">
        <a-space v-for="user in users" :key="`${user.name}-${user.age}`">
          <a-avatar>
            <UserOutlined />
          </a-avatar>
          {{ `${user.name} - ${user.age}` }}
        </a-space>
      </a-flex>
      <a-typography-text v-else type="secondary" class="ant-form-text">
        (<SmileOutlined /> No user yet.)
      </a-typography-text>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button html-type="submit" type="primary">
        Submit
      </a-button>
      <a-button html-type="button" style="margin-left: 8px" @click="showUserModal">
        Add User
      </a-button>
    </a-form-item>
  </a-form>

  <a-modal
    v-model:open="open"
    title="Add User"
    ok-text="Create"
    cancel-text="Cancel"
    @cancel="hideUserModal"
    @ok="userFormRef?.submit?.()"
  >
    <a-form ref="userFormRef" layout="vertical" name="userForm" :model="userForm" @finish="handleUserFinish">
      <a-form-item name="name" label="User Name" :rules="[{ required: true }]">
        <a-input v-model:value="userForm.name" />
      </a-form-item>
      <a-form-item name="age" label="User Age" :rules="[{ required: true }]">
        <a-input-number v-model:value="userForm.age" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
