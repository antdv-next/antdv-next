<docs lang="zh-CN">
大图使用 placeholder 渐进加载。
</docs>

<docs lang="en-US">
Progressive when large image loading.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const random = shallowRef(Date.now())

function setRandom() {
  random.value = Date.now()
}
</script>

<template>
  <a-space :size="12">
    <a-image :width="200" alt="basic image" :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`">
      <template #placeholder>
        <a-image
          :preview="false"
          alt="placeholder image"
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          :width="200"
        />
      </template>
    </a-image>
    <a-button
      type="primary"
      @click="setRandom"
    >
      Reload
    </a-button>
  </a-space>
</template>
