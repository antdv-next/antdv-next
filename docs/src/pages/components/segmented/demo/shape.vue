<docs lang="zh-CN">
胶囊型的 Segmented。
</docs>

<docs lang="en-US">
Round shape of Segmented.
</docs>

<script setup lang="ts">
import { MoonOutlined, SunOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const size = shallowRef<any>('medium')
const iconObj: Record<string, any> = {
  light: SunOutlined,
  dark: MoonOutlined,
}
</script>

<template>
  <a-flex gap="small" align="flex-start" vertical>
    <a-segmented v-model:value="size" :options="['small', 'medium', 'large']" />
    <a-segmented :options="[{ value: 'light' }, { value: 'dark' }]" :size="size" shape="round">
      <template #iconRender="{ value }">
        <component :is="iconObj[value]" v-if="iconObj[value]" />
      </template>
    </a-segmented>
  </a-flex>
</template>
