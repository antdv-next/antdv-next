<docs lang="zh-CN">
`scriptUrl` 可引用多个资源，用户可灵活的管理 [iconfont.cn](http://iconfont.cn/) 图标。如果资源的图标出现重名，会按照数组顺序进行覆盖。
</docs>

<docs lang="en-US">
You can use `scriptUrl`  to manage icons in one icon from multiple [iconfont.cn](http://iconfont.cn/) resources. If an icon with a duplicate name is in resources, it will be overridden in array order.
</docs>

<script setup lang="ts">
import { createFromIconfontCN } from '@antdv-next/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
  ],
})
</script>

<template>
  <a-space>
    <IconFont type="icon-javascript" />
    <IconFont type="icon-java" />
    <IconFont type="icon-shoppingcart" />
    <IconFont type="icon-python" />
  </a-space>
</template>
