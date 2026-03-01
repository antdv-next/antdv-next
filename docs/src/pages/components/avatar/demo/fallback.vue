<docs lang="zh-CN">
图片不存在时，如果 `src` 本身是个 VNode，会尝试回退到 `src`，否则尝试回退到 `icon`，最后回退到显示 `children`。
</docs>

<docs lang="en-US">
When the image does not exist, if `src` is a VNode, it will try to fall back to `src`, otherwise it will try to fall back to `icon`, and finally fall back to displaying `children`.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-space>
    <a-avatar shape="circle" src="http://abc.com/not-exist.jpg">
      A
    </a-avatar>
    <a-avatar shape="circle" src="http://abc.com/not-exist.jpg">
      ABC
    </a-avatar>
  </a-space>
</template>
