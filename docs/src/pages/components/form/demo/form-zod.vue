<docs lang="zh-CN">
表单本身没有内置 [zod](https://zod.dev) 校验，但可以通过 `Form.Item` 的自定义 `validator` 规则桥接：在 `validator` 里用 zod 的 `safeParse` 校验，失败时 `throw` 出错误信息即可。

下面用一个 `zodValidator` 小工具把 zod 字段 schema 转成一条校验规则复用。校验失败时务必 **抛出错误**（或返回 reject 的 Promise），而不是返回 `false`，错误信息才能正确展示。
</docs>

<docs lang="en-US">
Form has no built-in [zod](https://zod.dev) validation, but you can bridge it through a custom `validator` rule on `Form.Item`: validate with zod's `safeParse` inside `validator` and `throw` the message on failure.

The `zodValidator` helper below turns a zod field schema into a reusable rule. On failure you must **throw an error** (or return a rejected Promise) instead of returning `false`, otherwise the message won't show.
</docs>

<script setup lang="ts">
import type { Rule } from 'antdv-next'
import type { ZodType } from 'zod'
import { reactive } from 'vue'
import { z } from 'zod'

// 整个表单的 zod schema
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/\d/, 'Must contain a number'),
  website: z.union([z.literal(''), z.url('Please enter a valid URL')]),
})

// 把单个 zod 字段 schema 转成一条 Form.Item 校验规则
function zodValidator(field: ZodType): Rule {
  return {
    async validator(_rule, value) {
      const result = field.safeParse(value)
      if (!result.success)
        throw new Error(result.error.issues[0].message)
    },
  }
}

const model = reactive({
  username: '',
  email: '',
  password: '',
  website: '',
})

function handleFinish(values: any) {
  // 提交时整体再校验一次，拿到经过 zod 解析（含类型转换）的数据
  console.log('Parsed values:', schema.parse(values))
}
</script>

<template>
  <a-form
    name="form-zod"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item label="Username" name="username" :rules="[zodValidator(schema.shape.username)]">
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item label="Email" name="email" :rules="[zodValidator(schema.shape.email)]">
      <a-input v-model:value="model.email" />
    </a-form-item>
    <a-form-item label="Password" name="password" :rules="[zodValidator(schema.shape.password)]">
      <a-input-password v-model:value="model.password" />
    </a-form-item>
    <a-form-item label="Website" name="website" :rules="[zodValidator(schema.shape.website)]">
      <a-input v-model:value="model.website" placeholder="https://" />
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
