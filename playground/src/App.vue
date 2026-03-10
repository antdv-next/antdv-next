<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, shallowRef } from 'vue'

const formRef = shallowRef<FormInstance>()
const model = reactive({
  note: '',
  note2: '',
  gender: undefined as number | undefined,
  customizeGender: '',
})

const genderOptions = [
  { label: 'male', value: 1 },
  { label: 'female', value: 2 },
  { label: 'other', value: 3 },
]

function handleGenderChange(value: number) {
  switch (value) {
    case 1:
      model.note = 'Hi, man!'
      break
    case 2:
      model.note = 'Hi, lady!'
      break
    case 3:
      model.note = 'Hi there!'
      break
    default:
      break
  }
}

function handleFinish(_values: any) {
  // console.log(values)
}

function handleReset() {
  formRef.value?.resetFields?.()
}

function handleFill() {
  formRef.value?.setFieldsValue?.({ note: 'Hello world!', gender: 'male' })
}
</script>

<template>
  <a-form
    ref="formRef"
    name="control-hooks"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    :rules="{
      note: [{ required: true, message: 'xxx', validateTrigger: 'blur' }],
      note2: [{ required: true, message: 'xxx', trigger: 'blur' }],
      gender: [
        { required: true, message: '性别错误' },
      ],
    }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item name="note" label="Note">
      <a-input v-model:value="model.note" />
    </a-form-item>
    <a-form-item name="note2" label="Note2">
      <a-input v-model:value="model.note2" />
    </a-form-item>
    <a-form-item name="gender" label="Gender">
      <a-select
        v-model:value="model.gender"
        allow-clear
        placeholder="Select a option and change input text above"
        :options="genderOptions"
        @change="handleGenderChange"
      />
    </a-form-item>
    <a-form-item
      v-if="model.gender === 3"
      name="customizeGender"
      label="Customize Gender"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="model.customizeGender" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleReset">
          Reset
        </a-button>
        <a-button type="link" html-type="button" @click="handleFill">
          Fill form
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>
