<docs lang="zh-CN">
加载占位图包含子组件
</docs>

<docs lang="en-US">
Skeleton contains sub component.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
function showSkeleton() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
}
</script>

<template>
  <a-space vertical style="width: 100%" :size="16">
    <a-skeleton :loading="loading" active>
      <h4 style="margin-bottom: 16px">
        Antdv Next, a design language
      </h4>
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully
        and efficiently.
      </p>
    </a-skeleton>
    <a-button :disabled="loading" @click="showSkeleton">
      Show Skeleton
    </a-button>
  </a-space>
</template>
