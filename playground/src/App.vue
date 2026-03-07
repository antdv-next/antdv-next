<script setup lang="ts">
import { AimOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const data = ref<{ name: string }>({
  name: ' ',
})
</script>

<template>
  <div>
    <a-app class="w-full px-10">
      <AimOutlined />
      <a-button type="primary">
        测试
      </a-button>
      <a-divider />
      <a-alert type="info" message="This is an info alert" show-icon />
      <a-spin :spinning="false">
        <a-form :model="data" validate-trigger="blur" :label-col="{ span: 4 }">
          <a-form-item label="名称" name="name">
            <a-select
              v-model:value="data.name"
              placeholder="请选择"
              allow-clear
              :show-search="{
                optionFilterProp: 'label',
              }"
              :options="[
                {
                  label: '张三',
                  value: 'zhangsan',
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-app>
    <a-select
      placeholder="请选择"
      allow-clear
      :show-search="{
        optionFilterProp: 'label',
      }"
      :options="[
        {
          label: '张三',
          value: 'zhangsan',
        },
      ]"
    />
  </div>
</template>
