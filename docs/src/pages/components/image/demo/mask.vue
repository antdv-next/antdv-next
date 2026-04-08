<docs lang="zh-CN">
遮罩效果，默认 `blur`。
</docs>

<docs lang="en-US">
mask effect, default `blur`.
</docs>

<template>
  <a-image
    :width="100"
    alt="Default blur"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    :preview="{
      mask: true,
    }"
  >
    <template #cover>
      <a-space vertical align="center">
        Default blur
      </a-space>
    </template>
  </a-image>
  <a-image
    :width="100"
    alt="Dimmed mask"
    src="https://www.antdv-next.com/antdv-next.svg"
    :preview="{
      mask: { blur: false },
    }"
  >
    <template #cover>
      <a-space vertical align="center">
        Dimmed mask
      </a-space>
    </template>
  </a-image>
  <a-image
    :width="100"
    alt="No mask"
    src="https://cn.vuejs.org/logo.svg"
    :preview="{
      mask: false,
    }"
  >
    <template #cover>
      <a-space vertical align="center">
        No mask
      </a-space>
    </template>
  </a-image>
</template>
