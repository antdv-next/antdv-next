<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Form 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Form by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { FormProps } from 'antdv-next'
import { reactive } from 'vue'

const classes = {
  root: 'form-demo-root',
}

const stylesObject: FormProps['styles'] = {
  label: {
    textAlign: 'end',
    color: '#333',
    fontWeight: 500,
  },
  content: {
    paddingInlineStart: '12px',
  },
}

const stylesFunction: FormProps['styles'] = (info) => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #1677FF',
      },
      label: {
        textAlign: 'end',
        color: '#1677FF',
      },
      content: {
        paddingInlineStart: '12px',
      },
    } satisfies FormProps['styles']
  }
  return {}
}

const model = reactive({
  username: '',
  email: '',
})

const sharedProps: FormProps = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  autoComplete: 'off',
  classes,
}
</script>

<template>
  <a-form
    :model="model"
    v-bind="sharedProps"
    :styles="stylesObject"
  >
    <a-form-item label="UserName" name="username" :rules="[{ required: true, message: 'Please enter username!' }]">
      <a-input v-model:value="model.username" placeholder="Please enter username" />
    </a-form-item>
    <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please enter email!' }]">
      <a-input v-model:value="model.email" placeholder="Please enter email" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="reset">
          Reset
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-form
    :model="model"
    v-bind="sharedProps"
    :styles="stylesFunction"
    variant="filled"
  >
    <a-form-item label="UserName" name="username" :rules="[{ required: true, message: 'Please enter username!' }]">
      <a-input v-model:value="model.username" placeholder="Please enter username" />
    </a-form-item>
    <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Please enter email!' }]">
      <a-input v-model:value="model.email" placeholder="Please enter email" />
    </a-form-item>
    <a-form-item :label="null">
      <a-space>
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
        <a-button html-type="reset">
          Reset
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style scoped>
.form-demo-root {
  padding: var(--ant-padding);
  max-width: 800px;
  margin-top: 32px;
  background-color: var(--ant-color-bg-container);
  border-radius: var(--ant-border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
