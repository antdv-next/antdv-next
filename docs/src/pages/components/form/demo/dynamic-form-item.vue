<docs lang="zh-CN">
动态增减表单项。
</docs>

<docs lang="en-US">
Add and remove form items dynamically.
</docs>

<script setup lang="ts">
import { MinusCircleOutlined, PlusOutlined } from '@antdv-next/icons'
import { reactive } from 'vue'

const model = reactive({
  names: [''],
})

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
}

const formItemLayoutWithoutLabel = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 4 } },
}

function addField(value = '') {
  model.names.push(value)
}

function addFieldAtHead() {
  model.names.unshift('The head item')
}

function removeField(index: number) {
  model.names.splice(index, 1)
}

function handleFinish(values: any) {
  console.log('Received values of form:', values)
}
</script>

<template>
  <a-form
    name="dynamic_form_item"
    :model="model"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <template v-for="(_, index) in model.names" :key="`passenger-${index}`">
      <a-form-item
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithoutLabel"
        :label="index === 0 ? 'Passengers' : ''"
        :name="['names', index]"
        :rules="[{ required: true, message: 'Please input passenger\'s name or delete this field.' }]"
      >
        <a-input v-model:value="model.names[index]" placeholder="passenger name" style="width: 60%" />
        <MinusCircleOutlined
          v-if="model.names.length > 1"
          class="dynamic-delete-button"
          style="margin-left: 8px"
          @click="removeField(index)"
        />
      </a-form-item>
    </template>

    <a-form-item v-bind="formItemLayoutWithoutLabel">
      <a-space direction="vertical" style="width: 60%">
        <a-button type="dashed" block @click="addField()">
          <template #icon>
            <PlusOutlined />
          </template>
          Add field
        </a-button>
        <a-button type="dashed" block @click="addFieldAtHead">
          <template #icon>
            <PlusOutlined />
          </template>
          Add field at head
        </a-button>
      </a-space>
    </a-form-item>

    <a-form-item v-bind="formItemLayoutWithoutLabel">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
