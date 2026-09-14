<docs lang="zh-CN">
添加 `loading` 属性即可让按钮处于加载状态，`loading.icon` 可以自定义加载图标，最后三个按钮演示点击后进入加载状态。
</docs>

<docs lang="en-US">
A loading indicator can be added to a button by setting the `loading` property on the `Button`. The `loading.icon` can be used to customize the loading icon.
</docs>

<script setup lang="ts">
import { PoweroffOutlined, SyncOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const loadings = ref<boolean[]>([])
function enterLoading(index: number) {
  loadings.value[index] = true
  setTimeout(() => {
    loadings.value[index] = false
  }, 3000)
}
</script>

<template>
  <a-flex gap="small" vertical>
    <a-flex gap="small" align="center" wrap>
      <a-button type="primary" loading>
        Loading
      </a-button>
      <a-button type="primary" size="small" loading>
        Loading
      </a-button>
      <a-button type="primary" loading>
        <template #icon>
          <PoweroffOutlined />
        </template>
      </a-button>
      <a-button type="primary" loading>
        Loading Icon
        <template #loadingIcon>
          <SyncOutlined spin />
        </template>
      </a-button>
    </a-flex>
    <a-flex gap="small" wrap>
      <a-button type="primary" :loading="loadings[0]" @click="enterLoading(0)">
        Icon Start
      </a-button>
      <a-button type="primary" :loading="loadings[2]" icon-placement="end" @click="enterLoading(2)">
        Icon End
      </a-button>
      <a-button type="primary" :loading="loadings[1]" @click="enterLoading(1)">
        Icon Replace
        <template #icon>
          <PoweroffOutlined />
        </template>
      </a-button>
      <a-button type="primary" :loading="loadings[3]" @click="enterLoading(3)">
        <template #icon>
          <PoweroffOutlined />
        </template>
      </a-button>
      <a-button type="primary" :loading="loadings[3]" @click="enterLoading(3)">
        <template #icon>
          <PoweroffOutlined />
        </template>
        <template #loadingIcon>
          <SyncOutlined spin />
        </template>
        Loading Icon
      </a-button>
    </a-flex>
  </a-flex>
</template>
