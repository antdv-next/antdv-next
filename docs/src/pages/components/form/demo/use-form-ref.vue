<docs lang="zh-CN">
通过模板 ref 显式绑定 `useForm` 实例（`<a-form :ref="form">`）。显式绑定优先级最高，适合在弹窗等延迟渲染的场景中提前持有表单实例，并在外部触发 `submit`。
</docs>

<docs lang="en-US">
Bind the `useForm` instance explicitly via a template ref (`<a-form :ref="form">`). Explicit binding has the highest priority and is handy when the form is rendered lazily (e.g. inside a modal) and you need to trigger `submit` from outside.
</docs>

<script setup lang="ts">
import { useForm } from 'antdv-next'
import { reactive, ref } from 'vue'

interface Values {
  title?: string
  description?: string
  modifier?: string
}

// 显式绑定：把 useForm 的实例作为函数 ref 传给 <a-form :ref="form">
const form = useForm()
const open = ref(false)
const formValues = ref<Values>()

const model = reactive({
  title: '',
  description: '',
  modifier: 'public',
})

function handleCreate(values: Values) {
  console.log('Received values of form: ', values)
  formValues.value = values
  open.value = false
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-button type="primary" @click="open = true">
      New Collection
    </a-button>
    <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
  </a-space>

  <a-modal
    v-model:open="open"
    title="Create a new collection"
    ok-text="Create"
    cancel-text="Cancel"
    :ok-button-props="{ autoFocus: true, htmlType: 'submit' }"
    @cancel="open = false"
    @ok="form.submit()"
  >
    <a-form
      :ref="form"
      layout="vertical"
      name="use_form_ref"
      :model="model"
      clear-on-destroy
      @finish="handleCreate"
    >
      <a-form-item
        name="title"
        label="Title"
        :rules="[{ required: true, message: 'Please input the title of collection!' }]"
      >
        <a-input v-model:value="model.title" />
      </a-form-item>
      <a-form-item name="description" label="Description">
        <a-textarea v-model:value="model.description" />
      </a-form-item>
      <a-form-item name="modifier">
        <a-radio-group v-model:value="model.modifier">
          <a-radio value="public">
            Public
          </a-radio>
          <a-radio value="private">
            Private
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
