<docs lang="zh-CN">
使用 `Form.useForm()` 创建表单实例，在组件挂载前即可拿到表单方法。单个表单时无需手动绑定，`useForm()` 会自动连接到后代 `Form`。

> ⚠️ 不要解构 `useForm()` 的返回值（如 `const { validateFields } = useForm()`）。返回值是惰性代理，每次访问才从真实实例上取方法；解构会在 `Form` 挂载前就快照方法、捕获到空操作，从而丢失与实例的连接。请始终保留整个引用，通过 `form.xxx()` 调用。
</docs>

<docs lang="en-US">
Create a form instance with `Form.useForm()`. The instance is available before the `Form` mounts. With a single form you don't need to bind it manually—`useForm()` auto connects to the descendant `Form`.

> ⚠️ Do NOT destructure the value returned by `useForm()` (e.g. `const { validateFields } = useForm()`). It is a lazy proxy that resolves methods off the real instance on each access; destructuring snapshots a method before the `Form` mounts, capturing a no-op and losing the connection to the instance. Always keep the whole reference and call `form.xxx()`.
</docs>

<script setup lang="ts">
import { useForm } from 'antdv-next'
import { reactive } from 'vue'

// `useForm` 在 Form 挂载前即返回实例代理，单表单场景自动连接。
const form = useForm()

const model = reactive({
  note: '',
  gender: undefined as string | undefined,
})

const genderOptions = [
  { label: 'male', value: 'male' },
  { label: 'female', value: 'female' },
  { label: 'other', value: 'other' },
]

function handleFinish(values: any) {
  console.log('Finish:', values)
}

function handleReset() {
  form.resetFields()
}

function handleFill() {
  form.setFieldsValue({ note: 'Hello world!', gender: 'male' })
}

async function handleValidate() {
  try {
    const values = await form.validateFields()
    console.log('Valid:', values)
  }
  catch (err) {
    console.log('Validate failed:', err)
  }
}
</script>

<template>
  <a-form
    name="use-form"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item name="note" label="Note" :rules="[{ required: true }]">
      <a-input v-model:value="model.note" />
    </a-form-item>
    <a-form-item name="gender" label="Gender" :rules="[{ required: true }]">
      <a-select
        v-model:value="model.gender"
        allow-clear
        placeholder="Select a option"
        :options="genderOptions"
      />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="button" @click="handleValidate">
          Validate
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
