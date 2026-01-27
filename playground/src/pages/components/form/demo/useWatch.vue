<docs lang="zh-CN">
使用响应式监听表单字段。
</docs>

<docs lang="en-US">
Watch form values with Vue reactivity.
</docs>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

const model = reactive({
  username: 'Antdv Next',
  age: 18,
})

const watched = computed(() => ({
  username: model.username,
  age: model.age,
}))

watch(
  () => ({ ...model }),
  (val) => {
    console.log('form values changed:', val)
  },
)
</script>

<template>
  <a-form layout="vertical" :model="model" style="max-width: 600px">
    <a-form-item name="username" label="Username">
      <a-input v-model:value="model.username" />
    </a-form-item>
    <a-form-item name="age" label="Age">
      <a-input-number v-model:value="model.age" style="width: 100%" />
    </a-form-item>
    <a-form-item label="Watched Values">
      <pre style="margin: 0">{{ JSON.stringify(watched, null, 2) }}</pre>
    </a-form-item>
  </a-form>
</template>
