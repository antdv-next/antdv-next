<docs lang="zh-CN">
在同一行组合多个控件。

当带有 `label` 的外层 `a-form-item` 没有 `name` 时，它无法自动推断内层控件的 ID。如果该标签对应一个控件，请为外层设置 `html-for`，并为内层控件设置相同的 `id`，以保留点击标签聚焦和屏幕阅读器关联。
</docs>

<docs lang="en-US">
Combine multiple controls in one line.

When the outer labeled `a-form-item` has no `name`, it cannot infer the nested control's ID. If the label describes a single control, set `html-for` on the outer item and the same `id` on the nested control to preserve label-click focus and screen reader association.
</docs>

<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  username: '',
  address: {
    province: undefined as string | undefined,
    street: '',
  },
  year: '',
  month: '',
})

const provinceOptions = [
  { label: 'Zhejiang', value: 'Zhejiang' },
  { label: 'Jiangsu', value: 'Jiangsu' },
]

function handleFinish(values: any) {
  console.log('Received values of form: ', values)
}
</script>

<template>
  <a-form
    name="complex-form"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item label="Username" html-for="username">
      <a-space>
        <a-form-item
          name="username"
          no-style
          :rules="[{ required: true, message: 'Username is required' }]"
        >
          <a-input id="username" v-model:value="model.username" style="width: 160px" placeholder="Please input" />
        </a-form-item>
        <a-tooltip title="Useful information">
          <a-typography-link href="#API">
            Need Help?
          </a-typography-link>
        </a-tooltip>
      </a-space>
    </a-form-item>

    <a-form-item label="Address">
      <a-space-compact block>
        <a-form-item
          :name="['address', 'province']"
          no-style
          :rules="[{ required: true, message: 'Province is required' }]"
        >
          <a-select v-model:value="model.address.province" placeholder="Select province" :options="provinceOptions" />
        </a-form-item>
        <a-form-item
          :name="['address', 'street']"
          no-style
          :rules="[{ required: true, message: 'Street is required' }]"
        >
          <a-input v-model:value="model.address.street" style="width: 50%" placeholder="Input street" />
        </a-form-item>
      </a-space-compact>
    </a-form-item>

    <a-form-item label="BirthDate" style="margin-bottom: 0">
      <a-form-item
        name="year"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px)"
      >
        <a-input v-model:value="model.year" placeholder="Input birth year" />
      </a-form-item>
      <a-form-item
        name="month"
        :rules="[{ required: true }]"
        style="display: inline-block; width: calc(50% - 8px); margin: 0 8px"
      >
        <a-input v-model:value="model.month" placeholder="Input birth month" />
      </a-form-item>
    </a-form-item>

    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
