<docs lang="zh-CN">
当 Tooltip 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。
</docs>

<docs lang="en-US">
Auto adjust Popup and arrow position when Tooltip is close to the edge of the screen. Will be out of screen when exceed limitation.
</docs>

<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  setTimeout(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight
    document.documentElement.scrollLeft = document.documentElement.clientWidth
  }, 10)
})
</script>

<template>
  <div class="h-300vh w-300vw flex items-center justify-center">
    <a-tooltip title="Thanks for using antd. Have a nice day !" open>
      <a-button type="primary">
        Scroll The Window
      </a-button>
    </a-tooltip>
  </div>
</template>
