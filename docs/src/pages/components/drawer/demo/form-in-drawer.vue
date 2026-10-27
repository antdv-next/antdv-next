<docs lang="zh-CN">
在抽屉中使用表单。
</docs>

<docs lang="en-US">
Use a form in Drawer with a submit button.
</docs>

<script setup lang="ts">
import { PlusOutlined } from '@antdv-next/icons'
import { reactive, ref } from 'vue'

const open = ref(false)

const formState = reactive({
  name: '',
  url: '',
  owner: undefined as string | undefined,
  type: undefined as string | undefined,
  approver: undefined as string | undefined,
  dateTime: undefined as any,
  description: '',
})

const ownerOptions = [
  { label: 'Xiaoxiao Fu', value: 'xiao' },
  { label: 'Maomao Zhou', value: 'mao' },
]
const typeOptions = [
  { label: 'private', value: 'private' },
  { label: 'public', value: 'public' },
]
const approverOptions = [
  { label: 'Jack Ma', value: 'jack' },
  { label: 'Tom Liu', value: 'tom' },
]

function getPopupContainer(trigger: HTMLElement) {
  return trigger.parentElement || document.body
}
</script>

<template>
  <a-button type="primary" @click="open = true">
    <template #icon>
      <PlusOutlined />
    </template>
    New account
  </a-button>
  <a-drawer
    v-model:open="open"
    title="Create a new account"
    :size="720"
    :styles="{ body: { paddingBottom: '80px' } }"
    @close="open = false"
  >
    <template #extra>
      <a-space>
        <a-button @click="open = false">
          Cancel
        </a-button>
        <a-button type="primary" @click="open = false">
          Submit
        </a-button>
      </a-space>
    </template>
    <a-form layout="vertical" :model="formState" :required-mark="false">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="name"
            label="Name"
            :rules="[{ required: true, message: 'Please enter user name' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Please enter user name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="url"
            label="Url"
            :rules="[{ required: true, message: 'Please enter url' }]"
          >
            <a-space-compact block>
              <a-space-addon>http://</a-space-addon>
              <a-input v-model:value="formState.url" placeholder="Please enter url" />
              <a-space-addon>.com</a-space-addon>
            </a-space-compact>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="owner"
            label="Owner"
            :rules="[{ required: true, message: 'Please select an owner' }]"
          >
            <a-select
              v-model:value="formState.owner"
              placeholder="Please select an owner"
              :options="ownerOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="type"
            label="Type"
            :rules="[{ required: true, message: 'Please choose the type' }]"
          >
            <a-select
              v-model:value="formState.type"
              placeholder="Please choose the type"
              :options="typeOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            name="approver"
            label="Approver"
            :rules="[{ required: true, message: 'Please choose the approver' }]"
          >
            <a-select
              v-model:value="formState.approver"
              placeholder="Please choose the approver"
              :options="approverOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            name="dateTime"
            label="DateTime"
            :rules="[{ required: true, message: 'Please choose the dateTime' }]"
          >
            <a-range-picker
              v-model:value="formState.dateTime"
              style="width: 100%"
              :get-popup-container="getPopupContainer"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            name="description"
            label="Description"
            :rules="[{ required: true, message: 'please enter url description' }]"
          >
            <a-textarea v-model:value="formState.description" :rows="4" placeholder="please enter url description" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>
</template>
